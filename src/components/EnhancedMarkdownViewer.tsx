import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

const EnhancedMarkdownViewer = ({ content }) => {
  // Function to process HTML content and add proper heading classes
  const processContent = (rawContent) => {
    if (!rawContent) return '';

    // Create a temporary div to parse HTML
    const div = document.createElement('div');
    div.innerHTML = DOMPurify.sanitize(rawContent);

    // Add classes to headings
    const headings = {
      h1: 'text-4xl font-bold mb-6',
      h2: 'text-3xl font-bold mb-5',
      h3: 'text-2xl font-bold mb-4',
      h4: 'text-xl font-bold mb-3',
      h5: 'text-lg font-bold mb-3',
      h6: 'text-base font-bold mb-2'
    };

    // Process each heading type
    Object.entries(headings).forEach(([tag, classes]) => {
      div.querySelectorAll(tag).forEach(heading => {
        heading.className = classes;
      });
    });

    // Add classes to other elements
    div.querySelectorAll('p').forEach(p => {
      p.className = 'mb-4 text-base leading-relaxed';
    });

    div.querySelectorAll('ul').forEach(ul => {
      ul.className = 'list-disc ml-6 mb-4';
    });

    div.querySelectorAll('ol').forEach(ol => {
      ol.className = 'list-decimal ml-6 mb-4';
    });

    div.querySelectorAll('li').forEach(li => {
      li.className = 'mb-2';
    });

    div.querySelectorAll('blockquote').forEach(quote => {
      quote.className = 'border-l-4 border-gray-300 pl-4 my-4 italic';
    });

    div.querySelectorAll('img').forEach(img => {
      // Preserve base64 src while adding styling
      img.className = 'max-w-full h-auto rounded-lg my-4';
    });

    div.querySelectorAll('a').forEach(link => {
      link.className = 'text-blue-600 hover:text-blue-800 underline';
      if (link.href?.startsWith('http')) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });

    return div.innerHTML;
  };

  // Process the content with memoization
  const processedContent = useMemo(() => processContent(content), [content]);

  return (
    <div 
      className="w-full max-w-none"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default EnhancedMarkdownViewer;