import { ServerDetails } from '@/components/ServerDetails';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { loadServerDetail } from '@/lib/data-utils';
import { readdir } from 'fs/promises';
import path from 'path';
import { locales } from '@/i18n/config';
import { notFound } from 'next/navigation';

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
        const serversDir = path.join(process.cwd(), 'servers', locale);
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
  
  // 加载服务器详情
  const server = await loadServerDetail(locale, id);
  
  if (!server) {
    return {
      title: t('notFound'),
      description: t('notFoundDescription'),
    };
  }
  
  return {
    title: `${server.name} | ${t('title')}`,
    description: server.digest,
    openGraph: {
      url: locale === 'en' 
        ? `https://www.claudemcp.com/servers/${id}` 
        : `https://www.claudemcp.com/${locale}/servers/${id}`,
      title: `${server.name} | ${t('title')}`,
      description: server.digest,
      images: server.icon ? [server.icon] : ['/og.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${server.name} | ${t('title')}`,
      description: server.digest,
      images: server.icon ? [server.icon] : ['/og.png'],
    },
    alternates: {
      canonical: locale === 'en' 
        ? `https://www.claudemcp.com/servers/${id}` 
        : `https://www.claudemcp.com/${locale}/servers/${id}`,
    },
  };
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ServerDetails server={server} />
    </div>
  );
} 