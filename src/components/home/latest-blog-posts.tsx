'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LatestBlogPostsProps {
  posts: BlogPost[];
}

export function LatestBlogPosts({ posts }: LatestBlogPostsProps) {
  const t = useTranslations('HomePage');
  const { locale } = useParams();

  if (!posts || posts.length === 0) {
    return null;
  }

  // 只显示最多3篇博客文章
  const displayPosts = posts.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('latestBlog.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('latestBlog.description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayPosts.map((post) => (
            <Link href={`/${locale}/blog/${post.slug}`} key={post.id} className="group block">
              <div className="flex flex-col h-full overflow-hidden rounded-xl border bg-background shadow-sm hover:shadow-md transition-all duration-200">
                {post.coverImage && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-grow p-5">
                  <Badge variant="outline" className="self-start mb-3 text-xs font-medium text-muted-foreground">
                    {post.category}
                  </Badge>
                  <h3 className="mb-3 line-clamp-2 text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="mb-5 line-clamp-3 text-sm text-muted-foreground flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <div className="flex items-center">
                      {post.author.avatar ? (
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={28}
                          height={28}
                          className="mr-2 rounded-full"
                        />
                      ) : (
                        <div className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                          {post.author.name.charAt(0)}
                        </div>
                      )}
                      <p className="text-xs font-medium">{post.author.name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href={`/${locale}/blog`} className="flex items-center gap-2">
              {t('latestBlog.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 