'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link as I18nLink } from '@/i18n/routing';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Book, Video } from 'lucide-react';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const t = useTranslations('Index');
  const locale = useLocale();
  const [isMobile, setIsMobile] = useState(false);
  
  // 检测屏幕宽度变化 - 使用节流函数减少频繁触发
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 初始检查
    checkIfMobile();
  }, []);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/0" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.07]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)))_0%,transparent_50%)] opacity-[0.15]" />
        <div className="absolute left-1/4 top-1/3 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/3 w-[350px] h-[350px] bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute right-1/3 top-1/4 w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* 内容区 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-24 text-center relative z-10">
        <div className="space-y-6 sm:space-y-8">
          <div className="inline-block rounded-full px-3 sm:px-4 py-1 sm:py-1.5 glass-effect text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-8">
            🎉 {t('hero.introducing')}
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight gradient-text [text-wrap:balance]">
            {t('hero.title')}
          </h1>
          
          <p className="text-base sm:text-xl text-muted-foreground max-w-4xl mx-auto [text-wrap:balance] leading-relaxed">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pt-2 sm:pt-4">
            <I18nLink href="/docs" className="w-full sm:w-auto">
              <Button variant="default" size={isMobile ? "default" : "lg"} className={`${isMobile ? 'h-10' : 'h-12'} px-4 sm:px-6 text-sm sm:text-base w-full`}>
                {t('hero.documentation')}
                <Book className="ml-2 h-4 w-4" />
              </Button>
            </I18nLink>
            
            {(locale === 'zh' || locale === 'tw') && (
              <Link href="https://fastclass.cn/course/mcp" className="w-full sm:w-auto">
                <Button variant="default" size={isMobile ? "default" : "lg"} className={`${isMobile ? 'h-10' : 'h-12'} px-4 sm:px-6 text-sm sm:text-base w-full`}>
                  {t('hero.videoCourse')}
                  <Video className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            
            <Link href="https://www.a2aprotocol.net/?ref=claude-mcp" className="w-full sm:w-auto">
              <Button variant="default" size={isMobile ? "default" : "lg"} className={`${isMobile ? 'h-10' : 'h-12'} px-4 sm:px-6 text-sm sm:text-base w-full`}>
                {t('hero.a2a')}
                <Book className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 