'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { type Pathnames } from '@/i18n/config'
import { pathnames } from '@/i18n/config'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { languages } from "@/i18n/config"

type LanguageCode = keyof typeof languages

export default function LanguageSwitcher() {
  const currentLocale = useLocale() as LanguageCode

  const pathname = usePathname()
  
  // 从路径中移除语言前缀以获取实际路径
  const path = pathname.startsWith(`/${currentLocale}`) 
    ? pathname.replace(`/${currentLocale}`, '')
    : pathname;
  
  // 将路径转换为合法的路由路径并获取参数
  const getTypedPathAndParams = (path: string): { pathname: keyof Pathnames, params?: Record<string, string> } => {
    // 如果是根路径
    if (path === '' || path === '/') {
      return {
        pathname: '/' as keyof Pathnames,
        params: undefined
      }
    }
    
    // 检查是否是 /docs/xxx 格式的路径
    if (path.startsWith('/docs/') && path !== '/docs') {
      const slug = path.split('/').pop()
      return {
        pathname: '/docs/[slug]' as keyof Pathnames,
        params: { slug: slug! }
      }
    }
    
    // 检查是否是 /servers/xxx 格式的路径
    if (path.startsWith('/servers/') && path !== '/servers') {
      const id = path.split('/').pop()
      return {
        pathname: '/servers/[id]' as keyof Pathnames,
        params: { id: id! }
      }
    }

    // 检查是否是 /blog/xxx 格式的路径
    if (path.startsWith('/blog/') && path !== '/blog') {
      const slug = path.split('/').pop()
      return {
        pathname: '/blog/[slug]' as keyof Pathnames,
        params: { slug: slug! }
      }
    }
    // 其他标准路径
    if (pathnames[path as keyof typeof pathnames]) {
      return {
        pathname: path as keyof Pathnames,
        params: undefined
      }
    }
    
    // 默认返回主页
    console.log(`未找到匹配路径: ${path}，返回主页`);
    return {
      pathname: '/' as keyof Pathnames,
      params: undefined
    }
  }

  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Globe className="h-4 w-4" />
          {languages[currentLocale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, name]) => (
          <DropdownMenuItem key={code} asChild>
            <Link
              locale={code}
              href={getTypedPathAndParams(path) as any}
              className={currentLocale === code ? 'cursor-pointer font-medium' : 'cursor-pointer'}
            >
              {name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}