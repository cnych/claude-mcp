"use client";

import { useTranslations } from "next-intl";
import { ClientCard } from "./ClientCard";
import type { MCPClient } from "@/types/client";

interface ClientListProps {
  clients: MCPClient[];
}

export function ClientList({ clients }: ClientListProps) {
  const t = useTranslations("Clients");

  if (!clients || clients.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-600 dark:text-gray-300">{t("noClients")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
} 