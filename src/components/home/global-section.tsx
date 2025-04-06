import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { languagesWithFlags } from '@/i18n/config';

const continents = [
  { name: 'North America', x: '20%', y: '35%' },
  { name: 'South America', x: '30%', y: '65%' },
  { name: 'Europe', x: '45%', y: '30%' },
  { name: 'Africa', x: '45%', y: '55%' },
  { name: 'Asia', x: '70%', y: '40%' },
  { name: 'Oceania', x: '80%', y: '70%' },
];

export function GlobalSection() {
  const t = useTranslations('Index');

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animated-gradient opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        {/* 静态连接点 */}
        {continents.map((continent) => (
          <div
            key={continent.name}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{
              left: continent.x,
              top: continent.y,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
          <Globe className="h-10 w-10 text-primary" />
        </div>

        <div>
          <h2 className="mt-8 text-4xl font-bold gradient-text">
            {t('global.title')}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground [text-wrap:balance] leading-relaxed">
            {t('global.description')}
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {languagesWithFlags.map((lang) => (
              <Link
                key={lang.code}
                href="/"
                locale={lang.code}
                className="block relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-col items-center glass-effect rounded-xl p-6 border border-primary/10 hover:-translate-y-1 transition-transform duration-200">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <lang.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t(`global.languages.${lang.code}`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-4">
            {['community', 'documentation', 'support'].map((key) => (
              <div 
                key={key}
                className="px-6 py-3 rounded-full glass-effect hover-card text-primary font-medium hover:scale-105 transition-transform duration-200"
              >
                {t(`global.features.${key}`)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 