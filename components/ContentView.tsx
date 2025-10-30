
import React from 'react';
import type { SystemNode } from '../types';
import NodeDetail from './NodeDetail';
import DiagramView from './DiagramView';
import { InfoIcon, PlusIcon, PencilIcon, TrashIcon } from './Icons';

interface ContentViewProps {
  node: SystemNode | null;
  onNodeSelect: (node: SystemNode) => void;
  onNodeAdd: () => void;
  onNodeUpdate: (nodeId: string, updates: Partial<SystemNode>) => void;
  onNodeDelete: (nodeId: string) => void;
}

const WelcomeScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-brand-text-muted p-8">
    <div className="max-w-2xl">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Welcome to the Unified Systems Explorer</h1>
      <p className="text-lg mb-6">
        This is an advanced, interactive interface for exploring and building systems. Select a node from the sidebar to begin, or use the hover actions to create, rename, or delete nodes.
      </p>
      <div className="bg-brand-sidebar p-6 rounded-lg text-left flex items-start">
        <div className="text-brand-accent mr-4 mt-1"><InfoIcon /></div>
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">How it works:</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Select an item to view its contents.</li>
            <li>If an item is a "folder", you'll see a diagram of its children here. You can drag them around!</li>
            <li>If it's a "file" (no children), we'll generate a detailed analysis using the Gemini API.</li>
            <li>Use the <PlusIcon /> <PencilIcon /> <TrashIcon /> icons to manage your system hierarchy.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);


const ContentView: React.FC<ContentViewProps> = (props) => {
  const { node } = props;

  // Render welcome screen if no node is selected
  if (!node) {
    return (
      <div className="flex-1 bg-brand-bg p-4 md:p-8 overflow-y-auto">
        <WelcomeScreen />
      </div>
    );
  }

  // Check if node is a "folder" (has children array, even if empty) vs a "file" (no children property)
  const isFolder = node.children !== undefined;

  return (
    <div className="flex-1 flex flex-col bg-brand-bg p-4 md:p-8 overflow-hidden">
      {isFolder ? (
        <DiagramView {...props} />
      ) : (
        <div className="overflow-y-auto h-full">
            <NodeDetail node={node} />
        </div>
      )}
    </div>
  );
};

export default ContentView;
