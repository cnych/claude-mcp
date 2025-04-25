'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';
import { 
  CalendarIcon, 
  ArrowLeftIcon, 
  ClockIcon,
  TwitterIcon,
  LinkedinIcon,
  LinkIcon
} from 'lucide-react';
import type { BlogPost } from './BlogCard';
import { MarkdownComponent as Markdown } from '@/components/ui/markdown';

export interface BlogPostDetails extends BlogPost {
  content: string;
  readTime?: string;
  tags?: string[];
  author: {
    name: string;
    avatar?: string;
    title?: string;
    bio?: string;
  };
  relatedPosts?: {
    id: string;
    title: string;
    slug: string;
    coverImage?: string;
  }[];
}

interface BlogPostProps {
  post: BlogPostDetails;
}

export default function BlogPost({ post }: BlogPostProps) {
  const { locale } = useParams();
  const t = useTranslations('Blog.common');

  // 复制链接
  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert(t('linkCopied'));
  };

  return (
    <article className="relative mx-auto max-w-4xl px-4 sm:px-0">
      {/* 返回按钮 */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="p-0 hover:bg-transparent">
          <Link href={`/${locale}/blog`} className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {t('backToBlog')}
          </Link>
        </Button>
      </div>

      {/* 文章头部信息 */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className="text-xs uppercase font-medium">
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground">·</span>
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>{post.date}</span>
          </div>
          {post.readTime && (
            <>
              <span className="text-xs text-muted-foreground">·</span>
              <div className="flex items-center text-xs text-muted-foreground">
                <ClockIcon className="mr-1 h-3 w-3" />
                <span>{post.readTime} {t('minutesRead')}</span>
              </div>
            </>
          )}
        </div>

        {/* 封面图 */}
        {post.coverImage && (
          <div className="relative w-full overflow-hidden rounded-xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={675}
              priority
              className="w-full h-auto object-contain"
              unoptimized
            />
          </div>
        )}
        
        <h1 className="mt-10 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{post.title}</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="mr-3 rounded-full"
              />
            ) : (
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {post.author.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-medium">{post.author.name}</p>
              {post.author.title && (
                <p className="text-sm text-muted-foreground">{post.author.title}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      
      <Markdown content={post.content} />

      {/* 标签 */}
      {post.tags && post.tags.length > 0 && (
        <div className="my-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 分享按钮 */}
      <div className="my-10 border-t border-b py-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('shareArticle')}</span>
          <div className="flex gap-3">
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}>
              <TwitterIcon className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
              <LinkedinIcon className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={copyLink}>
              <LinkIcon className="h-4 w-4" />
              <span className="sr-only">{t('copyLink')}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 作者信息 */}
      {post.author.bio && (
        <div className="my-10 rounded-xl border bg-card p-6">
          <div className="flex items-start gap-4">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
                {post.author.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-xl font-medium">{post.author.name}</h3>
              {post.author.title && (
                <p className="text-sm text-muted-foreground">{post.author.title}</p>
              )}
              <p className="mt-2 text-muted-foreground">{post.author.bio}</p>
            </div>
          </div>
        </div>
      )}

      {/* 相关文章 */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <div className="mt-16 border-t pt-12">
          <h2 className="mb-8 text-2xl font-bold">{t('relatedPosts')}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {post.relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/${locale}/blog/${relatedPost.slug}`}
                className="group block overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md"
              >
                {relatedPost.coverImage && (
                  <div className="relative h-40 w-full">
                    <Image
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="line-clamp-2 font-medium transition-colors group-hover:text-primary">
                    {relatedPost.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
} 