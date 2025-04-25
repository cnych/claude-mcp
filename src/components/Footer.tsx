import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Link as I18nLink } from '@/i18n/routing'
import { type Pathnames } from '@/i18n/config'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')

  const navigation = {
    product: [
      { name: 'Fastclass', href: 'https://fastclass.cn?ref=claude-mcp' },
      { name: 'JoyGames', href: 'https://www.joygames.io?ref=claude-mcp' },
      { name: 'ToMarkdown', href: 'https://www.tomarkdown.org?ref=claude-mcp' },
      { name: 'Manus AI', href: 'https://www.manusai.io?ref=claude-mcp' },
      { name: 'A2A', href: 'https://www.a2aprotocol.net?ref=claude-mcp' },
      { name: 'DeepSite', href: 'https://www.deepsite.app?ref=claude-mcp' },
      { name: 'Drow Names', href: 'https://www.drownames.com?ref=claude-mcp' },
    ],
    community: [
      { name: t('links.github'), href: 'https://github.com/cnych/claude-mcp' },
      { name: tNav('playground'), href: '/playground' as keyof Pathnames },
      { name: tNav('inspector'), href: '/inspector' as keyof Pathnames },
      { name: tNav('documentation'), href: '/docs' as keyof Pathnames },
      { name: tNav('specification'), href: '/specification' as keyof Pathnames },
      { name: tNav('blog'), href: '/blog' as keyof Pathnames },
    ],
  }

  return (
    <footer className="border-t bg-background/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="text-xl font-bold">
              {tNav('title')}
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('description')}
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold">{t('sections.product')}</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <I18nLink
                        href={item.href as any}
                        className={`text-sm text-muted-foreground hover:text-foreground transition-colors`}
                      >
                        {item.name}
                      </I18nLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold">{t('sections.community')}</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.community.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
          </div>
        </div>
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Claude MCP Tutorial.
            </p>
            <Link href="/sitemap.xml" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 