import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { DocContent } from '@/components/docs/content';
import { DocSidebar } from '@/components/docs/sidebar';
import { DocNavigation } from '@/components/docs/navigation';
import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { locales } from '@/i18n/config';
import { getDocList, type DocMeta } from '@/lib/docs';
import matter from 'gray-matter';


// 设置静态生成和缓存
export const revalidate = 3600; // 每小时重新验证

// 页面参数类型
type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// 预加载文档内容
async function loadDocContent(locale: string, slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'public/docs', locale, `${slug}.md`);
    const content = await readFile(filePath, 'utf-8');
    const matterResult = matter(content);
    return { content: matterResult.content, data: matterResult.data };
  } catch (error) {
    console.error(`Failed to load doc content for ${locale}/${slug}:`, error);
    return { error: new Error('Document not found') };
  }
}

// 预生成所有可能的文档路径
export async function generateStaticParams() {
  try {
    // 支持的语言
    const params = [];
    // 为每种语言获取所有文档
    for (const locale of locales) {
      // 读取该语言的文档目录
      try {
        const docsDir = path.join(process.cwd(), 'public/docs', locale);
        const files = await readdir(docsDir);
        
        // 添加每个文档的参数
        for (const file of files) {
          if (file.endsWith('.md')) {
            const slug = file.replace('.md', '');
            params.push({ locale, slug });
          }
        }
      } catch (err) {
        console.error(`No docs found for locale: ${locale}`, err);
      }
    }

    // 确保至少有默认文档
    if (params.length === 0) {
      params.push({ locale: 'en', slug: 'introduction' });
    }

    return params;
  } catch (error) {
    console.error('Failed to generate static params for docs:', error);
    return [{ locale: 'en', slug: 'introduction' }];
  }
}

// 生成元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations('Docs');

  const { data } = await loadDocContent(locale, slug);

  const description = data?.description;
  
  return {
    title: `${t(`nav.items.${slug}`)} - ${t('meta.title')}`,
    description: description,
    openGraph: {
      url: locale === 'en' ? `https://www.claudemcp.com/docs/${slug}` : `https://www.claudemcp.com/${locale}/docs/${slug}`,
      title: `${t(`nav.items.${slug}`)} - ${t('meta.og.title')}`,
      description: description,
      images: ['/og.png'],
    },
    alternates: {
      canonical: locale === 'en' ? `https://www.claudemcp.com/docs/${slug}` : `https://www.claudemcp.com/${locale}/docs/${slug}`,
    },  
  };
}

export default async function DocPage({ params }: PageProps) {
  const { locale, slug } = await params;
  
  // 1. 静态加载文档内容
  const { content, error } = await loadDocContent(locale, slug);
  
  // 2. 预加载文档列表供所有子组件使用
  const docList = await getDocList(locale);

  // 3. 查找当前文档和前后文档
  let prevDoc: undefined | DocMeta = undefined;
  let nextDoc: undefined | DocMeta = undefined;

  if (docList && Object.keys(docList).length > 0) {
    // 在所有章节中查找当前文档
    for (const [section, docs] of Object.entries(docList)) {
      console.log("section:", section);
      const found = docs.find(doc => doc.slug === slug);
      if (found) {
        // 如果指定了前一篇文档，查找它
        if (found.prev) {
          for (const sectionDocs of Object.values(docList)) {
            const foundPrev = sectionDocs.find(doc => doc.slug === found.prev);
            if (foundPrev) {
              prevDoc = foundPrev;
              break;
            }
          }
        }
        
        // 如果指定了后一篇文档，查找它
        if (found.next) {
          for (const sectionDocs of Object.values(docList)) {
            const foundNext = sectionDocs.find(doc => doc.slug === found.next);
            if (foundNext) {
              nextDoc = foundNext;
              break;
            }
          }
        }
        
        break;
      }
    }
  }

  // 查找当前文档在docList中的信息
  let currentDoc: DocMeta | undefined;
  for (const sectionDocs of Object.values(docList)) {
    const found = sectionDocs.find(doc => doc.slug === slug);
    if (found) {
      currentDoc = found;
      break;
    }
  }
  
  // 构建结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": currentDoc?.title || `${slug} Documentation`,
    "description": currentDoc?.description || "",
    "datePublished": currentDoc?.pubDate || new Date().toISOString(),
    "dateModified": currentDoc?.pubDate || new Date().toISOString(),
    "articleSection": currentDoc?.section || "Documentation",
    "url": locale === 'en' 
      ? `https://www.claudemcp.com/docs/${slug}` 
      : `https://www.claudemcp.com/${locale}/docs/${slug}`,
    "publisher": {
      "@type": "Organization",
      "name": "Claude MCP",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.claudemcp.com/logo.png"
      }
    },
    "inLanguage": locale,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": locale === 'en' 
        ? `https://www.claudemcp.com/docs/${slug}` 
        : `https://www.claudemcp.com/${locale}/docs/${slug}`
    }
  };
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-red-500 dark:text-red-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Error
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* 注入结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 顶部装饰 */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-50/20 dark:from-blue-950/20" />
      
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏 - 传递预加载的文档列表，不再需要在组件内获取 */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <DocSidebar 
                  initialDocs={docList} 
                  currentSlug={slug} 
                />
              </div>
            </div>

            {/* 主要内容 - 传递预加载的文档内容 */}
            <div className="flex-1 min-w-0">
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <DocContent 
                  content={content} 
                  error={error} 
                />
              </div>
              
              {/* 文档导航 - 传递所有预加载的导航数据 */}
              <DocNavigation 
                prevDoc={prevDoc}
                nextDoc={nextDoc}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
