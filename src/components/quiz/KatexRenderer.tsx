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
    if (!isClient || typeof katex === 'undefined') {
      // Return plain text on server or before katex is loaded
      return content;
    }

    try {
      // Regex to find KaTeX delimiters
      const regex = /(\$\$[\s\S]*?\$\$|\$.*?[^`\s]\$)/g;
      const parts = content.split(regex);

      return parts.map((part, index) => {
        if (part.match(regex)) {
          const isBlock = part.startsWith('$$');
          const math = part.substring(isBlock ? 2 : 1, part.length - (isBlock ? 2 : 1));
          return katex.renderToString(math, {
            throwOnError: false,
            displayMode: isBlock,
          });
        }
        return part;
      }).join('');
    } catch (error) {
      console.error("KaTeX rendering error:", error);
      return content; // Fallback to original content on error
    }
  }, [content, isClient]);
  
  // Render a placeholder on the server and initial client render
  if (!isClient) {
    return <span className={className}>{content}</span>;
  }
  
  return <span className={className} dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
};

export default KatexRenderer;
