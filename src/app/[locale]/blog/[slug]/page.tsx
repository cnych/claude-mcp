import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostDetails, getBlogPosts } from '@/data/blog-posts';
import BlogPost from '@/components/BlogPost';
import { locales } from '@/i18n/config';

// 设置静态生成和缓存
export const revalidate = 3600; // 每小时重新验证


// 预生成所有可能的客户端页面路径
// 预生成所有可能的客户端详情页面路径
export async function generateStaticParams() {
  const params = [];
  
  try {
    // 为每种语言加载所有可能的客户端ID
    for (const locale of locales) {
      try {
        const posts = await getBlogPosts(locale);
        for (const post of posts) {
          params.push({ locale, slug: post.slug });
        }
      } catch (err) {
        console.error(`Could not read blogs directory for locale: ${locale}`, err);
      }
    }
  } catch (error) {
    console.error('Failed to generate static params for blog posts:', error);
  }
  
  return params;
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getBlogPostDetails(slug, locale);

  if (!post) {
    return {
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist or has been removed',
    };
  }

  // 使用content的前100个字符作为摘要，或者使用标题
  const description = post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 100) + '...';

  return {
    title: `${post.title} | Claude MCP Blog`,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      url: locale === 'en' ? `https://www.claudemcp.com/blog/${slug}` : `https://www.claudemcp.com/${locale}/blog/${slug}`,
      images: post.coverImage ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    alternates: {
      canonical: locale === 'en' ? `https://www.claudemcp.com/blog/${slug}` : `https://www.claudemcp.com/${locale}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale } = await params;
  const post = await getBlogPostDetails(slug, locale);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-5xl py-12 md:py-16">
      <BlogPost post={post} />
    </div>
  );
} 