
import React, { useState } from 'react';
import type { SystemNode } from '../types';
import { NodeType } from '../types';
import { DomainIcon, SystemIcon, ConceptIcon, ModelIcon, ToolIcon, ChevronRightIcon, ChevronDownIcon } from './Icons';

interface SidebarProps {
  nodes: SystemNode[];
  selectedNode: SystemNode | null;
  onNodeSelect: (node: SystemNode) => void;
}

const getNodeIcon = (type: NodeType) => {
  switch (type) {
    case NodeType.DOMAIN:
      return <DomainIcon />;
    case NodeType.SYSTEM:
      return <SystemIcon />;
    case NodeType.CONCEPT:
      return <ConceptIcon />;
    case NodeType.MODEL:
      return <ModelIcon />;
    case NodeType.TOOL:
      return <ToolIcon />;
    default:
      return null;
  }
};

const TreeNode: React.FC<{ node: SystemNode; selectedNode: SystemNode | null; onNodeSelect: (node: SystemNode) => void; }> = ({ node, selectedNode, onNodeSelect }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.children && node.children.length > 0;
  const isSelected = selectedNode?.id === node.id;

  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
  };
  
  const handleSelect = () => {
    onNodeSelect(node);
  }

  return (
    <div className="my-1">
      <div
        className={`flex items-center p-2 rounded-md cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-brand-accent text-white' : 'hover:bg-brand-content'}`}
        onClick={handleSelect}
      >
        <div onClick={(e) => { e.stopPropagation(); handleToggle(); }} className="w-6 h-6 flex items-center justify-center">
            {isFolder ? (isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />) : <div className="w-6"></div>}
        </div>
        <div className="mr-2">{getNodeIcon(node.type)}</div>
        <span className="flex-1 truncate">{node.name}</span>
      </div>
      {isOpen && isFolder && (
        <div className="pl-6 border-l border-gray-700 ml-3">
          {node.children?.map((child) => (
            <TreeNode key={child.id} node={child} selectedNode={selectedNode} onNodeSelect={onNodeSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ nodes, selectedNode, onNodeSelect }) => {
  return (
    <div className="w-80 h-full bg-brand-sidebar text-brand-text-muted p-4 overflow-y-auto flex flex-col">
       <div className="text-2xl font-bold text-white mb-6 px-2">
         Explorer
       </div>
      <nav className="flex-1">
        {nodes.map((node) => (
          <TreeNode key={node.id} node={node} selectedNode={selectedNode} onNodeSelect={onNodeSelect} />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
