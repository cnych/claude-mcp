'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CodeBlock } from '@/components/ui/code-block';
import { Button } from '@/components/ui/button';
import { Github, ArrowUpRight } from 'lucide-react';

const EXAMPLE_CODE = `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
    },
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "path/to/git/repo"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    }
  }
}`;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function IntegrationSection() {
  const t = useTranslations('Index');

  return (
    <motion.section 
      className="py-32 px-6 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <motion.div 
          className="absolute left-1/4 top-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute right-1/4 bottom-1/4 w-[350px] h-[350px] bg-primary/20 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="space-y-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={item}>
              <motion.div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6"
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Github className="h-8 w-8 text-primary" />
              </motion.div>
              <motion.h2 
                className="text-4xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {t('integration.title')}
              </motion.h2>
            </motion.div>
            <motion.p 
              className="text-lg text-muted-foreground"
              variants={item}
            >
              {t('integration.description')}
            </motion.p>
            <motion.div variants={item}>
              <Button 
                variant="outline" 
                size="lg" 
                className="group"
                asChild
              >
                <a 
                  href="https://github.com/modelcontextprotocol/servers" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Github className="mr-2 group-hover:rotate-12 transition-transform" />
                  {t('integration.viewGithub')}
                  <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </Button>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-4 mt-8"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {['simple', 'flexible', 'secure', 'fast'].map((key) => (
                <motion.div
                  key={key}
                  variants={item}
                  className="flex items-center gap-2 p-4 rounded-lg bg-background/50 backdrop-blur-sm"
                >
                  <motion.div 
                    className="h-2 w-2 rounded-full bg-primary"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <span className="font-medium">
                    {t(`integration.features.${key}`)}
                  </span>
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
              className="relative rounded-xl overflow-hidden border border-primary/10 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 left-0 right-0 h-8 bg-background/80 backdrop-blur-sm flex items-center gap-2 px-4">
                <div className="flex gap-2">
                  {['bg-red-500', 'bg-yellow-500', 'bg-green-500'].map((color) => (
                    <motion.div 
                      key={color}
                      className={`w-3 h-3 rounded-full ${color}`}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-2">example.json</span>
              </div>
              <div className="pt-8">
                <CodeBlock
                  code={EXAMPLE_CODE}
                  language="typescript"
                  className="[&_pre]:!bg-background/80 [&_pre]:backdrop-blur-sm"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
} 