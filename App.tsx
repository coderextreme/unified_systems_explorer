
import React, { useState } from 'react';
import type { SystemNode } from './types';
import { systemsData } from './constants';
import Sidebar from './components/Sidebar';
import ContentView from './components/ContentView';
import { MenuIcon, XIcon } from './components/Icons';

const App: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SystemNode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const handleNodeSelect = (node: SystemNode) => {
    setSelectedNode(node);
    if (window.innerWidth < 768) { // md breakpoint in tailwind
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg font-sans">
      <div className={`absolute md:static top-0 left-0 h-full z-20 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <Sidebar 
          nodes={systemsData} 
          selectedNode={selectedNode} 
          onNodeSelect={handleNodeSelect} 
        />
      </div>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden p-2 bg-brand-sidebar flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-brand-text">
                {isSidebarOpen ? <XIcon /> : <MenuIcon />}
            </button>
            <h1 className="text-lg font-bold ml-4">Unified Systems Explorer</h1>
        </div>
        <ContentView node={selectedNode} />
      </main>
    </div>
  );
};

export default App;
