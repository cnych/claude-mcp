'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// 定义props接口
type TagListProps = {
  initialTags?: string[];
};

export function TagList({ initialTags = [] }: TagListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Servers');
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const [firstRowTags, setFirstRowTags] = useState<string[]>([]);
  
  // 初始默认显示更多标签，确保第一行足够满
  const DEFAULT_VISIBLE_COUNT = 12; 
  
  // 获取当前选中的标签(可能是字符串或数组)
  const selectedTagParam = searchParams?.get('tags') || searchParams?.getAll('tags');
  
  // 标准化为数组
  const selectedTags = Array.isArray(selectedTagParam) 
    ? selectedTagParam 
    : (selectedTagParam ? [selectedTagParam] : []);
  
  // 计算哪些标签在第一行
  useEffect(() => {
    // 初始设置为默认数量或全部标签
    setFirstRowTags(initialTags.slice(0, Math.min(DEFAULT_VISIBLE_COUNT, initialTags.length)));
    
    const detectFirstRowTags = () => {
      // 确保DOM已经渲染
      if (!tagsContainerRef.current) return;
      
      const tagElements = Array.from(tagsContainerRef.current.querySelectorAll('.tag-item'));
      if (tagElements.length <= 1) return; // 确保至少有All标签和一个普通标签
      
      // 获取第一个标签的位置
      const firstRect = tagElements[0].getBoundingClientRect();
      const firstRowY = firstRect.top;
      
      // 收集第一行标签的索引
      const rowTagIndexes: number[] = [];
      let hasMoreRows = false;
      
      // 从第二个标签开始检测(跳过All标签)
      for (let i = 1; i < tagElements.length; i++) {
        const rect = tagElements[i].getBoundingClientRect();
        
        // 如果当前标签与第一个标签在同一行
        if (Math.abs(rect.top - firstRowY) < 5) { // 允许5px的误差
          // 索引减1是因为initialTags不包含"All"标签
          const tagIndex = i - 1;
          if (tagIndex >= 0 && tagIndex < initialTags.length) {
            rowTagIndexes.push(tagIndex);
          }
        } else {
          hasMoreRows = true;
          break; // 一旦发现不在同一行的标签，立即停止并确认有多行
        }
      }
      
      // 设置第一行的标签
      let firstRowTagsList = rowTagIndexes.map(idx => initialTags[idx]);
      
      // 如果自动检测的结果少于默认值，使用默认值
      if (firstRowTagsList.length < Math.min(DEFAULT_VISIBLE_COUNT, initialTags.length)) {
        firstRowTagsList = initialTags.slice(0, Math.min(DEFAULT_VISIBLE_COUNT, initialTags.length));
        hasMoreRows = initialTags.length > DEFAULT_VISIBLE_COUNT;
      }
      
      setFirstRowTags(firstRowTagsList);
    };
    
    // 多次尝试检测，确保DOM完全渲染后能正确计算
    const timers = [
      setTimeout(detectFirstRowTags, 0),
      setTimeout(detectFirstRowTags, 100),
      setTimeout(detectFirstRowTags, 300),
      setTimeout(detectFirstRowTags, 500)
    ];
    
    // 监听窗口大小变化时重新计算
    window.addEventListener('resize', detectFirstRowTags);
    
    // 清理
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      window.removeEventListener('resize', detectFirstRowTags);
    };
  }, [initialTags, DEFAULT_VISIBLE_COUNT]);
  
  const handleTagClick = (tag: string | null) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    
    if (tag === null) {
      // 点击 All 标签时，移除所有标签过滤
      params.delete('tags');
    } else {
      // 移除当前的所有tags参数
      params.delete('tags');
      
      // 判断当前标签是否已选中
      if (!selectedTags.includes(tag)) {
        // 如果标签未选中，设置为唯一选中标签
        params.append('tags', tag);
      }
      // 如果标签已选中，则不添加任何标签，相当于选择"全部"
    }
    
    // 保留其他查询参数（如q=关键词）
    const newPath = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newPath);
  };

  // 确定显示哪些标签
  const tagsToShow = expanded 
    ? initialTags 
    : (firstRowTags.length > 0 ? firstRowTags : initialTags.slice(0, DEFAULT_VISIBLE_COUNT));
    
  // 强制显示折叠/展开按钮，除非initialTags为空或只有一个标签
  const shouldShowExpandButton = initialTags.length > firstRowTags.length;

  return (
    <div className="py-4" ref={containerRef}>
      <div className="flex flex-wrap gap-2" ref={tagsContainerRef}>
        <Badge
          variant="outline"
          onClick={() => handleTagClick(null)}
          className={`tag-item cursor-pointer rounded-full px-3 py-1 text-sm transition-colors
            ${selectedTags.length === 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100'
            }`}
        >
          {t('allTags')}
        </Badge>
        {tagsToShow.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            onClick={() => handleTagClick(tag)}
            className={`tag-item cursor-pointer rounded-full px-3 py-1 text-sm transition-colors
              ${selectedTags.includes(tag)
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
                : 'bg-gray-900/90 hover:bg-gray-800 text-white border-transparent dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
          >
            {tag}
          </Badge>
        ))}
        
        {shouldShowExpandButton && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-8 h-8 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={expanded ? '收起' : '展开'}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
    </div>
  );
} 