'use client';

import { Link } from '@/i18n/routing';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  
  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            href="/"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <HomeIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRightIcon 
              className="h-5 w-5 text-gray-400 dark:text-gray-500" 
              aria-hidden="true" 
            />
            {item.href ? (
              <Link
                href={item.href as any}
                className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400 
                  hover:text-gray-700 dark:hover:text-gray-300"
              >
                {item.label}
              </Link>
            ) : (
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 