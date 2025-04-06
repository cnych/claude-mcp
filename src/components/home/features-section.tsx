'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Book, Users, Blocks } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const features = [
  { icon: Book, key: 'docs', gradient: 'from-blue-500 via-blue-400 to-blue-300' },
  { icon: Users, key: 'community', gradient: 'from-green-500 via-green-400 to-green-300' },
  { icon: Blocks, key: 'ecosystem', gradient: 'from-purple-500 via-purple-400 to-purple-300' }
];

export function FeaturesSection() {
  const t = useTranslations('Index');

  return (
    <motion.section 
      className="py-32 px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]"
          animate={{
            opacity: [0.3, 0.1, 0.3],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-block"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bg-primary/10 rounded-full p-2 mb-4">
              <div className="bg-primary/20 rounded-full p-2">
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
                  <Blocks className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          </motion.div>
          <motion.h2 
            className="text-4xl font-bold gradient-text"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          >
            {t('features.title')}
          </motion.h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map(({ icon: Icon, key, gradient }, index) => (
            <motion.div
              key={key}
              variants={item}
              whileHover={{ 
                scale: 1.02,
                rotate: 1,
                transition: { duration: 0.2 }
              }}
              className="group relative p-1 rounded-2xl"
            >
              <div className={cn(
                "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500",
                gradient
              )} />
              <motion.div 
                className="relative p-8 glass-effect rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="h-6 w-6 text-primary" />
                </motion.div>
                <motion.h3 
                  className="mt-6 text-xl font-semibold"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.3 }}
                >
                  {t(`features.${key}.title`)}
                </motion.h3>
                <motion.p 
                  className="mt-4 text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.4 }}
                >
                  {t(`features.${key}.description`)}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.description')}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
} 