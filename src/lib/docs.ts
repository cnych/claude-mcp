import { readdir, readFile } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { locales } from '@/i18n/config';

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  section: string;
  prev?: string;
  next?: string;
  pubDate?: string;
  order?: number;
}

export interface DocContent extends DocMeta {
  content: string;
}

// 从文件系统读取所有文档
export async function getDocList(locale: string = 'en'): Promise<Record<string, DocMeta[]>> {
  try {
    // 确保语言代码有效，否则回退到英文
    if (!locale || typeof locale !== 'string' || !locales.includes(locale as any)) {
      locale = 'en';
    }

    const docsDir = path.join(process.cwd(), 'public/docs', locale);
    let files: string[] = [];
    
    try {
      files = await readdir(docsDir);
    } catch (readError) {
      console.error(`读取文档目录失败 ${docsDir}:`, readError);
      return {};
    }
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      console.warn(`没有找到文档文件: ${docsDir}`);
      return {};
    }
    
    const docs: DocMeta[] = [];
    
    // 读取每个文档文件并解析frontmatter
    for (const file of files) {
      if (file.endsWith('.md')) {
        const slug = file.replace('.md', '');
        const filePath = path.join(docsDir, file);
        
        try {
          const content = await readFile(filePath, 'utf-8');
          const { data } = matter(content);
          
          // 确保所有必要的字段都有有效值
          const docMeta: DocMeta = {
            slug,
            title: data.title || slug,
            description: data.description || '',
            section: data.section || 'general',
          };
          
          // 添加可选字段
          if (data.pubDate) docMeta.pubDate = data.pubDate;
          if (data.prev) docMeta.prev = data.prev;
          if (data.next) docMeta.next = data.next;
          if (data.order) docMeta.order = parseInt(data.order, 10);
          
          docs.push(docMeta);
        } catch (err) {
          console.error(`Error reading doc file ${file}:`, err);
        }
      }
    }
    
    // 确保docs是一个数组，防止reduce错误
    if (!Array.isArray(docs)) {
      console.error(`Docs is not an array for locale ${locale}:`, docs);
      return {};
    }
    
    if (docs.length === 0) {
      console.warn(`没有解析到有效的文档: ${locale}`);
      return {};
    }
    
    // 按章节分组
    let grouped: Record<string, DocMeta[]> = {};
    
    try {
      grouped = docs.reduce((acc, doc) => {
        const section = doc.section || 'general';
        if (!acc[section]) {
          acc[section] = [];
        }
        acc[section].push(doc);
        return acc;
      }, {} as Record<string, DocMeta[]>);
      
      // 对每个章节内的文档按order字段排序
      Object.keys(grouped).forEach(section => {
        grouped[section].sort((a, b) => {
          // 如果有order字段，按order排序
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          // 如果只有一个有order字段，有order的排前面
          if (a.order !== undefined) return -1;
          if (b.order !== undefined) return 1;
          // 否则按标题字母顺序排序
          return a.title.localeCompare(b.title);
        });
      });
    } catch (reduceError) {
      console.error(`分组文档时出错:`, reduceError);
      
      // 出错时创建一个基本分组
      const section = 'general';
      grouped = { [section]: docs };
    }
    
    if (Object.keys(grouped).length === 0) {
      console.warn(`分组后没有文档: ${locale}`);
      return { general: [] };
    }
    
    // 定义章节排序顺序
    const sectionOrder = [
      'getting_started',
      'write_server',
      'guides',
      'advanced',
      'general'
    ];
    
    // 创建一个按预定义顺序排序的新对象
    const orderedGrouped: Record<string, DocMeta[]> = {};
    
    // 首先添加预定义顺序中的章节
    sectionOrder.forEach(section => {
      if (grouped[section]) {
        orderedGrouped[section] = grouped[section];
      }
    });
    
    // 然后添加任何未在预定义顺序中的章节（按字母顺序）
    Object.keys(grouped)
      .filter(section => !sectionOrder.includes(section))
      .sort()
      .forEach(section => {
        orderedGrouped[section] = grouped[section];
      });
    
    return orderedGrouped;
  } catch (error) {
    console.error(`Failed to get doc list for locale ${locale}:`, error);
    return { general: [] };
  }
}

// 获取最新文档列表
export async function getLatestDocs(locale: string = 'en', limit: number = 3): Promise<DocMeta[]> {
  try {
    const allDocs = await getDocList(locale);
    const flatDocs = Object.values(allDocs).flat();
    
    // 按lastModified排序，如果没有pubDate则排在后面
    return flatDocs
      .sort((a, b) => {
        if (!a.pubDate && !b.pubDate) return 0;
        if (!a.pubDate) return 1;
        if (!b.pubDate) return -1;
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      })
      .slice(0, limit);
  } catch (error) {
    console.error('获取最新文档失败:', error);
    return [];
  }
}
