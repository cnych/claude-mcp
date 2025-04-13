import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';
import type { MCPServer } from '@/types/server';
import type { MCPClient } from '@/types/client';
import matter from 'gray-matter';
import { locales } from '@/i18n/config';

/**
 * 从本地文件系统加载服务器数据
 * @param locale 语言
 * @param limit 限制返回的服务器数量
 * @param filterFn 可选的过滤函数
 * @returns Promise<{servers: MCPServer[], tags: string[]}>
 */
export async function loadServersData(
  locale: string, 
  limit?: number,
  filterFn?: (server: MCPServer) => boolean
) {
  try {
    // 检查locale是否有效
    if (!locales.includes(locale as any)) {
      console.warn(`Invalid locale: ${locale}, falling back to 'en'`);
      locale = 'en'; // 使用默认语言
    }
    
    // 从服务器目录中读取所有服务器文件
    const serversDir = path.join(process.cwd(), 'servers', locale);
    
    try {
      const dirStat = await stat(serversDir);
      if (!dirStat.isDirectory()) {
        throw new Error(`Not a directory: ${serversDir}`);
      }
    } catch (err) {
      console.error(`Directory does not exist: ${serversDir}`, err);
      return {
        servers: [],
        tags: []
      };
    }
    
    const files = await readdir(serversDir);
    
    // 读取每个服务器的元数据
    const servers: MCPServer[] = [];
    const allTags = new Set<string>();
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(serversDir, file);
        const content = await readFile(filePath, 'utf-8');
        
        // 使用gray-matter解析Markdown front matter
        const { data, content: description } = matter(content);
        
        // 从文件名获取ID (去掉 .md 后缀)
        const id = file.replace(/\.md$/, '');
        
        // 处理标签数据
        const tags = Array.isArray(data.tags) ? data.tags : [];
        tags.forEach(tag => allTags.add(tag));
        
        const server: MCPServer = {
          id,
          name: data.name || id,
          digest: data.digest || '',
          description: description.trim(),
          author: data.author || '',
          icon: data.icon,
          homepage: data.homepage,
          repository: data.repository,
          createTime: data.createTime || new Date().toISOString(),
          capabilities: {
            resources: data.resources === true,
            tools: data.tools === true,
            prompts: data.prompts === true,
          },
          tags: tags,
          featured: Boolean(data.featured),
        };
        
        // 应用过滤函数
        if (!filterFn || filterFn(server)) {
          servers.push(server);
        }
      }
    }
    
    // 排序服务器 (按创建时间降序)
    servers.sort((a, b) => {
      const dateA = new Date(a.createTime).getTime();
      const dateB = new Date(b.createTime).getTime();
      return dateB - dateA;
    });
    
    // 限制返回的服务器数量
    const limitedServers = limit ? servers.slice(0, limit) : servers;
    
    return {
      servers: limitedServers,
      tags: Array.from(allTags).sort()
    };
  } catch (error) {
    console.error(`Failed to load servers for ${locale}:`, error);
    return {
      servers: [],
      tags: []
    };
  }
}

/**
 * 加载单个服务器详情
 * @param locale 语言
 * @param id 服务器ID
 * @returns Promise<MCPServer | null>
 */
export async function loadServerDetail(locale: string, id: string): Promise<MCPServer | null> {
  try {
    // 检查locale是否有效
    if (!locales.includes(locale as any)) {
      console.warn(`Invalid locale: ${locale}, falling back to 'en'`);
      locale = 'en'; // 使用默认语言
    }
    
    // 服务器文件路径
    const filePath = path.join(process.cwd(), 'servers', locale, `${id}.md`);
    
    try {
      const content = await readFile(filePath, 'utf-8');
      
      // 使用gray-matter解析Markdown front matter
      const { data, content: description } = matter(content);
      
      // 处理标签数据
      const tags = Array.isArray(data.tags) ? data.tags : [];
      
      return {
        id,
        name: data.name || id,
        digest: data.digest || '',
        description: description.trim(),
        author: data.author || '',
        icon: data.icon,
        homepage: data.homepage,
        repository: data.repository,
        createTime: data.createTime || new Date().toISOString(),
        capabilities: {
          resources: data.capabilities.resources === true,
          tools: data.capabilities.tools === true,
          prompts: data.capabilities.prompts === true,
        },
        tags: tags,
      };
    } catch (err) {
      console.error(`Failed to read server file: ${filePath}`, err);
      return null;
    }
  } catch (error) {
    console.error(`Failed to load server detail for ${locale}/${id}:`, error);
    return null;
  }
}

