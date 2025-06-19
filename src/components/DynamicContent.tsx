'use client'

import React, { useState, useEffect } from 'react';

interface DynamicContentProps {
  children: React.ReactNode;
}

export default function DynamicContent({ children }: DynamicContentProps) {
  const [bannerClosed, setBannerClosed] = useState(false);

  useEffect(() => {
    // 监听Banner关闭事件
    const handleBannerClosed = () => {
      setBannerClosed(true);
    };

    window.addEventListener('bannerClosed', handleBannerClosed);

    return () => {
      window.removeEventListener('bannerClosed', handleBannerClosed);
    };
  }, []);

  return (
    <main className={`min-h-screen transition-all duration-300 ${bannerClosed ? 'pt-16' : 'pt-28'}`}>
      {children}
    </main>
  );
} 