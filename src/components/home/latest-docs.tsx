import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { type DocMeta } from '@/lib/docs';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LatestDocsProps {
  docs: DocMeta[];
}

// 格式化日期，确保服务端和客户端输出一致
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  // 使用 toISOString() 确保输出格式一致
  return date.toISOString().split('T')[0];
}

export function LatestDocs({ docs }: LatestDocsProps) {
  const t = useTranslations('home');
  const tDocs = useTranslations('Docs');

  if (!docs || docs.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-600 dark:text-gray-300">{t('latestDocs.noDocuments')}</p>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('latestDocs.title')}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {t('latestDocs.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {docs.map((doc) => {
            const formattedDate = formatDate(doc.pubDate);
            return (
              <article
                key={doc.slug}
                className="duration-300 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all group"
              >
                <Link
                  href={`/docs/${doc.slug}` as any}
                  className="block p-6 h-full"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-3">
                        {doc.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-[3rem] text-sm leading-6">
                        {doc.description}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
                      <div className="flex items-center">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        <time dateTime={formattedDate}>
                          {formattedDate ? formattedDate : t('latestDocs.noDate')}
                        </time>
                      </div>
                      <span className={cn(
                        'ml-auto px-2 py-1 text-xs rounded-full',
                        {
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300': doc.section === 'getting_started',
                          'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': doc.section === 'guides',
                          'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300': doc.section === 'advanced',
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300': doc.section === 'general',
                        }
                      )}>
                        {tDocs(`nav.${doc.section}`)}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/docs">
              {t('latestDocs.viewAll')}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 