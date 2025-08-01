"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Beaker, BarChartHorizontal } from "lucide-react";

export function PlaygroundInspectorSection() {
  const t = useTranslations("Tools");

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* MCP Playground 卡片 */}
          <div className="group cursor-pointer" onClick={() => window.location.href = '/playground'}>
            <div className="overflow-hidden h-full duration-300 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-md hover:scale-105 transition-all group">
              <div className="h-96 overflow-hidden">
                <div className="w-full h-full relative">
                  <img src="https://static.claudemcp.com/images/mcp-playground.jpg" alt={t("playground.title")} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {t("playground.title")}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed line-clamp-2 min-h-[3rem]">
                      {t("playground.description")}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4 w-16 h-16 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 group-hover:scale-110 transition-transform duration-300 ease-in-out">
                    <Beaker className="w-8 h-8" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                    {t("openPlayground")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* MCP Inspector 卡片 */}
          <div className="group cursor-pointer" onClick={() => window.location.href = '/inspector'}>
            <div className="overflow-hidden h-full duration-300 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-md hover:scale-105 transition-all group">
              <div className="h-96 overflow-hidden">
                <div className="w-full h-full relative">
                  <img src="https://static.claudemcp.com/images/mcp-inspector.jpg" alt={t("inspector.title")} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {t("inspector.title")}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed line-clamp-2 min-h-[3rem]">
                      {t("inspector.description")}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4 w-16 h-16 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 group-hover:scale-110 transition-transform duration-300 ease-in-out">
                    <BarChartHorizontal className="w-8 h-8" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                    {t("openInspector")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 