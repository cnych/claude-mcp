import { ClientDetails } from '@/components/ClientDetails';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { loadClientDetail } from '@/lib/data-utils';
import { readdir } from 'fs/promises';
import path from 'path';
import { locales } from '@/i18n/config';
import { notFound } from 'next/navigation';

// 每小时重新生成页面
export const revalidate = 3600;

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
}

// 预生成所有可能的客户端详情页面路径
export async function generateStaticParams() {
  const params = [];
  
  try {
    // 为每种语言加载所有可能的客户端ID
    for (const locale of locales) {
      try {
        const clientsDir = path.join(process.cwd(), 'public/clients', locale);
        const files = await readdir(clientsDir);
        
        for (const file of files) {
          if (file.endsWith('.md')) {
            const id = file.replace('.md', '');
            params.push({ locale, id });
          }
        }
      } catch (err) {
        console.error(`Could not read clients directory for locale: ${locale}`, err);
      }
    }
  } catch (error) {
    console.error('Failed to generate static params for client details:', error);
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations('Clients');
  
  // 加载客户端详情
  const client = await loadClientDetail(locale, id);
  
  if (!client) {
    return {
      title: t('notFound'),
      description: t('notFoundDescription'),
    };
  }

  const title = `${client.name} - ${t('title')}`;
  const description = client.digest;
  
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: client.icon ? [client.icon] : ['/og.png'],
      url: locale === 'en' 
        ? `https://www.claudemcp.com/clients/${id}` 
        : `https://www.claudemcp.com/${locale}/clients/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: client.icon ? [client.icon] : ['/og.png'],
    },
    alternates: {
      canonical: locale === 'en' 
        ? `https://www.claudemcp.com/clients/${id}` 
        : `https://www.claudemcp.com/${locale}/clients/${id}`,
    },
  };
}

export default async function ClientDetailPage({
  params
}: PageProps) {
  const { locale, id } = await params;
  
  // 加载客户端详情
  const client = await loadClientDetail(locale, id);
  
  if (!client) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ClientDetails client={client} />
    </div>
  );
}
