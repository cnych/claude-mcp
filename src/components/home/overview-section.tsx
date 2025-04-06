'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

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

export function OverviewSection() {
  const t = useTranslations('Index');

  return (
    <motion.section 
      className="py-32 px-6 bg-gradient-to-b from-background to-primary/5"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-4xl font-bold leading-tight gradient-text"
              variants={item}
            >
              {t('overview.title')}
            </motion.h2>
            <motion.div 
              className="space-y-6 text-lg text-muted-foreground"
              variants={item}
            >
              <p>{t('overview.description1')}</p>
              <p>{t('overview.description2')}</p>
            </motion.div>
            <motion.div 
              className="grid grid-cols-2 gap-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {['systems', 'tools', 'environments', 'datasets'].map((key, index) => (
                <motion.div 
                  key={index}
                  variants={item}
                  whileHover={{ scale: 1.05 }}
                  className="group p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      {t(`overview.supports.${key}`)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl blur-3xl" />
            <motion.div 
              className="relative bg-background/80 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-semibold mb-6">
                {t('overview.components.title')}
              </h3>
              <motion.ul 
                className="space-y-6"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {['spec', 'desktop', 'servers'].map((key, index) => (
                  <motion.li 
                    key={index}
                    variants={item}
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-base">
                      {t(`overview.components.${key}`)}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
} 