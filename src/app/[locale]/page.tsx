import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/hero-section';
import { OverviewSection } from '@/components/home/overview-section';
import { ProtocolSection } from '@/components/home/protocol-section';
import { IntegrationSection } from '@/components/home/integration-section';
import { GlobalSection } from '@/components/home/global-section';
import { FeaturedServers } from '@/components/home/featured-servers';
import { loadServersData } from '@/lib/data-utils';
import { locales } from '@/i18n/config';

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
      title: t('meta.og.title'),
      description: t('meta.og.description'),
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.twitter.title'),
      description: t('meta.twitter.description'),
      images: ['/twitter-image.png'],
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
  const { servers: featuredServers } = await loadServersData(locale, 6);
  
  return (
    <main className="flex min-h-screen flex-col antialiased">
      <HeroSection />
      <FeaturedServers servers={featuredServers} />
      <OverviewSection />
      <ProtocolSection />
      <IntegrationSection />
      <GlobalSection />
    </main>
  );
} 