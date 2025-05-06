import { ServerDetails } from '@/components/ServerDetails';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { loadServerDetail, loadServersData } from '@/lib/data-utils';
import { readdir } from 'fs/promises';
import path from 'path';
import { locales } from '@/i18n/config';
import { notFound } from 'next/navigation';
import type { MCPServer } from '@/types/server';

// 每小时重新生成页面
export const revalidate = 3600;

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
}

// 预生成所有可能的服务器详情页面路径
export async function generateStaticParams() {
  const params = [];
  
  try {
    // 为每种语言加载所有可能的服务器ID
    for (const locale of locales) {
      try {
        const serversDir = path.join(process.cwd(), 'public/servers', locale);
        const files = await readdir(serversDir);
        
        for (const file of files) {
          if (file.endsWith('.md')) {
            const id = file.replace('.md', '');
            params.push({ locale, id });
          }
        }
      } catch (err) {
        console.error(`Could not read servers directory for locale: ${locale}`, err);
      }
    }
  } catch (error) {
    console.error('Failed to generate static params for server details:', error);
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations('Servers');
  const tIndex = await getTranslations('Index');
  
  // 加载服务器详情
  const server = await loadServerDetail(locale, id);
  
  if (!server) {
    return {
      title: t('notFound'),
      description: t('notFoundDescription'),
    };
  }

  const title = `${server.name} - ${t('title')}`;
  let description = `${server.digest} - ${t('title')} - ${tIndex('meta.title')}`;
  if (description.length > 160) {
    description = `${description.substring(0, 160)}`;
  }
  
  return {
    title: title,
    description: description,
    openGraph: {
      url: locale === 'en' 
        ? `https://www.claudemcp.com/servers/${id}` 
        : `https://www.claudemcp.com/${locale}/servers/${id}`,
      title: title,
      description: description,
      images: server.icon ? [server.icon] : ['/og.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: server.icon ? [server.icon] : ['/og.png'],
    },
    alternates: {
      canonical: locale === 'en' 
        ? `https://www.claudemcp.com/servers/${id}` 
        : `https://www.claudemcp.com/${locale}/servers/${id}`,
    },
  };
}

/**
 * 获取相关推荐服务器
 * @param locale 语言
 * @param currentServer 当前服务器
 * @param maxCount 最大推荐数量
 * @returns 推荐服务器列表
 */
async function getRelatedServers(locale: string, currentServer: MCPServer, maxCount: number = 16): Promise<MCPServer[]> {
  // 获取所有服务器
  const { servers: allServers } = await loadServersData(locale);
  
  // 排除当前服务器
  const otherServers = allServers.filter(server => server.id !== currentServer.id);
  
  // 相同标签的服务器
  const serversWithSameTags = otherServers.filter(server => 
    server.tags.some(tag => currentServer.tags.includes(tag))
  );
  
  // 如果找到的相关服务器不足maxCount个，从精选服务器中补充
  let result = [...serversWithSameTags];
  if (result.length < maxCount) {
    // 获取精选服务器（排除已选的服务器）
    const featuredServers = otherServers
      .filter(server => server.featured && !result.some(s => s.id === server.id))
      .slice(0, maxCount - result.length);
    
    result = [...result, ...featuredServers];
  }
  
  // 如果仍然不足maxCount个，随机补充
  if (result.length < maxCount) {
    const remainingServers = otherServers.filter(
      server => !result.some(s => s.id === server.id)
    );
    
    // 随机打乱剩余服务器
    const shuffledRemaining = [...remainingServers].sort(() => 0.5 - Math.random());
    
    result = [...result, ...shuffledRemaining.slice(0, maxCount - result.length)];
  }
  
  // 限制最多返回maxCount个
  return result.slice(0, maxCount);
}

export default async function ServerDetailPage({
  params
}: PageProps) {
  const { locale, id } = await params;
  
  // 加载服务器详情
  const server = await loadServerDetail(locale, id);
  
  if (!server) {
    notFound();
  }
  
  // 获取相关推荐服务器
  const relatedServers = await getRelatedServers(locale, server);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ServerDetails server={server} relatedServers={relatedServers} />
    </div>
  );
} 