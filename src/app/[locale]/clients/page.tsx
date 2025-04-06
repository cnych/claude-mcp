import { SearchBar } from '@/components/SearchBar';
import { ClientList } from '@/components/ClientList';
import { TagList } from '@/components/TagList';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { loadClientsData } from '@/lib/data-utils';
import { locales } from '@/i18n/config';
import type { MCPClient } from '@/types/client';

// 设置静态生成和缓存
export const revalidate = 3600; // 每小时重新验证

type PageProps = {  
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 预生成所有可能的客户端页面路径
export async function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();

  return {
    title: `${t('Clients.title')} | ${t('Index.meta.title')}`,
    description: `${t('Clients.description')} | ${t('Index.meta.title')}`,
    icons: {
      icon: "/logo.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: `${t('Clients.title')} | ${t('Index.meta.og.title')}`,
      description: `${t('Clients.description')} | ${t('Index.meta.og.title')}`,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('Clients.title')} | ${t('Index.meta.twitter.title')}`,
      description: `${t('Clients.description')} | ${t('Index.meta.twitter.title')}`,
      images: ['/twitter-image.png'],
    },
    alternates: {
      canonical: locale === 'en' ? `https://www.claudemcp.com/clients` : `https://www.claudemcp.com/${locale}/clients`,
    },
    manifest: "/site.webmanifest",
  };
}

export default async function ClientsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('Clients');
  
  // 从URL参数创建过滤函数
  const awaitedSearchParams = await searchParams || {};
  
  const filterFn = (client: MCPClient) => {
    // 标签过滤
    const filterTag = awaitedSearchParams.tags?.toString();
    let tagMatch = true;
    
    if (filterTag && filterTag.trim() !== '') {
      // 检查客户端是否包含选定的标签
      tagMatch = client.tags.includes(filterTag);
    }
    
    // 关键词过滤
    const query = awaitedSearchParams.q?.toString().toLowerCase();
    const keywordMatch = !query || 
        client.name.toLowerCase().includes(query) || 
        client.digest.toLowerCase().includes(query) ||
        client.description.toLowerCase().includes(query);
        
    // 只有同时满足标签和关键词过滤条件的客户端才返回
    return tagMatch && keywordMatch;
  };
  
  // 加载客户端数据
  const { clients, tags } = await loadClientsData(locale, undefined, filterFn);
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="max-w-7xl mx-auto text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        {t('title')}
      </h1>
      
      <div className="space-y-6 max-w-7xl mx-auto">
        <SearchBar position="Clients" />
        <TagList initialTags={tags} />
        <ClientList clients={clients} />
      </div>
    </div>
  );
}
