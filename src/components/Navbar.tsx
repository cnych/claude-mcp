'use client'

import {useTranslations} from 'next-intl'
import {Link as I18nLink} from '@/i18n/routing'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'
import { useState } from 'react'

export default function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const locale = useLocale()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // 从路径中移除语言前缀以获取实际路径
  const path = pathname.replace(`/${locale}`, '')

  // 定义类型安全的导航链接
  const navLinks = [
    { href: '/servers' as const, label: t('servers') },
    { href: '/clients' as const, label: t('clients') },
    { href: '/docs' as const, label: t('documentation') },
    { href: '/playground' as const, label: t('playground') },
    { href: '/inspector' as const, label: t('inspector') },
    { href: '/specification' as const, label: t('specification') },
    { href: '/blog' as const, label: t('blog') },
  ]
  
  return (
    <nav className="bg-white fixed top-0 left-0 right-0 z-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-0">
        <div className="flex justify-between h-16">
          <div className="flex">
            <I18nLink href="/" aria-label="Claude MCP" title="Claude MCP" className="flex items-center">
              <img src="/logo.png" alt="Claude MCP" className="w-10 h-auto mr-2" />
              <span className="hidden md:block text-xl font-bold text-gray-900 dark:text-white">{t('title')}</span>
            </I18nLink>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <I18nLink 
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  title={link.label}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-sm font-medium",
                    path.startsWith(link.href)
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400"
                  )}
                >
                  {link.label}
                </I18nLink>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
            {/* 移动端菜单按钮 */}
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 sm:hidden"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">{isMenuOpen ? t('close_menu') : t('open_menu')}</span>
              {/* 菜单图标 - 汉堡按钮 */}
              <svg 
                className={cn("w-6 h-6", isMenuOpen ? "hidden" : "block")}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* 关闭图标 - X */}
              <svg 
                className={cn("w-6 h-6", isMenuOpen ? "block" : "hidden")}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div 
        className={cn(
          "sm:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )} 
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
          {navLinks.map((link) => (
            <I18nLink
              key={link.href}
              href={link.href}
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium transform transition-transform duration-300",
                isMenuOpen ? "translate-y-0" : "translate-y-4",
                path.startsWith(link.href)
                  ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                  : "text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              )}
              aria-current={path.startsWith(link.href) ? "page" : undefined}
            >
              {link.label}
            </I18nLink>
          ))}
        </div>
      </div>
    </nav>
  )
} 