import { Metadata } from 'next';
import { getBlogPosts, getCategories } from '@/data/blog-posts';
import BlogList from '@/components/BlogList';
import { FileTextIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';


// 设置静态生成和缓存
export const revalidate = 3600; // 每小时重新验证


// 预生成所有可能的客户端页面路径
export async function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

interface BlogPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();

  const title = `${t('Blog.meta.title')} - ${t('Index.meta.title')}`;
  let description = `${t('Blog.meta.description')} - ${t('Index.meta.description')}`;
  if (description.length > 160) {
    description = description.slice(0, 160);
  }

  return {
    title,
    description,
    icons: {
      icon: "/logo.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      url: locale === 'en' ? `https://www.claudemcp.com/blog` : `https://www.claudemcp.com/${locale}/blog`,
      title,
      description,
      images: ['/og.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.png'],
    },
    alternates: {
      canonical: locale === 'en' ? `https://www.claudemcp.com/blog` : `https://www.claudemcp.com/${locale}/blog`,
    },
    manifest: "/site.webmanifest",
  };
}


export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations('Blog');
  const categories = await getCategories(locale);
  const posts = await getBlogPosts(locale);

  return (
    <div className="container mx-auto max-w-7xl py-12 md:py-20">
      <div className="mb-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <FileTextIcon className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{t('page.title')}</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {t('page.description')}
        </p>
      </div>

      <BlogList posts={posts} categories={categories} />
    </div>
  );
} 