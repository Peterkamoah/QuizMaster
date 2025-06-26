
"use client";

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { cn } from '@/lib/utils';

interface KatexRendererProps {
  content: string;
  className?: string;
}

const KatexRenderer: React.FC<KatexRendererProps> = ({ content = '', className }) => {
  // Regular expression to find all occurrences of $...$ or $$...$$
  // It captures the delimiter ($ or $$) and the content separately.
  const mathRegex = /(\${1,2})((?:.|\n)+?)\1/g;

  // If content is not a string, default to an empty string to prevent errors.
  const parts = String(content).split(mathRegex);

  return (
    <div className={cn(className)}>
      {parts.map((part, index) => {
        // The parts array will be structured like: [text, delimiter, math, text, delimiter, math, ...]
        
        // Math content is at index 2, 5, 8, etc.
        if (index % 3 === 2) {
          // The delimiter is the part before the math content
          const isBlock = parts[index - 1] === '$$';
          
          if (isBlock) {
            return <BlockMath key={index}>{part}</BlockMath>;
          }
          return <InlineMath key={index}>{part}</InlineMath>;
        } 
        
        // Regular text is at index 0, 3, 6, etc.
        else if (index % 3 === 0) {
          return <span key={index}>{part}</span>;
        }
        
        // Delimiters are at index 1, 4, 7, etc., and should be ignored.
        return null;
      })}
    </div>
  );
};

export default KatexRenderer;