/**
 * 从本地文件系统加载客户端数据
 * @param locale 语言
 * @param limit 限制返回的客户端数量
 * @param filterFn 可选的过滤函数
 * @returns Promise<{clients: MCPClient[], tags: string[]}>
 */
export async function loadClientsData(
  locale: string, 
  limit?: number,
  filterFn?: (client: MCPClient) => boolean,
) {
  try {
    // 检查locale是否有效
    if (!locales.includes(locale as any)) {
      console.warn(`Invalid locale: ${locale}, falling back to 'en'`);
      locale = 'en'; // 使用默认语言
    }
    
    // 从客户端目录中读取所有客户端文件
    const clientsDir = path.join(process.cwd(), 'clients', locale);
    
    try {
      const dirStat = await stat(clientsDir);
      if (!dirStat.isDirectory()) {
        throw new Error(`Not a directory: ${clientsDir}`);
      }
    } catch (err) {
      console.error(`Directory does not exist: ${clientsDir}`, err);
      return {
        clients: [],
        tags: []
      };
    }
    
    const files = await readdir(clientsDir);
    
    // 读取每个客户端的元数据
    const clients: MCPClient[] = [];
    const allTags = new Set<string>();
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(clientsDir, file);
        const content = await readFile(filePath, 'utf-8');
        
        // 使用gray-matter解析Markdown front matter
        const { data, content: description } = matter(content);
        
        // 从文件名获取ID (去掉 .md 后缀)
        const id = file.replace(/\.md$/, '');
        
        // 处理标签数据
        const tags = Array.isArray(data.tags) ? data.tags : [];
        tags.forEach(tag => allTags.add(tag));
        
        const client: MCPClient = {
          id,
          name: data.name || id,
          digest: data.digest || '',
          description: description.trim(),
          author: data.author || '',
          icon: data.icon,
          homepage: data.homepage,
          repository: data.repository,
          featured: data.featured === true,
          createTime: data.createTime || new Date().toISOString(),
          platforms: {
            windows: data.windows === true,
            mac: data.mac === true,
            linux: data.linux === true,
            web: data.web === true,
            ios: data.ios === true,
            android: data.android === true,
          },
          tags: tags,
        };
        
        // 应用过滤函数
        if (!filterFn || filterFn(client)) {
          clients.push(client);
        }
      }
    }
    
    // 首先按featured排序，然后按创建时间降序
    clients.sort((a, b) => {
      // 优先按featured排序
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // 然后按创建时间降序
      const dateA = new Date(a.createTime).getTime();
      const dateB = new Date(b.createTime).getTime();
      return dateB - dateA;
    });
    
    // 限制返回的客户端数量
    const limitedClients = limit ? clients.slice(0, limit) : clients;
    
    return {
      clients: limitedClients,
      tags: Array.from(allTags).sort()
    };
  } catch (error) {
    console.error(`Failed to load clients for ${locale}:`, error);
    return {
      clients: [],
      tags: []
    };
  }
}

/**
 * 加载单个客户端详情
 * @param locale 语言
 * @param id 客户端ID
 * @returns Promise<MCPClient | null>
 */
export async function loadClientDetail(locale: string, id: string): Promise<MCPClient | null> {
  try {
    // 检查locale是否有效
    if (!locales.includes(locale as any)) {
      console.warn(`Invalid locale: ${locale}, falling back to 'en'`);
      locale = 'en'; // 使用默认语言
    }
    
    // 客户端文件路径
    const filePath = path.join(process.cwd(), 'clients', locale, `${id}.md`);
    
    try {
      const content = await readFile(filePath, 'utf-8');
      
      // 使用gray-matter解析Markdown front matter
      const { data, content: description } = matter(content);
      
      // 处理标签数据
      const tags = Array.isArray(data.tags) ? data.tags : [];
      
      return {
        id,
        name: data.name || id,
        digest: data.digest || '',
        description: description.trim(),
        author: data.author || '',
        icon: data.icon,
        homepage: data.homepage,
        repository: data.repository,
        featured: data.featured === true,
        createTime: data.createTime || new Date().toISOString(),
        platforms: {
          windows: data.windows === true,
          mac: data.mac === true,
          linux: data.linux === true,
          web: data.web === true,
          ios: data.ios === true,
          android: data.android === true,
        },
        tags: tags,
      };
    } catch (err) {
      console.error(`Failed to read client file: ${filePath}`, err);
      return null;
    }
  } catch (error) {
    console.error(`Failed to load client detail for ${locale}/${id}:`, error);
    return null;
  }
} 