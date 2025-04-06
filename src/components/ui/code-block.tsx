"use client"

import * as React from "react"
import { Highlight, themes } from "prism-react-renderer"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({
  code,
  language = "typescript",
  className,
}: CodeBlockProps) {
  return (
    <Highlight
      theme={themes.oneDark}
      code={code}
      language={language}
    >
      {({ className: preClassName, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            preClassName,
            className,
            "overflow-x-auto p-6 text-sm rounded-xl",
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20",
            "glass-effect"
          )}
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
} 