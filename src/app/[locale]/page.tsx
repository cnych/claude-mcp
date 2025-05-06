import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Suspense, lazy } from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { IntegrationSection } from '@/components/home/integration-section';
import { loadServersData, loadClientsData } from '@/lib/data-utils';
import { getLatestDocs } from '@/lib/docs';
import { getBlogPosts } from '@/data/blog-posts';
import { locales } from '@/i18n/config';
import type { MCPClient } from '@/types/client';
import type { MCPServer } from '@/types/server';

// 懒加载非首屏关键组件
const PlaygroundInspectorSection = lazy(() => import('@/components/home/playground-inspector-section').then(mod => ({ default: mod.PlaygroundInspectorSection })));
const LatestDocs = lazy(() => import('@/components/home/latest-docs').then(mod => ({ default: mod.LatestDocs })));
const FeaturedServers = lazy(() => import('@/components/home/featured-servers').then(mod => ({ default: mod.FeaturedServers })));
const FeaturedClients = lazy(() => import('@/components/home/featured-clients').then(mod => ({ default: mod.FeaturedClients })));
const OverviewSection = lazy(() => import('@/components/home/overview-section').then(mod => ({ default: mod.OverviewSection })));
const ProtocolSection = lazy(() => import('@/components/home/protocol-section').then(mod => ({ default: mod.ProtocolSection })));
const LatestBlogPosts = lazy(() => import('@/components/home/latest-blog-posts').then(mod => ({ default: mod.LatestBlogPosts })));
const GlobalSection = lazy(() => import('@/components/home/global-section').then(mod => ({ default: mod.GlobalSection })));

// 占位组件 - 用于懒加载时显示
const SectionPlaceholder = () => (
  <div className="w-full py-16 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

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
      {/* 首屏立即加载关键内容 */}
      <HeroSection />
      
      {/* 懒加载非首屏内容 */}
      <Suspense fallback={<SectionPlaceholder />}>
        <PlaygroundInspectorSection />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <LatestDocs docs={latestDocs} />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <FeaturedServers servers={featuredServers} />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <FeaturedClients clients={featuredClients} />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <OverviewSection />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <ProtocolSection />
      </Suspense>
      
      {/* 直接渲染优化的CSS动画组件 */}
      <IntegrationSection />
      
      <Suspense fallback={<SectionPlaceholder />}>
        <LatestBlogPosts posts={latestBlogPosts} />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <GlobalSection />
      </Suspense>
    </main>
  );
} 