'use client';

import { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { remark } from 'remark';
import html from 'remark-html';
import { CodeBlock } from './code-block';
import { Mermaid } from './mermaid';

interface MarkdownProps {
  content?: string;  
}

// HTML实体解码函数
function decodeHtmlEntities(html: string): string {
  if (!html) return '';
  
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

// 生成唯一ID，不依赖外部库
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 将Markdown转换为HTML
async function markdownToHtml(markdown: string): Promise<string> {
  console.log("处理Markdown内容，长度:", markdown?.length);
  if (!markdown) {
    console.warn("Markdown内容为空");
    return '';
  }
  
  // 显示内容开头，帮助调试
  console.log("Markdown内容前200个字符:", markdown.substring(0, 200));
  
  try {
    const result = await remark()
      .use(html, { sanitize: false }) // 不进行sanitize以保留原始HTML
      .process(markdown);
    
    const htmlResult = result.toString();
    console.log("转换后HTML长度:", htmlResult?.length);
    
    // 简单检查HTML是否有内容
    if (!htmlResult || htmlResult.trim() === '') {
      console.warn("转换后的HTML为空");
    } else {
      console.log("HTML内容前200个字符:", htmlResult.substring(0, 200));
    }
    
    return htmlResult;
  } catch (error) {
    console.error("Markdown转换出错:", error);
    throw error;
  }
}

export function Markdown({ content = '' }: MarkdownProps) {  
  const containerRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<Map<string, ReturnType<typeof createRoot>>>(new Map());
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 尝试解析frontmatter（处理一些文档可能带有frontmatter头信息的情况）
  useEffect(() => {
    // 验证内容类型
    if (!content || typeof content !== 'string') {
      console.log("无效的内容类型:", typeof content);
      setHtmlContent('');
      setError('无效的内容格式');
      setIsLoading(false);
      return;
    }

    if (content.trim() === '') {
      console.log("内容为空，跳过处理");
      setHtmlContent('');
      setError(null);
      setIsLoading(false);
      return;
    }

    console.log("开始处理Markdown");
    setIsLoading(true);
    setError(null);

    try {
      // 检查是否包含frontmatter (---开头的元数据)
      const hasFrontmatter = content.trim().startsWith('---');
      let processedContent = content;
      
      if (hasFrontmatter) {
        console.log("检测到frontmatter，尝试提取正文内容");
        // 简单提取frontmatter后的内容
        const parts = content.split('---');
        if (parts.length >= 3) {
          // 跳过frontmatter部分，只处理正文
          processedContent = parts.slice(2).join('---').trim();
          console.log("提取后的正文长度:", processedContent.length);
        }
      }

      // 尝试使用两种解析方法
      const convertContent = async () => {
        try {
          console.log("尝试使用remark解析...");
          // 首先尝试使用remark
          const html = await markdownToHtml(processedContent);
          setHtmlContent(html);
          setError(null);
        } catch (error) {
          console.error('解析Markdown出错:', error);
          setError(error instanceof Error ? error.message : String(error));
        } finally {
          setIsLoading(false);
        }
      };

      convertContent();
    } catch (e) {
      console.error("处理Markdown时出错:", e);
      setError('解析Markdown时出错');
      setHtmlContent('');
    }
  }, [content]);

  // 处理HTML内容
  useEffect(() => {
    if (!containerRef.current || !htmlContent) {
      console.log("没有容器或HTML内容，跳过渲染", !!containerRef.current, htmlContent?.length);
      return;
    }

    console.log("开始处理HTML内容，长度:", htmlContent.length);

    try {
      // 在处理新内容前先清空容器，避免内容混合
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      
      // 使用 setTimeout 确保在当前渲染周期之后再卸载React根
      setTimeout(() => {
        // 清理之前的渲染
        rootsRef.current.forEach(root => {
          try {
            root.unmount();
          } catch (e) {
            console.error('Error unmounting root:', e);
          }
        });
        rootsRef.current.clear();
        
        // 设置初始HTML
        if (containerRef.current) {
          containerRef.current.innerHTML = htmlContent;
          console.log("已设置HTML到DOM");
          
          // 处理Mermaid代码块
          const mermaidBlocks = containerRef.current.querySelectorAll('pre > code.language-mermaid');
          console.log("找到Mermaid块数量:", mermaidBlocks.length);
          
          mermaidBlocks.forEach(block => {
            const pre = block.parentElement;
            if (!pre) return;
            
            // 创建图表容器
            const chartContainer = document.createElement('div');
            chartContainer.className = 'not-prose my-6';
            pre.parentNode?.replaceChild(chartContainer, pre);
            
            // 解码内容
            const code = decodeHtmlEntities(block.textContent || '');
            const chartId = `mermaid-${generateId()}`;
            
            // 创建React根并渲染
            const root = createRoot(chartContainer);
            rootsRef.current.set(chartId, root);
            
            root.render(
              <Mermaid 
                chart={code}
                mermaidKey={chartId}
                className="rounded-lg bg-muted"
              />
            );
          });
          
          // 处理其他代码块
          const codeBlocks = containerRef.current.querySelectorAll('pre > code:not(.language-mermaid)');
          console.log("找到代码块数量:", codeBlocks.length);
          
          codeBlocks.forEach(block => {
            // 获取语言
            const classes = Array.from(block.classList);
            const langClass = classes.find(cls => cls.startsWith('language-'));
            const language = langClass ? langClass.replace('language-', '') : '';
            
            const pre = block.parentElement;
            if (!pre) return;
            
            // 创建代码块容器
            const codeContainer = document.createElement('div');
            codeContainer.className = 'not-prose my-6';
            pre.parentNode?.replaceChild(codeContainer, pre);
            
            // 解码内容
            const code = decodeHtmlEntities(block.textContent || '');
            const blockId = `code-${generateId()}`;
            
            // 创建React根并渲染
            const root = createRoot(codeContainer);
            rootsRef.current.set(blockId, root);
            
            root.render(
              <CodeBlock
                code={code}
                language={language}
                className="rounded-lg border bg-muted"
              />
            );
          });
          
          console.log("HTML内容处理完成");
        }
      }, 0);
    } catch (e) {
      console.error("处理HTML内容时出错:", e);
      // 不抛出错误，保持UI可用
    }
  }, [htmlContent]);

  // 当组件卸载时清理所有React根
  useEffect(() => {
    return () => {
      // 使用 setTimeout 确保在React渲染周期之外清理
      setTimeout(() => {
        rootsRef.current.forEach(root => {
          try {
            root.unmount();
          } catch (e) {
            // 忽略错误
            console.error('Error unmounting root:', e);
          }
        });
        rootsRef.current.clear();
      }, 0);
    };
  }, []);

  if (!content) {
    return null;  
  }
  
  if (error) {
    return (
      <div className="text-red-500 border border-red-300 p-4 rounded-md">
        <p className="font-bold">渲染错误</p>
        <p>{error}</p>
        <details className="mt-2">
          <summary className="cursor-pointer">调试信息</summary>
          <pre className="text-xs mt-2 p-2 bg-gray-100 dark:bg-gray-800 overflow-auto">
            {content ? `内容长度: ${content.length}` : '无内容'}
          </pre>
        </details>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  // 添加调试信息
  if (htmlContent === '') {
    return (
      <div className="border border-yellow-300 p-4 rounded bg-yellow-50 dark:bg-yellow-900/20">
        <p className="text-yellow-800 dark:text-yellow-200 font-medium">未生成HTML内容</p>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">可能的原因：Markdown解析失败或内容为空</p>
        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 overflow-auto text-xs max-h-40">
          {content ? `原始内容前100个字符: ${content.substring(0, 100)}...` : '无内容'}
        </pre>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="prose prose-blue dark:prose-invert max-w-none"
    />
  );
}
