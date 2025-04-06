import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { MCPServer } from '@/types/server';

const serversDirectory = path.join(process.cwd(), 'servers');

export async function getServers(locale: string = 'en'): Promise<MCPServer[]> {
  const serverDir = path.join(serversDirectory, locale);
  
  // 读取目录下的所有 .md 文件
  const files = fs.readdirSync(serverDir).filter(file => file.endsWith('.md'));

  const servers = files.map(filename => {
    const filePath = path.join(serverDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // 从文件名获取 id (去掉 .md 后缀)
    const id = filename.replace(/\.md$/, '');
    
    return {
      id,
      name: data.name,
      description: content,
      digest: data.digest,
      author: data.author,
      homepage: data.homepage,
      icon: data.icon,
      repository: data.repository,
      capabilities: {
        resources: data.capabilities?.resources ?? false,
        tools: data.capabilities?.tools ?? false,
        prompts: data.capabilities?.prompts ?? false,
      },
      tags: data.tags || [],
      createTime: data.createTime || new Date().toISOString(),
    } as MCPServer;
  });

  return servers;
}

export async function getServer(id: string, locale: string = 'en'): Promise<MCPServer | null> {
  try {
    const filePath = path.join(serversDirectory, locale, `${id}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      id,
      name: data.name,
      description: content,
      digest: data.digest,
      author: data.author,
      homepage: data.homepage,
      icon: data.icon,
      repository: data.repository,
      capabilities: {
        resources: data.capabilities?.resources ?? false,
        tools: data.capabilities?.tools ?? false,
        prompts: data.capabilities?.prompts ?? false,
      },
      tags: data.tags || [],
      createTime: data.createTime || new Date().toISOString(),
    } as MCPServer;
  } catch (error) {
    console.error(`Error fetching server with id ${id}:`, error);
    return null;
  }
}

export async function getAllTags(locale: string = 'en'): Promise<string[]> {
  const servers = await getServers(locale);
  
  // 收集所有标签并去重
  const tagSet = new Set<string>();
  servers.forEach(server => {
    server.tags.forEach(tag => tagSet.add(tag));
  });
  
  // 转换为数组并按字母顺序排序
  return Array.from(tagSet).sort();
} 