import { BlogPost } from '@/components/BlogCard';
import { BlogPostDetails } from '@/components/BlogPost';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

// 将Markdown内容转换为HTML
async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const result = await remark()
      .use(remarkGfm) // 启用 GitHub Flavored Markdown，支持表格等扩展语法
      .use(html, { sanitize: false }) // 不净化 HTML，保留原始标签
      .process(markdown);
    return result.toString();
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return markdown; // 如果转换失败，返回原始 markdown
  }
}

// 博客缓存，按语言分类
const blogCache: Record<string, BlogPost[]> = {};
const blogDetailsCache: Record<string, Record<string, BlogPostDetails>> = {};

// 从Markdown文件解析博客信息
function parseBlogFromFile(filePath: string): BlogPost | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    
    if (!data.title || !data.slug) {
      console.warn(`Blog post missing required fields: ${filePath}`);
      return null;
    }

    // 确保日期始终是字符串格式
    let dateStr = '';
    if (data.date) {
      // 如果date是Date对象，转换为ISO字符串并只保留日期部分
      dateStr = data.date instanceof Date 
        ? data.date.toISOString().split('T')[0]
        : String(data.date); // 否则强制转换为字符串
    } else {
      // 默认使用当前日期
      dateStr = new Date().toISOString().split('T')[0];
    }

    return {
      id: data.slug,
      title: data.title,
      excerpt: data.excerpt || '',
      coverImage: data.coverImage || `/images/blog/${data.slug}.jpg`,
      category: data.category || '未分类',
      author: {
        name: data.author?.name || '匿名',
        avatar: data.author?.avatar || '',
      },
      date: dateStr,
      slug: data.slug,
      featured: data.featured || false,
    };
  } catch (error) {
    console.error(`Error parsing blog file ${filePath}:`, error);
    return null;
  }
}

// 获取指定语言的所有博客文章
export function getBlogPosts(locale: string = 'zh'): Promise<BlogPost[]> {
  return new Promise((resolve, reject) => {
    // 如果缓存中存在该语言的博客列表，则直接返回
    if (blogCache[locale]) {
      resolve(blogCache[locale]);
      return;
    }

    const blogsDir = path.join(process.cwd(), 'public/blogs', locale);
    
    // 如果目录不存在，返回空数组
    if (!fs.existsSync(blogsDir)) {
      blogCache[locale] = [];
      resolve(blogCache[locale]);
      return;
    }

    try {
      const blogFiles = fs.readdirSync(blogsDir)
        .filter(file => file.endsWith('.md'));
      
      const posts = blogFiles
        .map(file => parseBlogFromFile(path.join(blogsDir, file)))
        .filter((post): post is BlogPost => post !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // 缓存结果
      blogCache[locale] = posts;
      resolve(posts);
    } catch (error) {
      console.error(`Error reading blog directory ${blogsDir}:`, error);
      blogCache[locale] = [];
      resolve(blogCache[locale]);
      reject(error);
    }
  });
}

// 获取博客文章详情
export async function getBlogPostDetails(slug: string, locale: string = 'zh'): Promise<BlogPostDetails | undefined> {
  // 检查缓存
  if (blogDetailsCache[locale]?.[slug]) {
    return blogDetailsCache[locale][slug];
  }
  
  const blogsDir = path.join(process.cwd(), 'public/blogs', locale);
  
  // 检查目录是否存在
  if (!fs.existsSync(blogsDir)) {
    console.warn(`Blog directory does not exist: ${blogsDir}`);
    return undefined;
  }
  
  try {
    const blogFiles = fs.readdirSync(blogsDir)
      .filter(file => file.endsWith('.md'));
    
    // 找到匹配的文件
    const blogFile = blogFiles.find(file => {
      try {
        const fileContent = fs.readFileSync(path.join(blogsDir, file), 'utf8');
        const { data } = matter(fileContent);
        return data.slug === slug;
      } catch {
        return false;
      }
    });
    
    if (!blogFile) {
      return undefined;
    }
    
    try {
      const filePath = path.join(blogsDir, blogFile);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      // 将Markdown内容转换为HTML
      const contentHtml = await markdownToHtml(content);
      
      // 获取基本博客信息
      const posts = await getBlogPosts(locale);
      
      // 使用文件中的数据手动构建基本博客信息，避免依赖posts查询
      const basicInfo: BlogPost = {
        id: data.slug,
        title: data.title,
        excerpt: data.excerpt || '',
        coverImage: data.coverImage || `/images/blog/${data.slug}.jpg`,
        category: data.category || '未分类',
        author: {
          name: data.author?.name || '匿名',
          avatar: data.author?.avatar || '',
        },
        date: typeof data.date === 'string' ? data.date : new Date().toISOString().split('T')[0],
        slug: data.slug,
        featured: data.featured || false,
      };
      
      // 初始化缓存
      if (!blogDetailsCache[locale]) {
        blogDetailsCache[locale] = {};
      }
      
      // 确保author对象始终存在并有默认值
      const authorData = data.author || {};
      const defaultAuthor = {
        name: '匿名',
        avatar: '',
        title: '',
        bio: ''
      };
      
      // 查找同类别的相关文章
      const relatedPosts = posts
        .filter(p => p.category === basicInfo.category && p.id !== basicInfo.id)
        .slice(0, 3)
        .map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          coverImage: p.coverImage,
        }));
      
      // 创建详细信息
      const postDetails: BlogPostDetails = {
        ...basicInfo,
        content: contentHtml,
        readTime: data.readTime || `${Math.ceil(content.length / 1000)}`,
        tags: data.tags || [],
        author: {
          // 使用默认值合并作者数据，确保所有字段都有值
          name: authorData.name || defaultAuthor.name,
          avatar: authorData.avatar || defaultAuthor.avatar,
          title: authorData.title || defaultAuthor.title,
          bio: authorData.bio || defaultAuthor.bio
        },
        relatedPosts: data.relatedPosts || relatedPosts,
      };
      
      // 缓存结果
      blogDetailsCache[locale][slug] = postDetails;
      return postDetails;
    } catch (error) {
      console.error(`Error getting blog post details for ${slug}:`, error);
      return undefined;
    }
  } catch (error) {
    console.error(`Error reading blog directory ${blogsDir}:`, error);
    return undefined;
  }
}

// 获取所有分类
export async function getCategories(locale: string = 'zh'): Promise<string[]> {
  const posts = await getBlogPosts(locale);
  const categories = new Set(posts.map(post => post.category));
  return Array.from(categories);
}

export const getPostsByCategory = (category: string, locale: string = 'zh'): Promise<BlogPost[]> => {
  return getBlogPosts(locale).then(posts => 
    posts.filter(post => post.category === category)
  );
}; 