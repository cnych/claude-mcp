import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { Metadata } from 'next'
import { AD_CLIENT } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.claudemcp.com')
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="alternate" hrefLang="en" href="https://www.claudemcp.com/en" />
        <link rel="alternate" hrefLang="zh" href="https://www.claudemcp.com/zh" />
        <link rel="alternate" hrefLang="tw" href="https://www.claudemcp.com/tw" />
        <link rel="alternate" hrefLang="ko" href="https://www.claudemcp.com/ko" />
        <link rel="alternate" hrefLang="x-default" href="https://www.claudemcp.com" />
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
          crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <GoogleAnalytics gaId="G-JBQK9CPP1N" />
      </body>
    </html>
  )
}
