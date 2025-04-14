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
import { MarkdownComponent as Markdown } from "@/components/ui/markdown";
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useState, useEffect } from 'react';

interface ClientDetailsProps {
  client: MCPClient;
}

export function ClientDetails({ client }: ClientDetailsProps) {
  const t = useTranslations("Clients");
  const [isMobile, setIsMobile] = useState(false);
  
  // 检测屏幕宽度变化
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 初始检查
    checkIfMobile();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkIfMobile);
    
    // 清理监听器
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
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
      
      <div className="mb-6 sm:mb-8">
        <div className={`flex ${isMobile ? 'flex-col' : 'items-start'}`}>
          <div className={`${isMobile ? 'mb-4 flex justify-center' : 'flex-shrink-0 mr-6'}`}>
            {client.icon ? (
              <Image 
                src={client.icon} 
                alt={client.name} 
                width={isMobile ? 80 : 100} 
                height={isMobile ? 80 : 100} 
                className="cursor-pointer rounded-full"
              />
            ) : (
              <div className={`${isMobile ? 'w-20 h-20' : 'w-24 h-24'} bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center`}>
                <Monitor className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} text-gray-500 dark:text-gray-400`} />
              </div>
            )}
          </div>
          
          <div className={`flex-grow ${isMobile ? 'text-center' : ''}`}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {client.name}
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-2">
              {client.digest}
            </p>
            
            <div className={`mt-4 flex flex-wrap gap-2 ${isMobile ? 'justify-center' : ''}`}>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-8">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
            <Server className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="font-medium text-sm sm:text-base">{t("author")}</span>
          </div>
          <p className="text-sm sm:text-base">{client.author}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="font-medium text-sm sm:text-base">{t("published")}</span>
          </div>
          <p className="text-sm sm:text-base">{formatDate(client.createTime)}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
            <Laptop className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="font-medium text-sm sm:text-base">{t("platforms")}</span>
          </div>
          <p className="text-sm sm:text-base">{platformsText}</p>
        </div>
      </div>
      
      <div className="mb-6 sm:mb-8">
        <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base overflow-x-scroll">
          <Markdown content={client.description} />
        </div>
      </div>
      
      <div className={`flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12 ${isMobile ? 'justify-center' : ''}`}>
        {client.homepage && (
          <Button size={isMobile ? "sm" : "default"} asChild className="w-full sm:w-auto">
            <a href={client.homepage} target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" />
              {t("visitHomepage")}
            </a>
          </Button>
        )}
        
        {client.repository && (
          <Button size={isMobile ? "sm" : "default"} variant="outline" asChild className="w-full sm:w-auto">
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