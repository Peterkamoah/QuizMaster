"use client";

import React, { useEffect, useState, useMemo } from 'react';

// Declare KaTeX from CDN
declare const katex: any;

interface KatexRendererProps {
  content: string;
  className?: string;
}

const KatexRenderer: React.FC<KatexRendererProps> = ({ content, className }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderedHtml = useMemo(() => {
    if (!isClient || typeof katex === 'undefined' || !content) {
      // Return plain text on server, before katex is loaded, or if content is empty
      return content;
    }

    try {
      // Regex to find KaTeX delimiters ($...$ for inline, $$...$$ for block)
      const regex = /(\$\$[\s\S]*?\$\$|\$.*?\$)/g;
      const parts = content.split(regex);

      return parts
        .map((part, index) => {
          if (index % 2 === 1) { // Every odd part is a math expression
            const isBlock = part.startsWith('$$');
            const math = part.substring(isBlock ? 2 : 1, part.length - (isBlock ? 2 : 1));
            try {
              return katex.renderToString(math, {
                throwOnError: false,
                displayMode: isBlock,
              });
            } catch (error) {
              console.error("KaTeX rendering error for part:", part, error);
              return part; // Fallback to original math string on error
            }
          }
          return part; // Even parts are regular text
        })
        .join('');
    } catch (error) {
      console.error("KaTeX processing error:", error);
      return content; // Fallback to original content on major error
    }
  }, [content, isClient]);
  
  // Render a placeholder on the server and initial client render
  if (!isClient) {
    return <span className={className}>{content}</span>;
  }
  
  return <span className={className} dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
};

export default KatexRenderer;
