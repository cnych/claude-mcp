import { SearchBar } from '@/components/SearchBar';
import { ServerList } from '@/components/ServerList';
import { TagList } from '@/components/TagList';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { loadServersData } from '@/lib/data-utils';
import { locales } from '@/i18n/config';
import type { MCPServer } from '@/types/server';

// 设置静态生成和缓存
export const revalidate = 3600; // 每小时重新验证

type PageProps = {  
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 预生成所有可能的服务器页面路径
export async function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();

  return {
    title: `${t('Servers.title')} | ${t('Index.meta.title')}`,
    description: `${t('Servers.description')} | ${t('Index.meta.title')}`,
    icons: {
      icon: "/logo.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: `${t('Servers.title')} | ${t('Index.meta.og.title')}`,
      description: `${t('Servers.description')} | ${t('Index.meta.og.title')}`,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('Servers.title')} | ${t('Index.meta.twitter.title')}`,
      description: `${t('Servers.description')} | ${t('Index.meta.twitter.title')}`,
      images: ['/twitter-image.png'],
    },
    alternates: {
      canonical: locale === 'en' ? `https://www.claudemcp.com/servers` : `https://www.claudemcp.com/${locale}/servers`,
    },
    manifest: "/site.webmanifest",
  };
}

export default async function ServersPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('Servers');
  
  // 从URL参数创建过滤函数
  const awaitedSearchParams = await searchParams || {};
  
  const filterFn = (server: MCPServer) => {
    // 标签过滤
    const filterTag = awaitedSearchParams.tags?.toString();
    let tagMatch = true;
    
    if (filterTag && filterTag.trim() !== '') {
      // 检查服务器是否包含选定的标签
      tagMatch = server.tags.includes(filterTag);
    }
    
    // 关键词过滤
    const query = awaitedSearchParams.q?.toString().toLowerCase();
    const keywordMatch = !query || 
        server.name.toLowerCase().includes(query) || 
        server.digest.toLowerCase().includes(query) ||
        server.description.toLowerCase().includes(query);
        
    // 只有同时满足标签和关键词过滤条件的服务器才返回
    return tagMatch && keywordMatch;
  };
  
  // 加载服务器数据
  const { servers, tags } = await loadServersData(locale, undefined, filterFn);
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="max-w-7xl mx-auto text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        {t('title')}
      </h1>
      
      <div className="space-y-6 max-w-7xl mx-auto">
        <SearchBar position="Servers" />
        <TagList initialTags={tags} />
        <ServerList servers={servers} />
      </div>
    </div>
  );
} 