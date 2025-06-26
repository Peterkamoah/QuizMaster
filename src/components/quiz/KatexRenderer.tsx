
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

    if (typeof katex !== 'undefined') {
      setIsKatexLoaded(true);
      return;
    }

    const interval = setInterval(() => {
      if (typeof katex !== 'undefined') {
        setIsKatexLoaded(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const renderedContent = useMemo(() => {
    if (!isMounted || !isKatexLoaded) {
      return <>{content}</>;
    }

    try {
      const regex = /(\$\$[\s\S]*?\$\$|\$.*?\$)/g;
      const parts = content.split(regex);

      return parts.map((part, index) => {
        if (part.match(regex)) {
          const isDisplay = part.startsWith('$$');
          const tex = part.slice(isDisplay ? 2 : 1, isDisplay ? -2 : -1);
          
          const html = katex.renderToString(tex, {
            throwOnError: false,
            displayMode: isDisplay,
          });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        
        return <span key={index}>{part}</span>;
      });
    } catch (e) {
      console.error('KaTeX rendering error:', e);
      return <>{content}</>;
    }
  }, [content, isMounted, isKatexLoaded]);

  return <div className={cn(className)}>{renderedContent}</div>;
};

export default KatexRenderer;
