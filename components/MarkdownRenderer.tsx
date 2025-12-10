import React from 'react';

interface Props {
  content: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="text-sm leading-relaxed space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Code block
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const codeContent = match ? match[2] : part.slice(3, -3);
          return (
            <div key={index} className="bg-brand-dark/10 rounded-md p-3 my-2 overflow-x-auto border border-brand-dark/20">
              <pre className="font-mono text-xs text-brand-dark">
                {codeContent}
              </pre>
            </div>
          );
        }

        // Regular text processing
        // Handle bolding (**text**) and newlines
        const lines = part.split('\n');
        return (
          <div key={index}>
            {lines.map((line, lineIdx) => {
              if (line.trim() === '') return <div key={lineIdx} className="h-2" />;

              // Check for bullet points
              const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
              const cleanLine = isBullet ? line.trim().substring(2) : line;

              // Process bold text
              const segments = cleanLine.split(/(\*\*.*?\*\*)/g);

              return (
                <div key={lineIdx} className={`${isBullet ? 'ml-4 flex items-start' : ''} mb-1`}>
                  {isBullet && <span className="mr-2 text-brand-dark">•</span>}
                  <span className={isBullet ? 'flex-1' : ''}>
                    {segments.map((segment, segIdx) => {
                      if (segment.startsWith('**') && segment.endsWith('**')) {
                        return <strong key={segIdx} className="font-bold text-brand-dark/90">{segment.slice(2, -2)}</strong>;
                      }
                      return <span key={segIdx}>{segment}</span>;
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;