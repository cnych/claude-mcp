'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';


export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  slug: string;
  featured?: boolean;
}

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured';
}

export default function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const { locale } = useParams();
  
  if (variant === 'featured') {
    return (
      <Link href={`/${locale}/blog/${post.slug}`} className="block group relative">
        <div className="flex flex-col md:flex-row overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-200">
          {post.coverImage && (
            <div className="relative h-[320px] md:h-[360px] lg:h-[420px] md:w-1/2 overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex flex-col justify-between p-6 md:w-1/2">
            <div>
              <h2 className="mb-3 text-2xl md:text-3xl font-bold leading-tight group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="mb-6 text-muted-foreground line-clamp-6">
                {post.excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="mr-3 rounded-full"
                  />
                ) : (
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {post.author.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{post.author.name}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{post.date}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  
  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="block group">
      <div className="flex flex-col h-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
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
  );
} 