"use client";

import { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
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
    // 预处理任务列表标记
    let processedMarkdown = markdown;
    
    // 将任务列表标记替换为带有特殊类的HTML标记
    processedMarkdown = processedMarkdown.replace(
      /^(\s*)-\s*\[( |x|X)\]\s+(.*)$/gm, 
      (match, indent, checked, content) => {
        const isChecked = checked.toLowerCase() === 'x' ? 'checked' : '';
        return `${indent}- <label class="task-list-item"><input type="checkbox" ${isChecked} disabled class="task-list-item-checkbox"> ${content}</label>`;
      }
    );
    
    // 直接替换特殊格式的表格 (以|开头和结尾的多行)
    // 这是StackOverflow推荐的方法，直接用正则表达式替换
    const tableRegex = /(\|[^\n]+\|\r?\n)+/g;
    processedMarkdown = processedMarkdown.replace(tableRegex, (tableMatch) => {
      // 分割表格行
      const rows = tableMatch.split('\n').filter(row => row.trim().length > 0);
      if (rows.length === 0) return tableMatch;
      
      // 构建HTML表格
      let tableHtml = '<div class="overflow-x-auto my-6 custom-table-wrapper">\n';
      tableHtml += '<table class="custom-table w-full border-collapse">\n';
      
      // 处理表格行
      rows.forEach((row, rowIndex) => {
        // 从行中提取单元格内容
        const cellMatches = Array.from(row.matchAll(/\|(.*?)(?=\||$)/g))
          .map(match => match[1].trim())
          .filter(cell => cell !== '');
          
        if (cellMatches.length === 0) return;
        
        // 检查是否是分隔行 (全是 - 的行)
        const isSeparator = cellMatches.every(cell => /^[-=\s]+$/.test(cell));
        
        // 跳过分隔行
        if (isSeparator && rowIndex === 1) return;
        
        // 确定是表头还是表体
        const isHeader = (rowIndex === 0);
        const tag = isHeader ? 'th' : 'td';
        
        // 行开始
        if (rowIndex === 0) {
          tableHtml += '<thead>\n<tr class="bg-gray-100 dark:bg-gray-800">\n';
        } else if (rowIndex === 1 && rows.length > 2) {
          tableHtml += '<tbody>\n<tr class="bg-white dark:bg-gray-900">\n';
        } else {
          const bgClass = rowIndex % 2 === 0 
            ? 'bg-white dark:bg-gray-900' 
            : 'bg-gray-50 dark:bg-gray-800/50';
          tableHtml += `<tr class="${bgClass}">\n`;
        }
        
        // 添加单元格
        cellMatches.forEach(cell => {
          const cellClass = isHeader 
            ? 'px-4 py-3 font-semibold text-left border-b-2 border-gray-300 dark:border-gray-600'
            : 'px-4 py-3 border-b border-gray-200 dark:border-gray-700';
          
          // 检查是否有代码路径
          const hasCodePath = cell.includes('/') || cell.includes('\\') || cell.includes('.json');
          const extraClass = hasCodePath ? ' font-mono whitespace-nowrap' : '';
          
          tableHtml += `<${tag} class="${cellClass}${extraClass}">${cell}</${tag}>\n`;
        });
        
        // 行结束
        tableHtml += '</tr>\n';
        
        // 如果是第一行，关闭thead
        if (rowIndex === 0) {
          tableHtml += '</thead>\n';
        }
      });
      
      // 确保tbody被添加
      if (!tableHtml.includes('<tbody>')) {
        tableHtml += '<tbody>\n';
      }
      
      // 关闭表格
      tableHtml += '</tbody>\n</table>\n</div>\n';
      
      return tableHtml;
    });

    // 增加对独立行的表格处理 - 处理不连续的或最后一行表格
    processedMarkdown = processedMarkdown.replace(/^\|(.+\|)+$/gm, (line) => {
      // 检查是否已经被处理过（在HTML标签内）
      if (/<\/?table|<\/?tr|<\/?td|<\/?th/.test(line)) {
        return line; // 已经在表格标签内，不再处理
      }

      // 提取单元格内容
      const cellMatches = Array.from(line.matchAll(/\|(.*?)(?=\||$)/g))
        .map(match => match[1].trim())
        .filter(cell => cell !== '');
        
      if (cellMatches.length === 0) return line;
      
      // 构建单行表格
      let tableHtml = '<div class="overflow-x-auto my-6 custom-table-wrapper">\n';
      tableHtml += '<table class="custom-table w-full border-collapse">\n';
      tableHtml += '<tbody>\n';
      tableHtml += '<tr class="bg-white dark:bg-gray-900">\n';
      
      // 添加单元格
      cellMatches.forEach(cell => {
        const cellClass = 'px-4 py-3 border-b border-gray-200 dark:border-gray-700';
        
        // 检查是否有代码路径
        const hasCodePath = cell.includes('/') || cell.includes('\\') || cell.includes('.json');
        const extraClass = hasCodePath ? ' font-mono whitespace-nowrap' : '';
        
        tableHtml += `<td class="${cellClass}${extraClass}">${cell}</td>\n`;
      });
      
      // 关闭表格
      tableHtml += '</tr>\n';
      tableHtml += '</tbody>\n';
      tableHtml += '</table>\n';
      tableHtml += '</div>\n';
      
      return tableHtml;
    });

    // 继续使用remark处理其他Markdown内容
    const result = await remark()
      .use(remarkGfm)
      .use(html, { 
        sanitize: false 
      })
      .process(processedMarkdown);

    return result.toString();
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
          
          // 后处理任务列表
          const taskItems = containerRef.current.querySelectorAll('.task-list-item');
          taskItems.forEach((item) => {
            // 移除列表项的默认样式
            (item as HTMLElement).style.listStyleType = 'none';
            
            // 找到复选框并样式化
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox) {
              (checkbox as HTMLInputElement).classList.add(
                'form-checkbox', 'h-4', 'w-4',
                'text-primary', 'border-gray-300', 'rounded',
                'mr-2', 'focus:ring-primary', 'dark:border-gray-600'
              );
            }
          });
          
          // 确保兼容性：处理可能已经通过remark-gfm渲染的常规任务列表复选框
          const legacyCheckboxes = containerRef.current.querySelectorAll('li > input[type="checkbox"]:not(.task-list-item-checkbox)');
          legacyCheckboxes.forEach((checkbox) => {
            const input = checkbox as HTMLInputElement;
            const listItem = input.parentElement;
            
            if (listItem) {
              listItem.style.listStyleType = 'none';
              input.classList.add(
                'form-checkbox', 'h-4', 'w-4',
                'text-primary', 'border-gray-300', 'rounded',
                'mr-2', 'focus:ring-primary', 'dark:border-gray-600'
              );
            }
          });
          
          // 作为最后的后备处理方案，仍然检查剩余的原始格式的 [x] 和 [ ] 
          const allListItems = containerRef.current.querySelectorAll('li');
          allListItems.forEach((li) => {
            // 已经处理过的任务列表项跳过
            if (li.classList.contains('task-list-item')) return;
            if (li.querySelector('input[type="checkbox"]')) return;
            
            const text = li.textContent || '';
            // 更强大的正则表达式，捕获多种任务列表格式
            const match = text.match(/^\s*\[([ xX])\]\s(.+)$/);
            
            if (match) {
              const isChecked = match[1].toLowerCase() === 'x';
              
              // 清除原始文本
              li.innerHTML = li.innerHTML.replace(/^\s*\[([ xX])\]\s/, '');
              
              // 创建并插入复选框
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.checked = isChecked;
              checkbox.disabled = true;
              checkbox.classList.add(
                'form-checkbox', 'h-4', 'w-4',
                'text-primary', 'border-gray-300', 'rounded',
                'mr-2', 'focus:ring-primary', 'dark:border-gray-600'
              );
              
              li.style.listStyleType = 'none';
              li.insertBefore(checkbox, li.firstChild);
            }
          });
          
          // 处理特殊的竖线分隔表格
          const pipeTables = containerRef.current.querySelectorAll('table.pipe-table');
          pipeTables.forEach((table) => {
            // 创建表格容器
            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'overflow-x-auto my-6 rounded-md border border-gray-200 dark:border-gray-700';
            
            // 移动表格到新容器中
            if (table.parentNode) {
              table.parentNode.insertBefore(tableWrapper, table);
              tableWrapper.appendChild(table);
            }
            
            // 设置表格基本样式
            table.className = 'w-full border-collapse text-sm';
            
            // 处理表头行
            const headerRows = table.querySelectorAll('thead tr');
            headerRows.forEach(row => {
              row.className = 'bg-gray-100 dark:bg-gray-800';
              
              // 处理表头单元格
              const headerCells = row.querySelectorAll('th');
              headerCells.forEach(cell => {
                (cell as HTMLTableCellElement).className = 'px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 border-r last:border-r-0';
                (cell as HTMLTableCellElement).style.whiteSpace = 'nowrap';
              });
            });
            
            // 处理表格行
            const bodyRows = table.querySelectorAll('tbody tr');
            bodyRows.forEach((row, i) => {
              // 设置基本样式和斑马条纹
              const className = i % 2 === 0
                ? 'border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                : 'border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50';
              
              row.className = className;
              
              // 处理单元格
              const cells = row.querySelectorAll('td');
              cells.forEach((cell) => {
                const cellElement = cell as HTMLTableCellElement;
                
                // 根据内容类型设置不同的类
                if (cellElement.classList.contains('separator-cell')) {
                  cellElement.className = 'px-1 py-1 text-center text-gray-400 dark:text-gray-600 border-r last:border-r-0 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 font-mono';
                } else if (cellElement.textContent?.includes('/') || cellElement.textContent?.includes('\\') || cellElement.textContent?.includes('.json')) {
                  cellElement.className = 'px-4 py-3 text-gray-700 dark:text-gray-300 border-r last:border-r-0 border-gray-200 dark:border-gray-700 font-mono whitespace-nowrap';
                } else {
                  cellElement.className = 'px-4 py-3 text-gray-700 dark:text-gray-300 border-r last:border-r-0 border-gray-200 dark:border-gray-700';
                }
              });
            });
          });

          // 增强标准表格样式
          const tables = containerRef.current.querySelectorAll('table:not(.pipe-table)');
          
          if (tables.length > 0) {
            console.log(`找到${tables.length}个表格，正在处理`);
          }
          
          tables.forEach((table, tableIndex) => {
            // 1. 创建表格容器以实现滚动
            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'overflow-x-auto my-6 rounded-md border border-gray-200 dark:border-gray-700';
            
            // 2. 将表格移到容器中
            table.parentNode?.insertBefore(tableWrapper, table);
            tableWrapper.appendChild(table);
            
            // 3. 设置表格基本样式
            table.className = 'w-full border-collapse text-sm';
            (table as HTMLTableElement).style.minWidth = '100%';
            
            // 4. 处理表头 (thead)
            const thead = table.querySelector('thead');
            if (thead) {
              thead.className = 'bg-gray-50 dark:bg-gray-800';
              
              const headerRows = thead.querySelectorAll('tr');
              headerRows.forEach(row => {
                row.className = 'border-b border-gray-200 dark:border-gray-700';
                
                const headerCells = row.querySelectorAll('th');
                headerCells.forEach(cell => {
                  cell.className = 'px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200 border-r last:border-r-0 border-gray-200 dark:border-gray-700';
                  cell.style.whiteSpace = 'nowrap';
                });
              });
            } else {
              // 如果没有表头，创建一个虚拟表头
              console.log(`表格 #${tableIndex + 1} 没有表头，尝试创建`);
              const firstRow = table.querySelector('tr');
              if (firstRow) {
                const cellCount = firstRow.querySelectorAll('td').length;
                if (cellCount > 0) {
                  // 创建虚拟表头
                  const newThead = document.createElement('thead');
                  newThead.className = 'bg-gray-50 dark:bg-gray-800';
                  
                  const headerRow = document.createElement('tr');
                  headerRow.className = 'border-b border-gray-200 dark:border-gray-700';
                  
                  for (let i = 0; i < cellCount; i++) {
                    const th = document.createElement('th');
                    th.className = 'px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200 border-r last:border-r-0 border-gray-200 dark:border-gray-700';
                    th.textContent = `列 ${i+1}`;
                    headerRow.appendChild(th);
                  }
                  
                  newThead.appendChild(headerRow);
                  table.insertBefore(newThead, table.firstChild);
                }
              }
            }
            
            // 5. 处理表体 (tbody)
            const tbody = table.querySelector('tbody') || table;
            if (tbody !== table) {
              tbody.className = 'bg-white dark:bg-gray-900';
            }
            
            const rows = tbody.querySelectorAll('tr');
            rows.forEach((row, rowIndex) => {
              // 斑马纹样式
              if (rowIndex % 2 === 0) {
                row.className = 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700';
              } else {
                row.className = 'bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700';
              }
              
              // 处理单元格
              const cells = row.querySelectorAll('td');
              cells.forEach((cell) => {
                const cellElement = cell as HTMLTableCellElement;
                
                // 基本单元格样式
                cellElement.className = 'px-4 py-3 text-gray-700 dark:text-gray-300 border-r last:border-r-0 border-gray-200 dark:border-gray-700';
                
                // 检查是否是分隔单元格（全是-或=的单元格）
                if (cellElement.classList.contains('separator-cell')) {
                  cellElement.className = 'px-1 py-1 text-center text-gray-400 dark:text-gray-600 border-r last:border-r-0 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800';
                  cellElement.style.fontFamily = 'monospace';
                }
                
                // 如果单元格内容是代码路径，则使用等宽字体
                const text = cellElement.textContent || '';
                if (text.includes('/') || text.includes('\\') || text.includes('.json')) {
                  cellElement.style.fontFamily = 'monospace';
                  cellElement.style.whiteSpace = 'nowrap';
                }
              });
            });
          });

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

          // 确保表格正确渲染
          const customTables = containerRef.current.querySelectorAll('.custom-table');
          customTables.forEach((table) => {
            const tableElement = table as HTMLTableElement;
            
            // 添加一些交互增强
            const rows = tableElement.querySelectorAll('tbody tr');
            rows.forEach(row => {
              // 添加悬停效果
              row.addEventListener('mouseenter', () => {
                row.classList.add('bg-gray-100', 'dark:bg-gray-800/70');
              });
              row.addEventListener('mouseleave', () => {
                row.classList.remove('bg-gray-100', 'dark:bg-gray-800/70');
              });
            });
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
      style={{
        // 添加任务列表的全局样式
        '--task-list-item-checkbox-margin': '0.25em 0.5em 0.25em 0',
      } as React.CSSProperties}
    />
  );
}
