import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
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
  const t = await getTranslations();
  const post = await getBlogPostDetails(slug, locale);

  if (!post) {
    return {
      title: t('Blog.meta.title'),
      description: t('Blog.meta.description'),
    };
  }

  // 使用content的前100个字符作为摘要，或者使用标题
  const title = `${post.title} | ${t('Blog.meta.title')}`
  let description = post.excerpt || post.content.replace(/<[^>]*>/g, '');
  if (description.length < 160) {
    description = `${description} - ${t('Blog.meta.description')}`;
  }
  description = description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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