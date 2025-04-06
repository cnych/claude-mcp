'use client';

import { useTranslations } from 'next-intl';
import { ServerCard } from './ServerCard';
import type { MCPServer } from '@/types/server';

type ServerListProps = {
  servers: MCPServer[];
  isLoading?: boolean;
}

export function ServerList({ servers, isLoading = false }: ServerListProps) {
  const t = useTranslations('Servers');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">{t('noServers')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {servers.map(server => (
        <ServerCard key={server.id} server={server} />
      ))}
    </div>
  );
} 