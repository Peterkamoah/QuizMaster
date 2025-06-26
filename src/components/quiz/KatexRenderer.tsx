"use client";

import React, { useEffect, useState } from 'react';

// Declare KaTeX from CDN
declare const katex: any;

interface KatexRendererProps {
  content: string;
  className?: string;
}

const KatexRenderer: React.FC<KatexRendererProps> = ({ content, className }) => {
  // We use state to store the rendered HTML. Initially, it's the raw content.
  // This ensures the server-rendered output and the initial client render match.
  const [renderedHtml, setRenderedHtml] = useState(content);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    // By this time, the KaTeX script should be loaded.
    if (typeof katex !== 'undefined' && content) {
      try {
        // Regex to find KaTeX delimiters ($...$ for inline, $$...$$ for block)
        // We replace each found delimiter with its HTML-rendered version.
        const html = content.replace(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g, (match) => {
          const isBlock = match.startsWith('$$');
          const math = match.substring(isBlock ? 2 : 1, match.length - (isBlock ? 2 : 1));
          try {
            return katex.renderToString(math, {
              throwOnError: false,
              displayMode: isBlock,
            });
          } catch (error) {
            console.error("KaTeX rendering error for part:", match, error);
            return match; // Fallback to original math string on error
          }
        });
        setRenderedHtml(html);
      } catch (error) {
        console.error("KaTeX processing error:", error);
        setRenderedHtml(content); // Fallback to original content on major error
      }
    } else {
      // If katex is not available or content is empty, ensure we display the raw content.
      setRenderedHtml(content);
    }
  }, [content]);

  // The key forces a re-mount when content changes, which is useful for dangerouslySetInnerHTML
  return <span key={content} className={className} dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
};

export default KatexRenderer;
