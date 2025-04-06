'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

// 定义props接口
type TagListProps = {
  initialTags?: string[];
};

export function TagList({ initialTags = [] }: TagListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Servers');
  
  // 获取当前选中的标签(可能是字符串或数组)
  const selectedTagParam = searchParams?.get('tags') || searchParams?.getAll('tags');
  
  // 标准化为数组
  const selectedTags = Array.isArray(selectedTagParam) 
    ? selectedTagParam 
    : (selectedTagParam ? [selectedTagParam] : []);
  
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

  return (
    <div className="py-4">
      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          onClick={() => handleTagClick(null)}
          className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-colors
            ${selectedTags.length === 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100'
            }`}
        >
          {t('allTags')}
        </Badge>
        {initialTags.map(tag => (
          <Badge
            key={tag}
            variant="outline"
            onClick={() => handleTagClick(tag)}
            className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-colors
              ${selectedTags.includes(tag)
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
                : 'bg-gray-900/90 hover:bg-gray-800 text-white border-transparent dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
} 