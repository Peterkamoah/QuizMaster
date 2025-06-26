
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

declare const katex: any;

interface KatexRendererProps {
  content: string;
  className?: string;
}

const KatexRenderer: React.FC<KatexRendererProps> = ({ content, className }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isKatexLoaded, setIsKatexLoaded] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // A more robust check to see if KaTeX is fully initialized.
    // The previous error indicated that `katex.ParseError` was undefined, so we'll wait for it.
    if (typeof katex !== 'undefined' && katex.ParseError) {
      setIsKatexLoaded(true);
      return;
    }

    // If not loaded, poll every 100ms until it is.
    const interval = setInterval(() => {
      if (typeof katex !== 'undefined' && katex.ParseError) {
        setIsKatexLoaded(true);
        clearInterval(interval);
      }
    }, 100);

    // Cleanup on unmount.
    return () => clearInterval(interval);
  }, []);

  const renderedContent = useMemo(() => {
    // Don't render on the server or if KaTeX isn't fully loaded.
    // Return a React Fragment to ensure a valid return type.
    if (!isMounted || !isKatexLoaded) {
      return <>{content}</>;
    }

    try {
      // Regex to find all math expressions, enclosed in $...$ or $$...$$
      const regex = /(\$\$[\s\S]*?\$\$|\$.*?\$)/g;
      const parts = content.split(regex);

      // Map over the parts, rendering math expressions with KaTeX
      return parts.map((part, index) => {
        if (part.match(regex)) {
          const isDisplay = part.startsWith('$$');
          // Extract the raw TeX from between the delimiters
          const tex = part.slice(isDisplay ? 2 : 1, isDisplay ? -2 : -1);
          
          const html = katex.renderToString(tex, {
            throwOnError: false, // Prevents crashing on invalid TeX
            displayMode: isDisplay,
          });

          // Render the HTML string from KaTeX
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        
        // Return non-math parts as plain text
        return <span key={index}>{part}</span>;
      });
    } catch (e) {
      console.error('KaTeX rendering error:', e);
      // Fallback to raw content on error
      return <>{content}</>;
    }
  }, [content, isMounted, isKatexLoaded]);

  return <div className={cn(className)}>{renderedContent}</div>;
};

export default KatexRenderer;
