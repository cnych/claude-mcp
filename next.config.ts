import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from "next"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
    output: 'standalone',  // 打包成一个独立的文件
    poweredByHeader: false, // 移除X-Powered-By头以提高安全性
    
    // 启用页面的静态优化
    staticPageGenerationTimeout: 180, // 增加静态生成超时时间（秒）
    
    // 设置缓存控制
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
                    },
                ],
            },
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=60, s-maxage=3600, stale-while-revalidate=3600',
                    },
                ],
            },
            {
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/(.*).(jpg|jpeg|png|gif|ico|svg|webp)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ]
    },
    
    // 实验性功能最小配置
    experimental: {
        // 针对Next.js支持的实验性功能
        optimizeCss: true, // 优化CSS
    },
}

export default withNextIntl(nextConfig)
