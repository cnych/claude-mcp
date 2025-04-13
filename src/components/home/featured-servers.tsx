"use client";

import { useTranslations } from "next-intl";
import { ServerCard } from "../ServerCard";
import type { MCPServer } from "@/types/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type FeaturedServersProps = {
  servers: MCPServer[];
}

export function FeaturedServers({ servers }: FeaturedServersProps) {
  const t = useTranslations("Servers");

  if (!servers || servers.length === 0) {
    return (
      <></>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/servers">
              {t("viewAll")}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
