"use client";

import { useTranslations } from "next-intl";
import { ClientCard } from "../ClientCard";
import type { MCPClient } from "@/types/client";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type FeaturedClientsProps = {
  clients: MCPClient[];
}

export function FeaturedClients({ clients }: FeaturedClientsProps) {
  const t = useTranslations("Clients");

  if (!clients || clients.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-600 dark:text-gray-300">{t("noClients")}</p>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white dark:bg-gray-900">
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
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/clients">
              {t("viewAll")}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 