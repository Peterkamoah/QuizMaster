"use client";

import React, { useEffect, useRef } from 'react';

// Declare renderMathInElement and katex from the KaTeX library
declare const renderMathInElement: any;
declare const katex: any;

interface KatexRendererProps {
  content: string;
  className?: string;
}

const KatexRenderer: React.FC<KatexRendererProps> = ({ content, className }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // A more robust check to ensure both the core KaTeX library and the auto-render extension are loaded.
    const katexIsReady = containerRef.current && 
                         typeof renderMathInElement !== 'undefined' &&
                         typeof katex !== 'undefined';
                         
    if (katexIsReady) {
      try {
        renderMathInElement(containerRef.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false, 
        });
      } catch (error) {
        // This catch block is a fallback in case an error still occurs.
        console.error("KaTeX auto-rendering failed:", error);
      }
    }
  }, [content]);

  // We render the raw content into a span with a ref.
  // The useEffect hook will then process this span to render the math.
  return (
    <span ref={containerRef} className={className}>
      {content}
    </span>
  );
};

export default KatexRenderer;
