'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { type DocMeta } from '@/lib/docs';


interface DocSidebarProps {
  initialDocs?: Record<string, DocMeta[]>;
  locale?: string;
  currentSlug?: string;
}

export function DocSidebar({ initialDocs, currentSlug: propCurrentSlug }: DocSidebarProps) {
  const t = useTranslations('Docs');
  const pathname = usePathname();
  const currentSlug = propCurrentSlug || pathname.split('/').pop() || 'introduction';
  const [docs, setDocs] = useState<Record<string, DocMeta[]>>({});

  useEffect(() => {
    setDocs(initialDocs || {});
  }, [initialDocs]);

  return (
    <nav className="space-y-8 sticky top-24">
      {Object.entries(docs).map(([section, sectionDocs]) => {
        // 验证文档数组
        if (!Array.isArray(sectionDocs) || sectionDocs.length === 0) {
          return null;
        }
        
        return (
          <div key={section}>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t(`nav.${section}`)}
            </h2>
            <ul className="space-y-2">
              {sectionDocs.map((doc) => {
                // 验证文档对象
                if (!doc || typeof doc !== 'object' || !doc.slug) {
                  return null;
                }
                
                return (
                  <motion.li
                    key={doc.slug}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link 
                      href={`/docs/${doc.slug}` as any}
                      className={cn(
                        'block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors',
                        currentSlug === doc.slug && 'text-blue-600 dark:text-blue-400 font-medium'
                      )}
                    >
                      {doc.title || doc.slug}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}