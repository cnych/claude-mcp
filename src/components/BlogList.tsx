'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import BlogCard, { BlogPost } from './BlogCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';

interface BlogListProps {
  posts: BlogPost[];
  categories: string[];
}

export default function BlogList({ posts, categories }: BlogListProps) {
  const t = useTranslations('Blog.common');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // 过滤博客文章
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // 获取精选文章（取第一篇或标记为featured的文章）
  const featuredPost = posts.find(post => post.featured) || posts[0];
  // 其他文章（非精选文章）
  const otherPosts = filteredPosts.filter(post => post.id !== featuredPost.id);

  return (
    <div className="space-y-10 px-4 sm:px-0">
      {/* 搜索栏 - 现在移到最上面 */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('searchPlaceholder')}
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 分类导航 */}
      <div className="hidden flex-wrap items-center gap-2 justify-center border-b pb-4">
        <Button
          variant={selectedCategory === '' ? "default" : "ghost"}
          size="sm"
          className="rounded-full"
          onClick={() => setSelectedCategory('')}
        >
          {t('allCategories')}
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "ghost"}
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* 文章列表 */}
      {filteredPosts.length > 0 ? (
        <>
          {/* 精选文章 - 只在没有搜索或过滤时显示 */}
          {!searchQuery && !selectedCategory && (
            <div className="mb-12">
              <BlogCard post={featuredPost} variant="featured" />
            </div>
          )}
          
          {/* 常规文章列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(searchQuery || selectedCategory ? filteredPosts : otherPosts).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-60 items-center justify-center rounded-lg border bg-card p-8 text-center">
          <p className="text-lg text-muted-foreground">{t('noResults')}</p>
        </div>
      )}
    </div>
  );
} 