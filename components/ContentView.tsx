
import React from 'react';
import type { SystemNode } from '../types';
import NodeDetail from './NodeDetail';
import { InfoIcon } from './Icons';

interface ContentViewProps {
  node: SystemNode | null;
}

const WelcomeScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-brand-text-muted p-8">
    <div className="max-w-2xl">
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Unified Systems Explorer</h1>
      <p className="text-lg mb-6">
        This is an advanced interface for exploring concepts in Systems Science, Product Management, Digital Environments, and more.
      </p>
      <div className="bg-brand-sidebar p-6 rounded-lg text-left flex items-start">
        <div className="text-brand-accent mr-4 mt-1"><InfoIcon /></div>
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">How it works:</h2>
          <p>
            Select a node from the navigation panel on the left. The system will use the Gemini API to generate a detailed, expert-level analysis of the chosen concept, providing insights into its definition, implementation, and connections within the broader system.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ContentView: React.FC<ContentViewProps> = ({ node }) => {
  return (
    <div className="flex-1 bg-brand-bg p-4 md:p-8 overflow-y-auto">
      {node ? <NodeDetail node={node} /> : <WelcomeScreen />}
    </div>
  );
};

export default ContentView;
