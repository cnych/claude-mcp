"use client";

import { useTranslations } from "next-intl";
import { type MCPClient } from "@/types/client";
import { 
  Github, 
  Globe, 
  Calendar,
  Monitor,
  Laptop,
  Server
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Markdown } from "@/components/ui/markdown";
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface ClientDetailsProps {
  client: MCPClient;
}

export function ClientDetails({ client }: ClientDetailsProps) {
  const t = useTranslations("Clients");
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // 使用 YYYY-MM-DD 格式，避免本地化问题
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    } catch (e) {
      console.error(e);
      return dateString;
    }
  };
  
  // 处理平台信息
  const platformLabels = [];
  if (client.platforms.windows) platformLabels.push(t("platformWindows"));
  if (client.platforms.mac) platformLabels.push(t("platformMac"));
  if (client.platforms.linux) platformLabels.push(t("platformLinux"));
  if (client.platforms.web) platformLabels.push(t("platformWeb"));
  if (client.platforms.ios) platformLabels.push(t("platformIos"));
  if (client.platforms.android) platformLabels.push(t("platformAndroid"));
  
  const platformsText = platformLabels.join(", ");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 面包屑导航 */}
      <Breadcrumb
        items={[
          { label: t('title'), href: '/clients' },
          { label: client.name }
        ]}
      />
      
      <div className="mb-8">
        
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-6">
            {client.icon ? (
              <Image 
                src={client.icon} 
                alt={client.name} 
                width={100} 
                height={100} 
                className="cursor-pointer rounded-full"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Monitor className="h-12 w-12 text-gray-500 dark:text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {client.name}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              {client.digest}
            </p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {client.tags.map((tag) => (
                <Link key={tag} href={{ pathname: '/clients', query: { tags: tag } }}>
                  <Badge variant="secondary">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
            <Server className="h-5 w-5 mr-2" />
            <span className="font-medium">{t("author")}</span>
          </div>
          <p>{client.author}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="h-5 w-5 mr-2" />
            <span className="font-medium">{t("published")}</span>
          </div>
          <p>{formatDate(client.createTime)}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
            <Laptop className="h-5 w-5 mr-2" />
            <span className="font-medium">{t("platforms")}</span>
          </div>
          <p>{platformsText}</p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="prose dark:prose-invert max-w-none">
          <Markdown content={client.description} />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-12">
        {client.homepage && (
          <Button asChild>
            <a href={client.homepage} target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" />
              {t("visitHomepage")}
            </a>
          </Button>
        )}
        
        {client.repository && (
          <Button variant="outline" asChild>
            <a href={client.repository} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              {t("viewRepository")}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
} 