"use client";

import { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { marked } from 'marked';
import hljs from 'highlight.js';
// 导入highlight.js样式
import 'highlight.js/styles/atom-one-dark.css';
import DOMPurify from 'dompurify';
import { Mermaid } from "./mermaid";
import { AD_CLIENT } from "@/lib/utils";

interface MarkdownProps {
  content?: string;
}

// 自定义YouTube扩展
const youtubeExtension = {
  name: 'youtube',
  level: 'inline',
  start(src: string) { return src.match(/:::youtube\s+/)?.index; },
  tokenizer(src: string) {
    const match = src.match(/:::youtube\s+([a-zA-Z0-9_-]+):::/);
    if (match) {
      return {
        type: 'youtube',
        raw: match[0],
        videoId: match[1]
      };
    }
    return undefined;
  },
  renderer(token: any) {
    return `<div class="youtube-embed" data-video-id="${token.videoId}"></div>`;
  }
};

// 自定义AdSense扩展
const adsenseExtension = {
  name: 'adsense',
  level: 'inline',
  start(src: string) { return src.match(/:::adsense\s+/)?.index; },
  tokenizer(src: string) {
    const match = src.match(/:::adsense\s+([a-zA-Z0-9]+):::/);
    if (match) {
      return {
        type: 'adsense',
        raw: match[0],
        adSlot: match[1]
      };
    }
    return undefined;
  },
  renderer(token: any) {
    return `<div class="adsense-embed" data-ad-slot="${token.adSlot}"></div>`;
  }
};

// 自定义任务列表检测和处理
function processTaskLists(html: string): string {
  // 检测和替换任务列表
  return html
    .replace(/<li>(\[ \]|\[x\]) (.*?)<\/li>/g, (_, checked, content) => {
      const isChecked = checked === '[x]';
      return `<li class="task-list-item flex items-start space-x-2">
        <input type="checkbox" ${isChecked ? 'checked' : ''} disabled class="mt-1" />
        <span>${content}</span>
      </li>`;
    });
}

// 使用基本配置
marked.setOptions(marked.getDefaults());
marked.setOptions({
  gfm: true,   // GitHub风格Markdown，包含表格和任务列表
  breaks: true,
  pedantic: false,
});

// 添加扩展
marked.use({
  extensions: [youtubeExtension, adsenseExtension]
});

// 自定义表格样式处理
function enhanceTableStyles(html: string): string {
  return html.replace(/<table>/g, '<div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<thead>/g, '<thead class="bg-gray-50 dark:bg-gray-800">')
    .replace(/<tbody>/g, '<tbody class="divide-y divide-gray-200 dark:divide-gray-700">')
    .replace(/<th>/g, '<th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">')
    .replace(/<td>/g, '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">');
}

// YouTube嵌入组件
function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="not-prose my-6">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full rounded-lg"
        style={{ height: "640px" }}
      />
    </div>
  );
}

// 声明window.adsbygoogle全局类型
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// AdSense广告嵌入组件
function AdSenseEmbed({ adSlot }: { adSlot: string }) {
  const adId = useRef(`ad-${generateId()}`);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 确保在客户端
    if (typeof window === 'undefined') return;
    
    // 检查是否已经存在AdSense脚本
    const adsenseScript = document.querySelector(`script[src*="adsbygoogle.js"]`);
    if (!adsenseScript) {
      console.warn('未检测到全局AdSense脚本，广告可能无法正常显示');
    }
    
    // 稍微延迟初始化广告，确保DOM已完全渲染
    const timer = setTimeout(() => {
      try {
        if (!window.adsbygoogle) {
          window.adsbygoogle = [];
          console.log('初始化adsbygoogle数组');
        }
        
        window.adsbygoogle.push({});
        console.log(`AdSense广告(${adSlot})推送成功，ID: ${adId.current}`);
        setLoaded(true);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`AdSense初始化失败(${adSlot}):`, errMsg);
        setError(errMsg);
      }
    }, 300); // 增加延迟，确保DOM完全准备好
    
    return () => {
      clearTimeout(timer);
    };
  }, [adSlot]);

  return (
    <div className="not-prose my-6 relative min-h-[120px]">
      {error && (
        <div className="absolute top-0 left-0 w-full text-xs text-red-500 bg-red-50 p-1 rounded">
          {error}
        </div>
      )}
      
      <ins 
        id={adId.current}
        className="adsbygoogle"
        style={{
          display: 'block', 
          textAlign: 'center',
          minHeight: '120px'
        }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={AD_CLIENT}
        data-ad-slot={adSlot}
      />
      
      {!loaded && !error && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="text-xs text-gray-400">...</div>
        </div>
      )}
    </div>
  );
}

