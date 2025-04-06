'use client'

import {useTranslations} from 'next-intl'
import {Link as I18nLink} from '@/i18n/routing'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'

export default function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const locale = useLocale()
  
  // 从路径中移除语言前缀以获取实际路径
  const path = pathname.replace(`/${locale}`, '')
  
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <I18nLink href="/" aria-label="Claude MCP" title="Claude MCP" className="flex items-center">
              <img src="/logo.png" alt="Claude MCP" className="w-10 h-auto mr-1" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">{t('title')}</span>
            </I18nLink>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <I18nLink 
                href="/servers"
                aria-label={t('servers')}
                title={t('servers')}
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  path.startsWith('/servers')
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400"
                )}
              >
                {t('servers')}
              </I18nLink>
              <I18nLink 
                href="/clients"
                aria-label={t('clients')}
                title={t('clients')}
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  path.startsWith('/clients')
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400"
                )}
              >
                {t('clients')}
              </I18nLink>
              <I18nLink 
                href="/docs"
                aria-label={t('documentation')}
                title={t('documentation')}
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  path.startsWith('/docs')
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400"
                )}
              >
                {t('documentation')}
              </I18nLink>
              <I18nLink 
                href="/specification"
                aria-label={t('specification')}
                title={t('specification')}
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  path.startsWith('/specification')
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400"
                )}
              >
                {t('specification')}
              </I18nLink>
              <I18nLink
                href="/blog"
                aria-label={t('blog')}
                title={t('blog')}
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  path.startsWith('/blog')
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400"
                )}
              >
                {t('blog')}
              </I18nLink>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
} 