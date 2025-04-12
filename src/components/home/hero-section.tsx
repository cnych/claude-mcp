'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Link as I18nLink } from '@/i18n/routing';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Book,Video } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function HeroSection() {
  const t = useTranslations('Index');
  const locale = useLocale();

  console.log(locale, locale === 'zh' || locale === 'tw');

  return (
    <motion.section 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden animated-gradient"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.07]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary))_0%,transparent_50%)] opacity-[0.15]" />
        <div className="absolute left-1/4 top-1/3 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/3 w-[350px] h-[350px] bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute right-1/3 top-1/4 w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        className="max-w-5xl mx-auto px-6 py-24 text-center relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="space-y-8" variants={item}>
          <motion.div 
            className="inline-block rounded-full px-4 py-1.5 glass-effect text-primary text-sm font-medium mb-8 hover-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎉 {t('hero.introducing')}
          </motion.div>
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight gradient-text [text-wrap:balance]"
            variants={item}
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-4xl mx-auto [text-wrap:balance] leading-relaxed"
            variants={item}
          >
            {t('hero.description')}
          </motion.p>
          <motion.div 
            className="flex items-center justify-center gap-6 pt-4"
            variants={item}
          >
            <I18nLink href="/docs">
              <Button variant="default" size="lg" className="h-12 px-6 text-base hover-card">
                {t('hero.documentation')}
                <Book className="ml-2" />
              </Button>
            </I18nLink>
            {(locale === 'zh' || locale === 'tw') && (
              <Link href="https://fastclass.cn/course/mcp">
                <Button variant="default" size="lg" className="h-12 px-6 text-base hover-card">
                  {t('hero.videoCourse')}
                <Video className="ml-2" />
                </Button>
              </Link>
            )}
              <Link href="https://www.a2aprotocol.net/?ref=claude-mcp">
                <Button variant="default" size="lg" className="h-12 px-6 text-base hover-card">
                  {t('hero.a2a')}
                  <Book className="ml-2" />
                </Button>
              </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
} 