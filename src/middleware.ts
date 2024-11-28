import createMiddleware from 'next-intl/middleware'
import {routing} from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  // 匹配所有路径，除了 api、静态文件等
  matcher: ['/((?!api|_next|.*\\..*).*)']
} 