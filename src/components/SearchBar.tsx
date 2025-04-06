'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchBar(props: { position: 'Servers' | 'Clients' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations(props.position);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // 从URL参数中获取初始关键词
  useEffect(() => {
    const query = searchParams?.get('q') ?? '';
    setKeyword(query);
    setDebouncedKeyword(query);
  }, [searchParams]);

  // 防抖处理，避免频繁更新URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedKeyword !== keyword) {
        setDebouncedKeyword(keyword);
        handleSearch(keyword);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  // 处理搜索，更新URL参数
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    
    // 更新搜索关键词参数
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    
    // 构建新的URL路径，保留其他查询参数（如tags）
    const newPath = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newPath);
  };

  return (
    <div className="w-full border-2 p-4 rounded-xl dark:border-gray-600 mx-auto space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">{t('search')}</h3>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
} 