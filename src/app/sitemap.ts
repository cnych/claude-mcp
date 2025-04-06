import { locales } from "@/i18n/config";
import { MetadataRoute } from "next";
import { loadServersData } from "@/lib/data-utils";
import { getBlogPosts } from '@/data/blog-posts';
import { readdir } from 'fs/promises';
import path from 'path';
import type { DocMeta } from "@/lib/docs";

const baseUrl = "https://www.claudemcp.com";

async function fetchDocs(locale: string): Promise<DocMeta[]> {
  try {
    // 从文件系统获取文档数据
    const docsDir = path.join(process.cwd(), 'docs', locale);
    const files = await readdir(docsDir);
    
    const docs: DocMeta[] = [];
    for (const file of files) {
      if (file.endsWith('.md')) {
        // 这里只是简单加入文档slug，实际项目中应该解析文档元数据
        const slug = file.replace('.md', '');
        docs.push({
          slug,
          title: slug, // 理想情况下应该从文件内容中提取
          pubDate: new Date().toISOString(),
          description: '', // 添加空描述
          section: 'general' // 添加默认分类
        });
      }
    }
    return docs;
  } catch (error) {
    console.error(`Failed to fetch docs for locale ${locale}:`, error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 获取所有语言的服务器数据
  const serversByLocale = await Promise.all(
    locales.map(async (locale) => {
      const { servers } = await loadServersData(locale);
      return { locale, servers };
    })
  );

  // 获取所有语言的文档数据
  const docsByLocale = await Promise.all(
    locales.map(async (locale) => {
      const docs = await fetchDocs(locale);
      return { locale, docs };
    })
  );

  // 生成首页 URLs
  const homeUrls = locales.map((locale) => ({
    url: locale === "en" ? baseUrl : `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // 生成服务器列表页 URLs
  const serverListUrls = locales.map((locale) => ({
    url: locale === "en" ? `${baseUrl}/servers` : `${baseUrl}/${locale}/servers`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // 生成服务器详情页 URLs
  const serverDetailUrls = serversByLocale.flatMap(({ locale, servers }) =>
    servers.map((server) => ({
      url:
        locale === "en"
          ? `${baseUrl}/servers/${server.id}`
          : `${baseUrl}/${locale}/servers/${server.id}`,
      lastModified: new Date(server.createTime),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  // 生成文档页面 URLs
  const docUrls = docsByLocale.flatMap(({ locale, docs }) =>
    docs.map((doc) => ({
      url:
        locale === "en"
          ? `${baseUrl}/docs/${doc.slug}`
          : `${baseUrl}/${locale}/docs/${doc.slug}`,
      lastModified: doc.pubDate ? new Date(doc.pubDate) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  // 生成博客页面 URLs
  const blogPosts = await getBlogPosts();
  const blogUrls = locales.flatMap((locale) =>
    blogPosts.map((post) => ({
        url:
          locale === "en"
            ? `${baseUrl}/blog/${post.slug}`
            : `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
  );

  // 生成其他静态页面 URLs
  const staticUrls = locales.flatMap((locale) => [
    {
      url: locale === "en" ? `${baseUrl}/docs` : `${baseUrl}/${locale}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: locale === "en" ? `${baseUrl}/specification` : `${baseUrl}/${locale}/specification`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  return [
    ...homeUrls,
    ...serverListUrls,
    ...serverDetailUrls,
    ...docUrls,
    ...staticUrls,
    ...blogUrls,
  ];
}
