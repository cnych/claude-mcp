import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/hero-section';
import { OverviewSection } from '@/components/home/overview-section';
import { ProtocolSection } from '@/components/home/protocol-section';
import { IntegrationSection } from '@/components/home/integration-section';
import { GlobalSection } from '@/components/home/global-section';
import { FeaturedServers } from '@/components/home/featured-servers';
import { FeaturedClients } from '@/components/home/featured-clients';
import { LatestDocs } from '@/components/home/latest-docs';
import { LatestBlogPosts } from '@/components/home/latest-blog-posts';
import { PlaygroundInspectorSection } from '@/components/home/playground-inspector-section';
import { loadServersData, loadClientsData } from '@/lib/data-utils';
import { getLatestDocs } from '@/lib/docs';
import { getBlogPosts } from '@/data/blog-posts';
import { locales } from '@/i18n/config';
import type { MCPClient } from '@/types/client';
import type { MCPServer } from '@/types/server';

// 设置静态生成和缓存
export const revalidate = 3600; // 每小时重新验证

type PageProps = {  
    params: Promise<{ locale: string }>;
}

// 预生成所有可能的主页路径
export async function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('Index');
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    icons: {
      icon: "/logo.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      url: locale === 'en' ? `https://www.claudemcp.com` : `https://www.claudemcp.com/${locale}`,
      title: t('meta.og.title'),
      description: t('meta.og.description'),
      images: ['/og.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.twitter.title'),
      description: t('meta.twitter.description'),
      images: ['/og.png'],
    },
    alternates: {
        canonical: locale === 'en' ? `https://www.claudemcp.com` : `https://www.claudemcp.com/${locale}`,
    },
    manifest: "/site.webmanifest",
  };
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  
  // 加载精选服务器数据
  const { servers: featuredServers } = await loadServersData(locale, 0, (server: MCPServer) => {
    return server.featured === true;
  });
  
  // 加载精选客户端数据
  const { clients: featuredClients } = await loadClientsData(locale, 6, (client: MCPClient) => {
    return client.featured === true;
  });
  
  // 加载最新文档
  const latestDocs = await getLatestDocs(locale, 9);

  // 加载最新博客文章
  const latestBlogPosts = await getBlogPosts(locale);

  return (
    <main className="flex min-h-screen flex-col antialiased overflow-x-hidden">
      <HeroSection />
      <PlaygroundInspectorSection />
      <LatestDocs docs={latestDocs} />
      <FeaturedServers servers={featuredServers} />
      <FeaturedClients clients={featuredClients} />
      <OverviewSection />
      <ProtocolSection />
      <IntegrationSection />
      <LatestBlogPosts posts={latestBlogPosts} />
      <GlobalSection />
    </main>
  );
} 