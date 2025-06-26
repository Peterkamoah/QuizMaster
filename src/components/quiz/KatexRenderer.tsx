"use client";

import React, { useEffect, useRef } from 'react';

// Declare renderMathInElement from the KaTeX auto-render extension
declare const renderMathInElement: any;

interface KatexRendererProps {
  content: string;
  className?: string;
}

const KatexRenderer: React.FC<KatexRendererProps> = ({ content, className }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check if the container exists and the KaTeX auto-render script is loaded
    if (containerRef.current && typeof renderMathInElement !== 'undefined') {
      try {
        // This function will find and render all math in the container element
        renderMathInElement(containerRef.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false, // Don't throw errors on invalid math
        });
      } catch (error) {
        console.error("KaTeX auto-rendering failed:", error);
      }
    }
  }, [content]); // Re-run the effect if the content prop changes

  // We render the raw content into a span with a ref.
  // The useEffect hook will then process this span to render the math.
  return (
    <span ref={containerRef} className={className}>
      {content}
    </span>
  );
};

export default KatexRenderer;
