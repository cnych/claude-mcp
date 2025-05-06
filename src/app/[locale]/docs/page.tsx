import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getDocList } from '@/lib/docs';
import { DocSidebar } from '@/components/docs/sidebar';

// 设置静态生成和缓存
export const revalidate = 3600; // 每小时重新验证

// 页面参数类型
type PageProps = {
  params: Promise<{ locale: string }>;
};

// 生成元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('Docs');

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: locale === 'en' ? 'https://www.claudemcp.com/docs' : `https://www.claudemcp.com/${locale}/docs`,
    },
  };
}

export default async function DocsPage({ params }: PageProps) {
  const { locale } = await params;
  // 预加载文档列表
  const docs = await getDocList(locale);
  // 获取翻译
  const t = await getTranslations('Docs');
  
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* 顶部装饰 */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-50/20 dark:from-blue-950/20" />
      
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏 */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <DocSidebar initialDocs={docs} locale={locale} />
              </div>
            </div>

            {/* 主要内容 */}
            <div className="flex-1 min-w-0">
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <h1>{t('landingPage.title')}</h1>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-8 border border-blue-100 dark:border-blue-800">
                  <p className="text-blue-700 dark:text-blue-400 font-medium">
                    {t('landingPage.welcome')}
                  </p>
                </div>
                
                <h2>{t('landingPage.whatIs.title')}</h2>
                <p>
                  {t('landingPage.whatIs.description')}
                </p>
                
                <h2>{t('landingPage.features.title')}</h2>
                <ul>
                  <li><strong>{t('landingPage.features.unifiedInterface.title')}</strong> - {t('landingPage.features.unifiedInterface.description')}</li>
                  <li><strong>{t('landingPage.features.seamlessIntegration.title')}</strong> - {t('landingPage.features.seamlessIntegration.description')}</li>
                  <li><strong>{t('landingPage.features.multiSource.title')}</strong> - {t('landingPage.features.multiSource.description')}</li>
                  <li><strong>{t('landingPage.features.contextManagement.title')}</strong> - {t('landingPage.features.contextManagement.description')}</li>
                  <li><strong>{t('landingPage.features.extensibility.title')}</strong> - {t('landingPage.features.extensibility.description')}</li>
                </ul>
                
                <h2>{t('landingPage.useCases.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-medium mb-2">{t('landingPage.useCases.codeDevelopment.title')}</h3>
                    <p>{t('landingPage.useCases.codeDevelopment.description')}</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-medium mb-2">{t('landingPage.useCases.documentProcessing.title')}</h3>
                    <p>{t('landingPage.useCases.documentProcessing.description')}</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-medium mb-2">{t('landingPage.useCases.knowledgeIntegration.title')}</h3>
                    <p>{t('landingPage.useCases.knowledgeIntegration.description')}</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-medium mb-2">{t('landingPage.useCases.devTools.title')}</h3>
                    <p>{t('landingPage.useCases.devTools.description')}</p>
                  </div>
                </div>
                
                <h2>{t('landingPage.whyChoose.title')}</h2>
                <p>
                  {t('landingPage.whyChoose.description')}
                </p>
                
                <h2>{t('landingPage.getStarted.title')}</h2>
                <p>
                  {t.rich('landingPage.getStarted.description', {
                    introduction: (chunks) => (
                      <a href={`/${locale === 'en' ? '' : locale + '/'}docs/introduction`} className="text-blue-600 dark:text-blue-400 hover:underline">{chunks}</a>
                    ),
                    quickstart: (chunks) => (
                      <a href={`/${locale === 'en' ? '' : locale + '/'}docs/quickstart`} className="text-blue-600 dark:text-blue-400 hover:underline">{chunks}</a>
                    )
                  })}
                </p>
                
                <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-xl border border-blue-100 dark:border-blue-900 flex flex-col items-center">
                  <h3 className="text-xl font-semibold text-center dark:text-blue-400">{t('landingPage.cta.title')}</h3>
                  <p className="text-center mb-4 dark:text-blue-400">{t('landingPage.cta.subtitle')}</p>
                  <div className="flex gap-4 mt-2">
                    <a href={`/${locale === 'en' ? '' : locale + '/'}docs/introduction`} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      {t('landingPage.cta.exploreButton')}
                    </a>
                    <a href="https://github.com/modelcontextprotocol" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors">
                      {t('landingPage.cta.githubButton')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
