
import React, { useState, useRef, useEffect } from 'react';
import type { SystemNode } from '../types';
import { NodeType } from '../types';
import { DomainIcon, SystemIcon, ConceptIcon, ModelIcon, ToolIcon, ChevronRightIcon, ChevronDownIcon, PlusIcon, PencilIcon, TrashIcon, XIcon } from './Icons';

interface SidebarProps {
  nodes: SystemNode[];
  selectedNode: SystemNode | null;
  onNodeSelect: (node: SystemNode) => void;
  onNodeAdd: (parentId: string | null) => void;
  onNodeUpdate: (nodeId: string, updates: Partial<SystemNode>) => void;
  onNodeDelete: (nodeId: string) => void;
  onClose?: () => void;
}

const getNodeIcon = (type: NodeType) => {
  switch (type) {
    case NodeType.DOMAIN: return <DomainIcon />;
    case NodeType.SYSTEM: return <SystemIcon />;
    case NodeType.CONCEPT: return <ConceptIcon />;
    case NodeType.MODEL: return <ModelIcon />;
    case NodeType.TOOL: return <ToolIcon />;
    default: return null;
  }
};

const TreeNode: React.FC<{ 
    node: SystemNode; 
    selectedNode: SystemNode | null; 
    onNodeSelect: (node: SystemNode) => void; 
    onNodeAdd: (parentId: string) => void;
    onNodeUpdate: (nodeId: string, updates: Partial<SystemNode>) => void;
    onNodeDelete: (nodeId: string) => void;
}> = ({ node, selectedNode, onNodeSelect, onNodeAdd, onNodeUpdate, onNodeDelete }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [name, setName] = useState(node.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFolder = node.children && node.children.length > 0;
  const isSelected = selectedNode?.id === node.id;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  useEffect(() => {
    setName(node.name);
  }, [node.name]);

  const handleToggle = () => isFolder && setIsOpen(!isOpen);
  const handleSelect = () => !isEditing && onNodeSelect(node);
  const handleRename = () => {
    if (name.trim()) {
      onNodeUpdate(node.id, { name: name.trim() });
    } else {
        setName(node.name); // revert if empty
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleRename();
      if (e.key === 'Escape') {
          setName(node.name);
          setIsEditing(false);
      }
  }

  return (
    <div className="my-1 text-sm">
      <div
        className={`flex items-center p-2 rounded-md group transition-colors duration-200 ${isSelected ? 'bg-brand-accent text-white' : 'hover:bg-brand-content'}`}
        onClick={handleSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div onClick={(e) => { e.stopPropagation(); handleToggle(); }} className="w-6 h-6 flex items-center justify-center cursor-pointer">
            {isFolder ? (isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />) : <div className="w-6"></div>}
        </div>
        <div className="mr-2">{getNodeIcon(node.type)}</div>
        {isEditing ? (
            <input 
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 text-white flex-1 p-0 m-0 border-0 focus:ring-0"
            />
        ) : (
            <span className="flex-1 truncate cursor-pointer">{node.name}</span>
        )}
        {(isHovered || isSelected) && !isEditing && (
            <div className="flex items-center space-x-1 ml-2">
                <button onClick={(e) => {e.stopPropagation(); onNodeAdd(node.id)}} className="p-1 rounded hover:bg-white/20"><PlusIcon /></button>
                <button onClick={(e) => {e.stopPropagation(); setIsEditing(true)}} className="p-1 rounded hover:bg-white/20"><PencilIcon /></button>
                <button onClick={(e) => {e.stopPropagation(); onNodeDelete(node.id)}} className="p-1 rounded hover:bg-white/20"><TrashIcon /></button>
            </div>
        )}
      </div>
      {isOpen && node.children && (
        <div className="pl-6 border-l border-gray-700 ml-3">
          {node.children.map((child) => (
            <TreeNode key={child.id} {...{node: child, selectedNode, onNodeSelect, onNodeAdd, onNodeUpdate, onNodeDelete}} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ nodes, selectedNode, onNodeSelect, onNodeAdd, onNodeUpdate, onNodeDelete, onClose }) => {
  return (
    <div className="w-screen sm:w-80 h-full bg-brand-sidebar text-brand-text-muted p-4 overflow-y-auto flex flex-col">
       <div className="text-2xl font-bold text-white mb-6 px-2 flex justify-between items-center">
         <span>Explorer</span>
         <div className="flex items-center">
            <button onClick={() => onNodeAdd(null)} className="p-2 rounded-full hover:bg-brand-content" title="Add Root Node"><PlusIcon /></button>
            {onClose && (
                <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-content md:hidden ml-2" title="Close Menu">
                    <XIcon />
                </button>
            )}
         </div>
       </div>
      <nav className="flex-1">
        {nodes.map((node) => (
          <TreeNode key={node.id} {...{node, selectedNode, onNodeSelect, onNodeAdd, onNodeUpdate, onNodeDelete}} />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
