'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PlusCircle } from 'lucide-react';

export function SubmitServerButton() {
  const t = useTranslations('Servers');
  
  const handleSubmit = () => {
    // 跳转到 GitHub 新建 PR 的页面，引导用户提交新服务器
    window.open('https://github.com/cnych/claude-mcp/pulls', '_blank');
    
    // 另一种方案是直接跳转到提交单个服务器的页面
    // 如：window.open('https://github.com/modelcontextprotocol/servers/new/main/servers/' + locale, '_blank');
  };
  
  return (
    <button
      onClick={handleSubmit}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
      title="Fork the repository to submit your MCP server"
    >
      <PlusCircle className="h-4 w-4" />
      <span>{t('submitServer')}</span>
    </button>
  );
} 