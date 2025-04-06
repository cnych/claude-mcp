'use client'

import mermaid from 'mermaid'
import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface MermaidProps {
  chart: string
  className?: string
  mermaidKey?: string
}

// 生成唯一ID，不依赖外部库
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function Mermaid({ chart, className, mermaidKey = 'mermaid' }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (containerRef.current) {
      const isDark = theme === 'dark'
      mermaid.initialize({
        startOnLoad: true,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'loose',
        themeVariables: {
          fontFamily: 'inherit',
          primaryColor: isDark ? '#2563eb' : '#1d4ed8',
          primaryTextColor: isDark ? '#fff' : '#000',
          primaryBorderColor: isDark ? '#60a5fa' : '#3b82f6',
          lineColor: isDark ? '#60a5fa' : '#3b82f6',
          secondaryColor: isDark ? '#1e293b' : '#f1f5f9',
          tertiaryColor: isDark ? '#0f172a' : '#e2e8f0',
          noteTextColor: isDark ? '#fff' : '#000',
          noteBkgColor: isDark ? '#1e293b' : '#f1f5f9',
          noteBorderColor: isDark ? '#60a5fa' : '#3b82f6',
          actorTextColor: isDark ? '#fff' : '#000',
          actorBorder: isDark ? '#60a5fa' : '#3b82f6',
          actorBkg: isDark ? '#1e293b' : '#f1f5f9',
          activationBorderColor: isDark ? '#60a5fa' : '#3b82f6',
          activationBkgColor: isDark ? '#1e293b' : '#f1f5f9',
          sequenceNumberColor: isDark ? '#fff' : '#000',
          labelTextColor: isDark ? '#fff' : '#000',
          labelBoxBkgColor: isDark ? '#1e293b' : '#f1f5f9',
          labelBoxBorderColor: isDark ? '#60a5fa' : '#3b82f6',
          signalColor: isDark ? '#fff' : '#000',
          signalTextColor: isDark ? '#fff' : '#000',
        },
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          padding: 15,
          nodeSpacing: 50,
          rankSpacing: 50,
          diagramPadding: 8,
        },
        sequence: {
          diagramMarginX: 50,
          diagramMarginY: 10,
          actorMargin: 100,
          width: 150,
          height: 65,
          boxMargin: 10,
          boxTextMargin: 5,
          noteMargin: 10,
          messageMargin: 35,
          mirrorActors: false,
          bottomMarginAdj: 1,
          useMaxWidth: true,
          rightAngles: false,
          showSequenceNumbers: false,
          actorFontSize: 14,
          actorFontWeight: 400,
          noteFontSize: 14,
          messageFontSize: 14,
          wrap: false,
          wrapPadding: 10,
        },
      })

      const uniqueId = `mermaid-${mermaidKey}-${generateId()}`
      mermaid.render(uniqueId, chart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
          // 添加自定义样式
          const svgElement = containerRef.current.querySelector('svg')
          if (svgElement) {
            svgElement.style.maxWidth = '100%'
            svgElement.style.height = 'auto'
            // 优化子图样式
            const clusters = svgElement.querySelectorAll('.cluster')
            clusters.forEach((cluster) => {
              const rect = cluster.querySelector('rect')
              if (rect) {
                rect.setAttribute('rx', '8') // 圆角
                rect.setAttribute('ry', '8')
                rect.setAttribute('fill', isDark ? '#1e293b' : '#f1f5f9') // 根据主题设置背景
                rect.setAttribute('stroke', isDark ? '#60a5fa' : '#3b82f6') // 根据主题设置边框
                rect.setAttribute('stroke-width', '1')
              }
            })
            // 优化节点样式
            const nodes = svgElement.querySelectorAll('.node')
            nodes.forEach((node) => {
              const rect = node.querySelector('rect')
              if (rect) {
                rect.setAttribute('rx', '6')
                rect.setAttribute('ry', '6')
                rect.setAttribute('fill', isDark ? '#2563eb' : '#1d4ed8')
                rect.setAttribute('stroke', isDark ? '#60a5fa' : '#3b82f6')
                rect.setAttribute('stroke-width', '1')
              }
            })
          }
        }
      })
    }
  }, [chart, mermaidKey, theme])

  return (
    <div
      ref={containerRef}
      className={`overflow-x-auto rounded-lg ${className || ''}`}
    />
  )
}
