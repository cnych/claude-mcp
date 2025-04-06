"use client";

import { useTranslations } from "next-intl";
import { type MCPClient } from "@/types/client";
import { Link } from "@/i18n/routing";
import { ArrowRight, Apple, Github, Monitor, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";


interface ClientCardProps {
  client: MCPClient;
}

export function ClientCard({ client }: ClientCardProps) {
  const t = useTranslations("Clients");
  
  // 获取平台图标
  const getPlatformIcons = () => {
    const icons = [];
    
    if (client.platforms.windows) {
      icons.push(
        <span key="windows" className="text-blue-500" title={t("platformWindows")}>
          <svg className="h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 3.449L9.75 2.1V11.551H0V3.449ZM10.949 1.949L24 0V11.4H10.949V1.949ZM0 12.6H9.75V22.051L0 20.699V12.6ZM10.949 12.6H24V24L10.949 22.051V12.6Z" />
          </svg>
        </span>
      );
    }
    
    if (client.platforms.mac) {
      icons.push(
        <span key="mac" className="text-gray-700 dark:text-gray-300" title={t("platformMac")}>
          <svg className="h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
          </svg>
        </span>
      );
    }
    
    if (client.platforms.linux) {
      icons.push(
        <span key="linux" className="text-yellow-600 dark:text-yellow-500" title={t("platformLinux")}>
          <svg className="h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.581 19.049c-.55-.446-.336-1.431-.907-1.917.553-3.365-.997-6.331-2.845-8.232-1.551-1.595-1.051-3.147-1.051-4.49 0-2.146-.881-4.41-3.55-4.41-2.853 0-3.635 2.38-3.663 3.738-.068 3.262.659 4.11-1.25 6.484-2.246 2.793-2.577 5.579-2.07 7.057a2.924 2.924 0 0 1-1.155.835c-1.652.72-.441 1.925-.441 1.925.332.332 5.049 1.137 8.692.21 1.206-.306 3.07-.82 4.34-1.81 1.09-.852-.461-1.306-1.069-1.855-.382-.343-.32-.877-.32-.877 1.508-.648 2.94-1.903 4.321-2.548.969-.449 1.064.446 1.004.798-.407 2.28.413 3.333 2.102 3.072.533-.083 2.54-1.034 1.862-1.98zm-7.691.077c-.665-.755-1.558.424-2.428-.063-1.21-.68-2.935.821-4.803.392-1.469-.337-2.118-1.265-2.03-2.023.109-.921 2.057-.74 3.117-1.342.634-.36.981-1.539 1.305-2.182.753-1.483 3.627-1.32 4.967-.384 1.178.824.665 2.537.437 3.883-.104.612.31 1.296-.565 1.719z"/>
          </svg>
        </span>
      );
    }
    
    if (client.platforms.web) {
      icons.push(
        <span key="web" className="text-green-600 dark:text-green-500" title={t("platformWeb")}>
          <Globe className="h-4 w-4 inline-block" />
        </span>
      );
    }

    if (client.platforms.ios) {
      icons.push(
        <span key="ios" className="text-purple-600 dark:text-purple-500" title={t("platformIos")}>
          <Apple className="h-4 w-4 inline-block" />
        </span>
      );
    }

    if (client.platforms.android) {
      icons.push(
        <span key="android" className="text-red-600 dark:text-red-500" title={t("platformAndroid")}>
          <svg className="h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.0775-9.4396"/>
          </svg>
        </span>
      );
    }
    
    return (
      <div className="flex gap-1.5 my-1.5">
        {icons}
      </div>
    );
  };

  return (
    <div className="cursor-pointer border rounded-xl p-4 bg-white dark:bg-gray-900 hover:shadow-md hover:scale-105 transition-all duration-200 flex flex-col h-full">
      <Link href={{ pathname: '/clients/[id]', params: { id: client.id } }}>
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 mr-3">
            {client.icon ? (
              <Image 
                src={client.icon} 
                alt={client.name} 
                width={48} 
                height={48} 
                className="rounded-full shadow-md hover:scale-105 transition-all duration-200"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                <Monitor className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {client.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {client.author}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
          {client.digest}
        </p>
      </Link>
      
      <div className="mt-auto">
        {getPlatformIcons()}
        
        <div className="flex flex-wrap gap-1 mt-2 mb-3">
          {client.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {client.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{client.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex space-x-2">
            {client.repository && (
              <a
                href={client.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title={t("viewRepository")}
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {client.homepage && (
              <a
                href={client.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title={t("visitHomepage")}
              >
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>
          
          <Button variant="ghost" size="sm" asChild>
            <Link href={{ pathname: '/clients/[id]', params: { id: client.id } }}>
              {t("details")}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 