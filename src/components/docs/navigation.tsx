import { Link } from '@/i18n/routing';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { type DocMeta } from '@/lib/docs';
import { useTranslations } from 'next-intl';

interface DocNavigationProps {
  prevDoc?: DocMeta; // 上一个文档的元数据（可选）
  nextDoc?: DocMeta; // 下一个文档的元数据（可选）
}

export function DocNavigation({ 
  prevDoc, 
  nextDoc 
}: DocNavigationProps) {
  const t = useTranslations('Docs');

  return (
    <div className="mt-16 flex flex-col sm:flex-row justify-between gap-4 border-t dark:border-gray-800 pt-8">
      {prevDoc && prevDoc.slug && prevDoc.title ? (
        <Link
          href={`/docs/${prevDoc.slug}` as any}
          className={cn(
            "group flex items-center gap-3 text-left",
            "p-4 rounded-lg border dark:border-gray-800",
            "hover:border-blue-500/20 hover:bg-blue-50/50 dark:hover:border-blue-500/20 dark:hover:bg-blue-950/50",
            "transition-colors duration-200"
          )}
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t('nav.previous')}</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {prevDoc.title}
            </div>
          </div>
        </Link>
      ) : <div />}

      {nextDoc && nextDoc.slug && nextDoc.title ? (
        <Link
          href={`/docs/${nextDoc.slug}` as any}
          className={cn(
            "group flex items-center gap-3 text-right",
            "p-4 rounded-lg border dark:border-gray-800",
            "hover:border-blue-500/20 hover:bg-blue-50/50 dark:hover:border-blue-500/20 dark:hover:bg-blue-950/50",
            "transition-colors duration-200",
            !prevDoc && "ml-auto"
          )}
        >
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t('nav.next')}</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {nextDoc.title}
            </div>
          </div>
          <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </Link>
      ) : <div />}
    </div>
  );
}
