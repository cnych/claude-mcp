"use client";

import { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { remark } from "remark";
import html from "remark-html";
import { CodeBlock } from "./code-block";
import { Mermaid } from "./mermaid";
import { AD_CLIENT } from "@/lib/utils";

interface MarkdownProps {
  content?: string;
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
          AdSense加载错误: {error}
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
          <div className="text-xs text-gray-400">广告加载中...</div>
        </div>
      )}
    </div>
  );
}

// HTML实体解码函数
function decodeHtmlEntities(html: string): string {
  if (!html) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
}

// 生成唯一ID，不依赖外部库
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 将Markdown转换为HTML
async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown) {
    console.warn("Markdown内容为空");
    return "";
  }

  try {
    const result = await remark()
      .use(html, { sanitize: false }) // 不进行sanitize以保留原始HTML
      .process(markdown);

    const htmlResult = result.toString();

    // 简单检查HTML是否有内容
    if (!htmlResult || htmlResult.trim() === "") {
      console.warn("转换后的HTML为空");
    }

    return htmlResult;
  } catch (error) {
    console.error("Markdown转换出错:", error);
    throw error;
  }
}

// 处理特殊的YouTube标记
function processYouTubeMarkers(content: string): string {
  // 匹配形如 :::youtube DqgKuLYUv00::: 的字符串
  const youtubeRegex = /:::youtube\s+([a-zA-Z0-9_-]+):::/g;
  return content.replace(youtubeRegex, (match, videoId) => {
    // 创建一个特殊标记，后续可以在DOM中找到并替换
    return `<div class="youtube-embed" data-video-id="${videoId}"></div>`;
  });
}

// 处理特殊的AdSense标记
function processAdSenseMarkers(content: string): string {
  // 匹配形如 :::adsense 8781986491::: 的字符串
  const adsenseRegex = /:::adsense\s+([a-zA-Z0-9]+):::/g;
  return content.replace(adsenseRegex, (match, adSlot) => {
    // 创建一个特殊标记，后续可以在DOM中找到并替换
    return `<div class="adsense-embed" data-ad-slot="${adSlot}"></div>`;
  });
}

