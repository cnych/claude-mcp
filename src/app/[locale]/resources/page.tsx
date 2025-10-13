import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { ExternalLink } from 'lucide-react'

export async function generateMetadata() {
  const t = await getTranslations('Resources.meta')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function ResourcesPage() {
  const t = useTranslations('Resources')

  const resources = [
    {
      name: 'GPT Sora',
      href: 'https://www.gptsora.io?ref=claude-mcp',
      description: t('products.gptsora')
    },
    {
      name: 'AI ASMR Videos',
      href: 'https://www.asmr.so?ref=claude-mcp',
      description: t('products.asmr')
    },
    {
      name: 'Humanize AI',
      href: 'https://www.avoid.so?ref=claude-mcp',
      description: t('products.humanize')
    },
    {
      name: 'Dripo AI',
      href: 'https://www.dripo.ai?ref=claude-mcp',
      description: t('products.dripo')
    },
    {
      name: 'ToMarkdown',
      href: 'https://www.tomarkdown.org?ref=claude-mcp',
      description: t('products.tomarkdown')
    },
    {
      name: 'AI Rooms',
      href: 'https://www.rooms.so?ref=claude-mcp',
      description: t('products.rooms')
    },
    {
      name: 'Manus AI',
      href: 'https://www.manusai.io?ref=claude-mcp',
      description: t('products.manus')
    },
    {
      name: 'Genspark AI',
      href: 'https://genspark.im?ref=claude-mcp',
      description: t('products.genspark')
    },
    {
      name: 'Desktop Extensions',
      href: 'https://www.desktopextensions.com?ref=claude-mcp',
      description: t('products.extensions')
    },
    {
      name: 'Calculator Online',
      href: 'https://www.calculatoronline.io?ref=claude-mcp',
      description: t('products.calculator')
    },
    {
      name: 'Compress',
      href: 'https://www.compress.run?ref=claude-mcp',
      description: t('products.compress')
    },
    {
      name: 'A2A',
      href: 'https://www.a2aprotocol.net?ref=claude-mcp',
      description: t('products.a2a')
    },
    {
      name: 'DeepSite',
      href: 'https://www.deepsite.app?ref=claude-mcp',
      description: t('products.deepsite')
    },
    {
      name: 'Invincible Title Card',
      lang: 'en',
      href: 'https://www.invincibletitlecardgenerator.com/?ref=claude-mcp',
      description: t('products.invincible')
    },
    {
      name: 'Color Block Jam Level',
      href: 'https://www.colorblockjamlevel.app?ref=claude-mcp',
      description: t('products.colorblock')
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <a
            key={resource.name}
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-6 border rounded-lg hover:shadow-lg transition-all bg-card hover:border-primary"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {resource.name}
              </h3>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm text-muted-foreground">
              {resource.description}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t">
        <p className="text-sm text-muted-foreground text-center">
          {t('disclaimer')}
        </p>
      </div>
    </div>
  )
}
