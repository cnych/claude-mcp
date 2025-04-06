'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, Code2, Database, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function ProtocolSection() {
  const t = useTranslations('Index.protocol');

  const features = [
    {
      icon: <Code2 className="h-6 w-6" />,
      title: t('components.resources.title'),
      description: t('components.resources.description'),
      color: 'from-blue-500/10 to-blue-500/30 text-blue-500',
      shadowColor: 'shadow-blue-500/20',
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: t('components.tools.title'),
      description: t('components.tools.description'),
      color: 'from-purple-500/10 to-purple-500/30 text-purple-500',
      shadowColor: 'shadow-purple-500/20',
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: t('components.messages.title'),
      description: t('components.messages.description'),
      color: 'from-green-500/10 to-green-500/30 text-green-500',
      shadowColor: 'shadow-green-500/20',
    },
  ];

  const protocolFeatures = [
    {
      title: t('features.standardized'),
      description: t('features.standardizedDescription'),
      color: 'bg-gradient-to-br from-blue-500 to-purple-500',
    },
    {
      title: t('features.extensible'),
      description: t('features.extensibleDescription'),
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    },
    {
      title: t('features.secure'),
      description: t('features.secureDescription'),
      color: 'bg-gradient-to-br from-pink-500 to-red-500',
    },
  ];

  return (
    <section id="protocol" className="overflow-hidden bg-gray-50 dark:bg-gray-900/50 py-24 sm:py-32">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-6 lg:px-8"
      >
        <motion.div variants={item} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
            {t('description')}
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-7xl">
          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* 左侧：协议组件 */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="relative"
                >
                  <div className={`absolute -inset-2 rounded-lg bg-gradient-to-r ${feature.color} opacity-10 blur-lg`} />
                  <div className={`relative rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg ${feature.shadowColor} hover:shadow-xl transition-shadow`}>
                    <div className="flex items-center gap-4">
                      <div className={`rounded-lg bg-gradient-to-br ${feature.color} p-2`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 右侧：协议特性 */}
            <motion.div variants={item} className="lg:pl-8 space-y-6">
              <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                  {t('features.title')}
                </h3>
                <div className="space-y-4">
                  {protocolFeatures.map((feature, index) => (
                    <div key={feature.title} className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-lg ${feature.color} flex items-center justify-center`}>
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Button asChild className="w-full">
                    <Link href="/specification">
                      {t('viewSpec')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}