import { getTranslations } from 'next-intl/server';
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

export async function IntegrationSection() {
  const t = await getTranslations('Index');
  
  return (
    <div className="py-32 px-6 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-1/4 top-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 w-[350px] h-[350px] bg-primary/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* 左侧内容区域 */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                <Github className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-4xl font-bold">
                {t('integration.title')}
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground">
              {t('integration.description')}
            </p>
            
            <div>
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
                  <Github className="mr-2" />
                  {t('integration.viewGithub')}
                  <ArrowUpRight className="ml-2" />
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {['simple', 'flexible', 'secure', 'fast'].map((key) => (
                <div
                  key={key}
                  className="flex items-center gap-2 p-4 rounded-lg bg-background/50 backdrop-blur-sm"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">
                    {t(`integration.features.${key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 代码示例区域 */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl blur-3xl" />
            <div className="relative rounded-xl overflow-hidden border border-primary/10 shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-8 bg-background/80 backdrop-blur-sm flex items-center gap-2 px-4">
                <div className="flex gap-2">
                  {['bg-red-500', 'bg-yellow-500', 'bg-green-500'].map((color) => (
                    <div 
                      key={color}
                      className={`w-3 h-3 rounded-full ${color}`}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 