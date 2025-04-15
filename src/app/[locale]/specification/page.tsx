import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Github, ArrowUpRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { locales } from '@/i18n/config'
import { Mermaid } from '@/components/ui/mermaid'

// 设置静态生成和缓存
export const revalidate = 3600; // 每小时重新验证

type PageProps = {
  params: Promise<{ locale: string }>;
}

// 预生成所有可能的规范页面路径
export async function generateStaticParams() {
  // 支持的语言
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('Specification')
  const tIndex = await getTranslations('Index')

  let description = t('meta.description');
  if (description.length < 160) {
    description = `${description} - ${tIndex('meta.description')}`;
  }
  description = `${description.substring(0, 160)}`;

  return {
    title: `${t('meta.title')} - ${tIndex('meta.title')}`,
    description: description,
    openGraph: {
      url: locale === 'en' ? `https://www.claudemcp.com/specification` : `https://www.claudemcp.com/${locale}/specification`,
      title: `${t('meta.title')} - ${tIndex('meta.title')}`,
      description: description,
      images: ['/og.png'],
    },
    alternates: {
      canonical: locale === 'en' ? `https://www.claudemcp.com/specification` : `https://www.claudemcp.com/${locale}/specification`,
    },  
  }
}

export default function SpecificationPage() {
  const t = useTranslations('Specification')

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 space-y-24">
        {/* 头部导航 */}
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            {t('backToHome')}
          </Link>
          <Button variant="outline" size="sm" className="group" asChild>
            <a
              href="https://github.com/modelcontextprotocol/specification"
              target="_blank"
              rel="noopener"
              className="gap-2"
            >
              <Github className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              {t('viewGithub')}
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </Button>
        </nav>

        {/* 主要内容 */}
        <div className="space-y-24">
          {/* 标题部分 */}
          <header className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                {t('title')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl [text-wrap:balance] leading-relaxed">
                {t('description')}
              </p>
            </div>
          </header>

          {/* 概述部分 */}
          <section className="space-y-16">
            <div className="space-y-8">
              <h2 className="text-3xl font-semibold tracking-tight">
                {t('overview.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-4xl [text-wrap:balance] leading-relaxed">
                {t('overview.description')}
              </p>
            </div>

            {/* 架构图和组件说明 */}
            <div className="space-y-24">
              {/* 架构图 */}
              <div>
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                    {t('overview.architecture.title')}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t('overview.architecture.description')}
                  </p>
                </div>
                <div className="mt-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl blur-3xl -z-10" />
                  <div className="max-w-5xl mx-auto backdrop-blur-sm">
                    <Mermaid
                      key="architecture-diagram"
                      mermaidKey="architecture"
                      chart={t.raw('overview.architecture.diagram')}
                      className="p-8 rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 bg-gradient-to-b from-background/95 to-background"
                    />
                  </div>
                </div>
              </div>

              {/* 组件详情 */}
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-16 text-center bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                  {t('overview.architecture.details.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  {['host', 'client', 'server'].map((component) => {
                    const details = t.raw(`overview.architecture.details.${component}`)
                    return (
                      <div key={component} className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/5 to-transparent rounded-3xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                              <div className="h-3 w-3 rounded-full bg-gradient-to-br from-primary to-primary/80" />
                            </div>
                            <h3 className="text-2xl font-semibold tracking-tight">
                              {details.title}
                            </h3>
                          </div>
                          <div className="space-y-8">
                            <p className="text-base text-muted-foreground/90 leading-relaxed">
                              {details.description}
                            </p>
                            <div className="space-y-4">
                              {details.features.map((feature: string) => (
                                <div key={feature} className="flex items-start gap-4 group/item">
                                  <div className="h-6 w-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:from-primary/20 group-hover/item:to-primary/30 transition-colors">
                                    <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-primary to-primary/80" />
                                  </div>
                                  <span className="text-base text-muted-foreground/90 leading-relaxed group-hover/item:text-muted-foreground transition-colors">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* 消息类型 */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                {t('overview.architecture.messages.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-16 max-w-3xl">
                {t('overview.architecture.messages.description')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
                {t.raw('overview.architecture.messages.items').map((message: any) => (
                  <div key={message.title} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/5 to-transparent rounded-3xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-gradient-to-br from-primary to-primary/80" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight">
                            {message.title}
                          </h3>
                          <p className="text-base text-muted-foreground/90 mt-1">
                            {message.description}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {message.features.map((feature: string) => (
                          <div key={feature} className="flex items-start gap-4 group/item">
                            <div className="h-6 w-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:from-primary/20 group-hover/item:to-primary/30 transition-colors">
                              <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-primary to-primary/80" />
                            </div>
                            <span className="text-base text-muted-foreground/90 leading-relaxed group-hover/item:text-muted-foreground transition-colors">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                      {message.codeExample && (
                        <div className="mt-8 space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            {message.codeExample.title}
                          </h4>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl blur-sm -z-10" />
                            <pre className="p-4 rounded-xl bg-gradient-to-b from-background/95 to-background border border-primary/10 overflow-x-auto">
                              <code className="text-sm">
                                {JSON.stringify(message.codeExample.code, null, 2)}
                              </code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 生命周期 */}
            <div className="mt-32">
              <h2 className="text-3xl font-bold tracking-tight mb-6 text-center bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                {t('overview.architecture.lifecycle.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center mb-16 max-w-3xl">
                {t('overview.architecture.lifecycle.description')}
              </p>

              {/* 生命周期图 */}
              <div className="mt-12 relative mb-24">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl blur-3xl -z-10" />
                <div className="max-w-4xl mx-auto backdrop-blur-sm">
                  <Mermaid
                    key="lifecycle-diagram"
                    mermaidKey="lifecycle"
                    chart={t.raw('overview.architecture.lifecycle.diagram')}
                    className="p-8 rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 bg-gradient-to-b from-background/95 to-background"
                  />
                </div>
              </div>

              {/* 生命周期阶段 */}
              <div className="space-y-24">
                {t.raw('overview.architecture.lifecycle.phases').map((phase: any, index: number) => (
                  <div key={index} className="group">
                    <div className="max-w-4xl mx-auto">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center flex-shrink-0">
                          <div className="h-4 w-4 rounded-full bg-gradient-to-br from-primary to-primary/80" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-semibold tracking-tight">
                            {phase.title}
                          </h3>
                          <p className="text-lg text-muted-foreground mt-2">
                            {phase.description}
                          </p>
                        </div>
                      </div>

                      {/* 特性列表 */}
                      {phase.features && (
                        <div className="space-y-4 mb-8">
                          {phase.features.map((feature: string) => (
                            <div key={feature} className="flex items-start gap-4 group/item">
                              <div className="h-6 w-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:from-primary/20 group-hover/item:to-primary/30 transition-colors">
                                <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-primary to-primary/80" />
                              </div>
                              <span className="text-base text-muted-foreground/90 leading-relaxed group-hover/item:text-muted-foreground transition-colors">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 能力列表 */}
                      {phase.capabilities && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                          <div>
                            <h4 className="text-xl font-semibold mb-6">{t('overview.architecture.capabilities.clientTitle')}</h4>
                            <div className="space-y-6">
                              {phase.capabilities.client.map((cap: any) => (
                                <div key={cap.name} className="space-y-2">
                                  <div className="font-medium">{cap.name}</div>
                                  <div className="text-sm text-muted-foreground">{cap.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold mb-6">{t('overview.architecture.capabilities.serverTitle')}</h4>
                            <div className="space-y-6">
                              {phase.capabilities.server.map((cap: any) => (
                                <div key={cap.name} className="space-y-2">
                                  <div className="font-medium">{cap.name}</div>
                                  <div className="text-sm text-muted-foreground">{cap.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 代码示例 */}
                      {phase.codeExamples && (
                        <div className="space-y-8 mt-12">
                          {phase.codeExamples.map((example: any) => (
                            <div key={example.title} className="space-y-3">
                              <h4 className="text-sm font-medium text-muted-foreground">
                                {example.title}
                              </h4>
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl blur-sm -z-10" />
                                <pre className="p-4 rounded-xl bg-gradient-to-b from-background/95 to-background border border-primary/10 overflow-x-auto">
                                  <code className="text-sm">
                                    {JSON.stringify(example.code, null, 2)}
                                  </code>
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 单个代码示例 */}
                      {phase.codeExample && (
                        <div className="mt-8 space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            {phase.codeExample.title}
                          </h4>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl blur-sm -z-10" />
                            <pre className="p-4 rounded-xl bg-gradient-to-b from-background/95 to-background border border-primary/10 overflow-x-auto">
                              <code className="text-sm">
                                {JSON.stringify(phase.codeExample.code, null, 2)}
                              </code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

          {/* Transport Mechanisms Section */}
          <section className="space-y-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-4xl text-center">
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
                  {t('overview.architecture.transports.title')}
                </h2>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  {t('overview.architecture.transports.description')}
                </p>
              </div>

              {/* stdio Transport */}
              <div className="mx-auto mt-16 max-w-5xl">
                <h3 className="text-2xl font-bold mb-6">
                  {t('overview.architecture.transports.stdio.title')}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {t('overview.architecture.transports.stdio.description')}
                </p>
                <ul className="list-disc pl-6 mb-8 space-y-2 text-muted-foreground">
                  {t.raw('overview.architecture.transports.stdio.features').map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <div className="mt-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl blur-3xl -z-10" />
                  <div className="max-w-4xl mx-auto backdrop-blur-sm">
                    <Mermaid
                      key="stdio-diagram"
                      mermaidKey="stdio"
                      chart={t.raw('overview.architecture.transports.stdio.diagram')}
                      className="p-8 rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 bg-gradient-to-b from-background/95 to-background"
                    />
                  </div>
                </div>
              </div>

              {/* SSE Transport */}
              <div className="mx-auto mt-16 max-w-5xl">
                <h3 className="text-2xl font-bold mb-6">
                  {t('overview.architecture.transports.sse.title')}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {t('overview.architecture.transports.sse.description')}
                </p>
                <div className="mb-8">
                  <h4 className="font-semibold mb-4">
                    {t('overview.architecture.transports.sse.endpoints.title')}
                  </h4>
                  <ul className="list-disc pl-6 space-y-4">
                    {t.raw('overview.architecture.transports.sse.endpoints.items').map((item: any, index: number) => (
                      <li key={index} className="text-muted-foreground">
                        <span className="font-medium">{item.title}</span> - {item.description}
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className="list-disc pl-6 mb-8 space-y-2 text-muted-foreground">
                  {t.raw('overview.architecture.transports.sse.requirements').map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
                <div className="mt-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl blur-3xl -z-10" />
                  <div className="max-w-4xl mx-auto backdrop-blur-sm">
                    <Mermaid
                      key="sse-diagram"
                      mermaidKey="sse"
                      chart={t.raw('overview.architecture.transports.sse.diagram')}
                      className="p-8 rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 bg-gradient-to-b from-background/95 to-background"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Transport */}
              <div className="mx-auto mt-16 max-w-5xl">
                <h3 className="text-2xl font-bold mb-6">
                  {t('overview.architecture.transports.custom.title')}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {t('overview.architecture.transports.custom.description')}
                </p>
                <ul className="list-disc pl-6 mb-8 space-y-2 text-muted-foreground">
                  {t.raw('overview.architecture.transports.custom.requirements').map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-16">
            {/* 服务器功能 */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                {t('overview.serverFeatures.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-16 max-w-3xl">
                {t('overview.serverFeatures.description')}
              </p>

              {/* 原语表格 */}
              <div className="mb-16">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs uppercase bg-muted/50">
                      <tr>
                        {t.raw('overview.serverFeatures.primitives.headers').map((header: string) => (
                          <th key={header} scope="col" className="px-6 py-3">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.raw('overview.serverFeatures.primitives.items').map((item: any, index: number) => (
                        <tr key={index} className="border-b border-muted/20">
                          <td className="px-6 py-4 font-medium">{item.primitive}</td>
                          <td className="px-6 py-4">{item.control}</td>
                          <td className="px-6 py-4">{item.description}</td>
                          <td className="px-6 py-4">{item.example}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 功能详情 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto mb-32">
                {t.raw('overview.serverFeatures.features').map((feature: any) => (
                  <div key={feature.title} className="group relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg blur-lg group-hover:blur-xl transition-all" />
                    <div className="relative space-y-6 bg-background/95 p-6 rounded-lg border border-primary/10 shadow-xl shadow-primary/5">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        {feature.items.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  )
}