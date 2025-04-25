import { Inter, Noto_Sans_SC } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { Metadata } from 'next'
import { AD_CLIENT } from '@/lib/utils'
import CanvasCursor from '@/components/CavasCursor'
import ClarityScript from '@/components/ClarityScript'

// 优化中文字体加载
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
  // 优化特定语言下的字体加载
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.claudemcp.com')
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en" className={`${inter.variable} ${notoSansSC.variable}`}>
      <head>
        <link rel="alternate" hrefLang="en" href="https://www.claudemcp.com/en" />
        <link rel="alternate" hrefLang="zh" href="https://www.claudemcp.com/zh" />
        <link rel="alternate" hrefLang="tw" href="https://www.claudemcp.com/tw" />
        <link rel="alternate" hrefLang="ko" href="https://www.claudemcp.com/ko" />
        <link rel="alternate" hrefLang="x-default" href="https://www.claudemcp.com" />
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
          crossOrigin="anonymous"></script>
        <ClarityScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preload" href="/logo.png" as="image" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <GoogleAnalytics gaId="G-JBQK9CPP1N" />
        <CanvasCursor />
      </body>
    </html>
  )
}
