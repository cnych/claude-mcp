'use client';

import { Link } from '@/i18n/routing';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const [isMobile, setIsMobile] = useState(false);
  
  // 检测屏幕宽度变化
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // 初始检查
    checkIfMobile();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkIfMobile);
    
    // 清理监听器
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // 在移动端只显示最后两个项目
  const displayItems = isMobile && items.length > 2 
    ? [
        { label: '...', href: undefined },
        ...items.slice(-2)
      ]
    : items;
  
  return (
    <nav className="flex mb-4 sm:mb-8 overflow-x-auto" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 sm:space-x-2 flex-nowrap min-w-0 w-full">
        <li className="flex-shrink-0">
          <Link 
            href="/"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="首页"
          >
            <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </Link>
        </li>
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center flex-shrink-0">
            <ChevronRightIcon 
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" 
              aria-hidden="true" 
            />
            {item.href ? (
              <Link
                href={item.href as any}
                className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 
                  hover:text-gray-700 dark:hover:text-gray-300 truncate max-w-[120px] sm:max-w-xs"
                title={item.label}
              >
                {item.label}
              </Link>
            ) : (
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px] sm:max-w-xs" title={item.label}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 