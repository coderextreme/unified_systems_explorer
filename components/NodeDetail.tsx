
import React, { useState, useEffect } from 'react';
import type { SystemNode } from '../types';
import { generateNodeDetails } from '../services/geminiService';

interface NodeDetailProps {
  node: SystemNode;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-brand-text-muted">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-accent mb-4"></div>
        <p className="text-lg">Generating insights with Gemini...</p>
        <p className="text-sm">This may take a moment.</p>
    </div>
);

const NodeDetail: React.FC<NodeDetailProps> = ({ node }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setContent('');
      try {
        const generatedContent = await generateNodeDetails(node);
        setContent(generatedContent);
      } catch (error) {
        setContent('Failed to load content. Please check the console.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [node]);

  return (
    <div className="h-full">
      <div className="pb-4 border-b-2 border-brand-content mb-6">
        <h1 className="text-4xl font-bold text-white">{node.name}</h1>
        <p className="text-lg text-brand-text-muted mt-2">{node.description}</p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div 
            className="prose prose-invert prose-lg max-w-none text-brand-text prose-headings:text-white prose-strong:text-brand-accent prose-a:text-brand-accent prose-code:text-yellow-300 prose-blockquote:border-brand-accent"
            style={{ whiteSpace: 'pre-wrap' }}
        >
            {content.split('\n').map((line, index) => {
                // Basic markdown-like rendering for headings and lists
                if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-2xl font-bold mt-6 mb-2">{line.substring(4)}</h3>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-3xl font-bold mt-8 mb-3 border-b border-gray-600 pb-2">{line.substring(3)}</h2>;
                }
                if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
                    return <p key={index} className="ml-4">{line}</p>;
                }
                if (line.startsWith('* ') || line.startsWith('- ')) {
                    return <li key={index} className="ml-8 list-disc">{line.substring(2)}</li>;
                }
                 if (line.trim() === '---') {
                    return <hr key={index} className="my-6 border-gray-600" />;
                }
                return <p key={index}>{line}</p>;
            })}
        </div>
      )}
    </div>
  );
};

export default NodeDetail;
