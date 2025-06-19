'use client'

import React, { useState } from 'react';

const Banner = (): JSX.Element | null => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // 处理关闭按钮点击事件
  const handleDismiss = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 阻止事件冒泡，防止触发父元素的点击事件
    e.stopPropagation();
    setIsVisible(false);
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new CustomEvent('bannerClosed'));
  };

  // 如果横幅不可见，则不渲染任何内容
  if (!isVisible) {
    return null;
  }

  // 处理整个横幅的点击事件
  const handleClickBanner = () => {
    const url = "https://www.asmr.so/?utm_source=claudemcp";
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 处理整个横幅的键盘事件 (Enter 或 Space 键)
  const handleKeyDownBanner = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClickBanner();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClickBanner}
      onKeyDown={handleKeyDownBanner}
      aria-label="Sponsored by ShipAny.ai - Ship Your AI Startup in hours"
      className="fixed top-0 left-0 right-0 z-[99] isolate flex cursor-pointer items-center gap-x-6 overflow-hidden border-b border-gray-800 bg-[#1C1C1C] px-6 py-3 hover:bg-[#2C2C2C] sm:px-3.5 sm:before:flex-1"
    >
      {/* 背景模糊效果 - 装饰性元素 */}
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#4285f4] to-[#34a853] opacity-20"
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#4285f4] to-[#34a853] opacity-20"
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-gray-200">
          <span className="text-gray-300">Sponsored by</span>
          <span className="ml-2 text-pink-400 font-medium">ASMR.so</span>
          <span className="mx-2 text-gray-300">,</span>
          <span className="text-gray-200">AI ASMR Videos with VEO3 AI.</span>
          {/* 箭头图标 */}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="hidden ml-2 sm:inline-block h-5 w-5 rounded-full bg-pink-500 text-white transition-transform duration-200 group-hover:scale-110" 
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor" 
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
        </p>
      </div>

      {/* 关闭按钮区域 */}
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          onClick={handleDismiss}
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
          aria-label="关闭横幅"
        >
          <span className="sr-only">关闭横幅</span>
          {/* 关闭图标 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x h-5 w-5 text-gray-400 hover:text-gray-200"
            aria-hidden="true"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Banner;