// 生成唯一ID，不依赖外部库
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function MarkdownComponent({ content = "" }: MarkdownProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 处理内容转换为HTML并渲染
  useEffect(() => {
    if (!content) return;
    
    // 处理自定义语法
    const processedContent = content
      .replace(/:::youtube\s+([a-zA-Z0-9_-]+):::/g, (_, videoId) => 
        `<div class="youtube-embed" data-video-id="${videoId}"></div>`)
      .replace(/:::adsense\s+([a-zA-Z0-9]+):::/g, (_, adSlot) => 
        `<div class="adsense-embed" data-ad-slot="${adSlot}"></div>`);
    
    // 使用marked转换为HTML
    let html = marked.parse(processedContent) as string;
    
    // 应用自定义表格样式
    html = enhanceTableStyles(html);
    
    // 处理任务列表
    html = processTaskLists(html);
    
    // 净化HTML以防XSS攻击，但允许代码高亮标签和表格/任务列表
    const cleanHtml = DOMPurify.sanitize(html, {
      ADD_TAGS: ['iframe', 'span', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'input'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'data-video-id', 'data-ad-slot', 'class', 'checked', 'disabled', 'type'],
      KEEP_CONTENT: true,
    });
    
    setHtmlContent(cleanHtml);
  }, [content]);
  
  // 处理DOM中的特殊嵌入内容
  useEffect(() => {
    if (!contentRef.current || !htmlContent) return;
    
    // 处理YouTube嵌入
    contentRef.current.querySelectorAll('.youtube-embed').forEach(element => {
      const videoId = element.getAttribute('data-video-id');
      if (!videoId) return;
      
      const root = createRoot(element);
      root.render(<YouTubeEmbed videoId={videoId} />);
    });
    
    // 处理AdSense嵌入
    contentRef.current.querySelectorAll('.adsense-embed').forEach(element => {
      const adSlot = element.getAttribute('data-ad-slot');
      if (!adSlot) return;
      
      const root = createRoot(element);
      root.render(<AdSenseEmbed adSlot={adSlot} />);
    });
    
    // 处理代码块
    contentRef.current.querySelectorAll('pre code').forEach(element => {
      console.log(element);
      const className = element.className || '';
      const language = className.replace('language-', '');
      const code = element.textContent || '';

      if (language === 'mermaid') {
        const mermaidContainer = document.createElement('div');
        const parent = element.parentNode;
        if (parent) {
          parent.parentNode?.replaceChild(mermaidContainer, parent);
          const root = createRoot(mermaidContainer);
          root.render(<Mermaid chart={code} mermaidKey={`mermaid-${generateId()}`} className="rounded-lg bg-muted" />);
        }
      } else if (language && language !== 'plaintext') {
        try {
          // 手动应用高亮
          if (hljs.getLanguage(language)) {
            const highlightedCode = hljs.highlight(code, { language }).value;
            element.innerHTML = highlightedCode;
            element.classList.add('hljs');
          }
        } catch (error) {
          console.warn(`代码高亮错误 (${language}):`, error);
        }
      }
    });
    
    // 处理任务列表交互
    contentRef.current.querySelectorAll('.task-list-item input[type="checkbox"]').forEach(checkbox => {
      // 只是视觉效果，不会保存状态
      checkbox.addEventListener('click', (e) => {
        e.preventDefault(); // 防止实际更改
      });
    });

    return () => {
      // 清理函数
    };
  }, [htmlContent]);

  if (!content) return null;

  return (
    <div className="prose prose-blue dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:border-none prose-pre:shadow-none prose-pre:p-0 prose-table:overflow-x-auto">
      <div 
        ref={contentRef} 
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </div>
  );
}