export function Markdown({ content = "" }: MarkdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<Map<string, ReturnType<typeof createRoot>>>(
    new Map()
  );
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 尝试解析frontmatter（处理一些文档可能带有frontmatter头信息的情况）
  useEffect(() => {
    // 验证内容类型
    if (!content || typeof content !== "string") {
      setHtmlContent("");
      setError("无效的内容格式");
      setIsLoading(false);
      return;
    }

    if (content.trim() === "") {
      setHtmlContent("");
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 检查是否包含frontmatter (---开头的元数据)
      const hasFrontmatter = content.trim().startsWith("---");
      let processedContent = content;

      if (hasFrontmatter) {
        // 简单提取frontmatter后的内容
        const parts = content.split("---");
        if (parts.length >= 3) {
          // 跳过frontmatter部分，只处理正文
          processedContent = parts.slice(2).join("---").trim();
        }
      }

      // 处理特殊的YouTube标记
      processedContent = processYouTubeMarkers(processedContent);
      
      // 处理特殊的AdSense标记
      processedContent = processAdSenseMarkers(processedContent);

      // 尝试使用两种解析方法
      const convertContent = async () => {
        try {
          // 首先尝试使用remark
          const html = await markdownToHtml(processedContent);
          setHtmlContent(html);
          setError(null);
        } catch (error) {
          console.error("解析Markdown出错:", error);
          setError(error instanceof Error ? error.message : String(error));
        } finally {
          setIsLoading(false);
        }
      };

      convertContent();
    } catch (e) {
      console.error("处理Markdown时出错:", e);
      setError("解析Markdown时出错");
      setHtmlContent("");
    }
  }, [content]);

  // 处理HTML内容
  useEffect(() => {
    if (!containerRef.current || !htmlContent) {
      return;
    }

    try {
      // 在处理新内容前先清空容器，避免内容混合
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      // 使用 setTimeout 确保在当前渲染周期之后再卸载React根
      setTimeout(() => {
        // 清理之前的渲染
        rootsRef.current.forEach((root) => {
          try {
            root.unmount();
          } catch (e) {
            console.error("Error unmounting root:", e);
          }
        });
        rootsRef.current.clear();

        // 设置初始HTML
        if (containerRef.current) {
          containerRef.current.innerHTML = htmlContent;

          // 处理AdSense嵌入
          const adsenseEmbeds =
            containerRef.current.querySelectorAll(".adsense-embed");

          if (adsenseEmbeds.length > 0) {
            console.log(`找到${adsenseEmbeds.length}个AdSense嵌入点`);
          }

          adsenseEmbeds.forEach((embedDiv, index) => {
            const adSlot = embedDiv.getAttribute("data-ad-slot");
            if (!adSlot) {
              console.warn("发现AdSense嵌入点但没有slot信息");
              return;
            }

            console.log(`处理AdSense嵌入 #${index+1}, slot: ${adSlot}`);

            // 创建AdSense容器
            const adsenseContainer = document.createElement("div");
            adsenseContainer.className = "not-prose my-6";
            embedDiv.parentNode?.replaceChild(adsenseContainer, embedDiv);

            const adsenseId = `adsense-${generateId()}`;

            try {
              // 创建React根并渲染
              const root = createRoot(adsenseContainer);
              rootsRef.current.set(adsenseId, root);
              console.log(`为AdSense创建React根: ${adsenseId}`);
              root.render(<AdSenseEmbed adSlot={adSlot} />);
            } catch (err) {
              console.error(`渲染AdSense组件失败:`, err);
              adsenseContainer.innerHTML = `<div class="p-2 text-red-500 border border-red-200 rounded">AdSense加载失败</div>`;
            }
          });

          // 处理YouTube嵌入
          const youtubeEmbeds =
            containerRef.current.querySelectorAll(".youtube-embed");

          youtubeEmbeds.forEach((embedDiv) => {
            const videoId = embedDiv.getAttribute("data-video-id");
            if (!videoId) return;

            // 创建YouTube容器
            const youtubeContainer = document.createElement("div");
            youtubeContainer.className = "not-prose my-6";
            embedDiv.parentNode?.replaceChild(youtubeContainer, embedDiv);

            const youtubeId = `youtube-${generateId()}`;

            // 创建React根并渲染
            const root = createRoot(youtubeContainer);
            rootsRef.current.set(youtubeId, root);

            root.render(<YouTubeEmbed videoId={videoId} />);
          });

          // 处理Mermaid代码块
          const mermaidBlocks = containerRef.current.querySelectorAll(
            "pre > code.language-mermaid"
          );

          mermaidBlocks.forEach((block) => {
            const pre = block.parentElement;
            if (!pre) return;

            // 创建图表容器
            const chartContainer = document.createElement("div");
            chartContainer.className = "not-prose my-6";
            pre.parentNode?.replaceChild(chartContainer, pre);

            // 解码内容
            const code = decodeHtmlEntities(block.textContent || "");
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
          const codeBlocks = containerRef.current.querySelectorAll(
            "pre > code:not(.language-mermaid)"
          );

          codeBlocks.forEach((block) => {
            // 获取语言
            const classes = Array.from(block.classList);
            const langClass = classes.find((cls) =>
              cls.startsWith("language-")
            );
            const language = langClass
              ? langClass.replace("language-", "")
              : "";

            const pre = block.parentElement;
            if (!pre) return;

            // 创建代码块容器
            const codeContainer = document.createElement("div");
            codeContainer.className = "not-prose my-6";
            pre.parentNode?.replaceChild(codeContainer, pre);

            // 解码内容
            const code = decodeHtmlEntities(block.textContent || "");
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
        rootsRef.current.forEach((root) => {
          try {
            root.unmount();
          } catch (e) {
            // 忽略错误
            console.error("Error unmounting root:", e);
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
            {content ? `内容长度: ${content.length}` : "无内容"}
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

  return (
    <div
      ref={containerRef}
      className="prose prose-blue dark:prose-invert max-w-none"
    />
  );
}
