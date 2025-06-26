"use client";

import React, { useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

// Declare katex from the KaTeX library loaded in layout.tsx
declare const katex: any;

interface KatexRendererProps {
  content: string;
  className?: string;
}

const KatexRenderer: React.FC<KatexRendererProps> = ({ content, className }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  // Ensure component is mounted on the client to avoid hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderedContent = useMemo(() => {
    // Don't try to render on the server or if katex isn't loaded yet.
    if (!isMounted || typeof katex === 'undefined') {
      return content;
    }

    // Regex to find all instances of $...$ (inline) or $$...$$ (display)
    const regex = /(\$\$[\s\S]*?\$\$|\$.*?\$)/g;
    const parts = content.split(regex);

    return parts.map((part, index) => {
      // Every second part is a LaTeX expression
      if (part.match(regex)) {
        const isDisplay = part.startsWith('$$');
        // Remove the delimiters ($$ or $)
        const tex = part.slice(isDisplay ? 2 : 1, isDisplay ? -2 : -1);
        
        try {
          const html = katex.renderToString(tex, {
            throwOnError: false,
            displayMode: isDisplay,
          });
          // Render the HTML using dangerouslySetInnerHTML
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (e) {
          console.error('KaTeX rendering error:', e);
          // If rendering fails, show the original part
          return <span key={index}>{part}</span>;
        }
      }
      
      // This is a plain text part
      return <span key={index}>{part}</span>;
    });
  }, [content, isMounted]);

  // Use a div with "inline" to act like a span but allow block elements from display math
  return <div className={cn("inline", className)}>{renderedContent}</div>;
};

export default KatexRenderer;
