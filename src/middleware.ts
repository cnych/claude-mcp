import createMiddleware from 'next-intl/middleware'
import {routing} from '@/i18n/routing'

// 创建国际化中间件，明确禁用自动重定向逻辑
export default createMiddleware({
  ...routing,
  // 禁用自动语言检测和重定向
  localeDetection: false
})

export const config = {
  // 匹配所有路径，除了 api、静态文件等
  matcher: ['/((?!api|_next|.*\\..*).*)']
} 