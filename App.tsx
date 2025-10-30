
import React, { useState, useCallback } from 'react';
import type { SystemNode } from './types';
import { NodeType } from './types';
import Sidebar from './components/Sidebar';
import ContentView from './components/ContentView';
import { MenuIcon, XIcon } from './components/Icons';

const initialSystemsData: SystemNode[] = [
  {
    id: '1',
    name: 'Systems Science',
    type: NodeType.DOMAIN,
    description: 'The interdisciplinary study of systems.',
    children: [
      {
        id: '1-1',
        name: 'Information Modeling',
        type: NodeType.SYSTEM,
        description: 'Represents information structures in a formal way.',
        children: [
          { id: '1-1-1', name: 'Entity-Relationship Model', type: NodeType.MODEL, description: 'A data model for describing the data or information aspects of a business domain.' },
          { id: '1-1-2', name: 'Semantic Networks', type: NodeType.MODEL, description: 'A knowledge base that represents semantic relations between concepts.' },
          { id: '1-1-3', name: 'Mind Maps', type: NodeType.TOOL, description: 'A diagram used to visually organize information.' },
        ],
      },
      {
        id: '1-2',
        name: 'Product Lifecycle Management',
        type: NodeType.SYSTEM,
        description: 'The process of managing the entire lifecycle of a product.',
        children: [
          { id: '1-2-1', name: 'Product Filtering', type: NodeType.CONCEPT, description: 'Allowing users to narrow down product searches based on specific criteria.' },
          { id: '1-2-2', name: 'Product Configuration', type: NodeType.CONCEPT, description: 'The process of customizing a product to meet specific customer requirements.' },
          { id: '1-2-3', name: 'Inventory Management', type: NodeType.CONCEPT, description: 'Supervising non-capitalized assets (inventory) and stock items.' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Digital Environments',
    type: NodeType.DOMAIN,
    description: 'Virtual and interactive spaces.',
    children: [
      {
        id: '2-1',
        name: '3D/4D Interfaces',
        type: NodeType.SYSTEM,
        description: 'Interfaces that operate in three spatial dimensions plus time.',
        children: [
          { id: '2-1-1', name: '3D Skeleton Animation', type: NodeType.MODEL, description: 'A technique in computer animation in which a character is represented in two parts: a surface representation and a hierarchical set of interconnected parts.' },
          { id: '2-1-2', name: 'Time Series Visualization', type: NodeType.CONCEPT, description: 'Displaying data points in successive order over time.' },
          { id: '2-1-3', name: 'Virtual Space Leasing', type: NodeType.CONCEPT, description: 'Renting or leasing digital real estate in virtual worlds.' },
        ],
      },
    ],
  },
];


const App: React.FC = () => {
  const [nodes, setNodes] = useState<SystemNode[]>(initialSystemsData);
  const [selectedNode, setSelectedNode] = useState<SystemNode | null>(nodes[0] || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const findNode = (id: string, nodeArray: SystemNode[]): SystemNode | null => {
    for (const node of nodeArray) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(id, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const handleNodeSelect = useCallback((node: SystemNode) => {
    // Ensure we're selecting the node from the current state tree
    const currentNode = findNode(node.id, nodes);
    setSelectedNode(currentNode);
    if (window.innerWidth < 768) { // md breakpoint in tailwind
      setIsSidebarOpen(false);
    }
  }, [nodes]);

  const updateTree = (tree: SystemNode[], callback: (node: SystemNode) => SystemNode | null): SystemNode[] => {
    return tree.map(node => {
      const result = callback(node);
      if (result === null) return null; // Node was deleted
      
      if (result.children) {
        const newChildren = updateTree(result.children, callback);
        return { ...result, children: newChildren.filter(Boolean) as SystemNode[] };
      }
      return result;
    }).filter(Boolean) as SystemNode[];
  };

  const handleAddNode = (parentId: string | null) => {
    const newNode: SystemNode = {
      id: Date.now().toString(),
      name: 'New Item',
      type: NodeType.CONCEPT,
      description: 'A new concept.',
      children: [],
      position: { x: 50, y: 50 },
    };

    if (parentId === null) {
        setNodes(currentNodes => [...currentNodes, newNode]);
    } else {
        const newTree = updateTree(nodes, (node) => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...(node.children || []), newNode],
            };
          }
          return node;
        });
        setNodes(newTree);
    }
    // Don't auto-select, let user place it.
  };
  
  const handleUpdateNode = (nodeId: string, updates: Partial<SystemNode>) => {
    const newTree = updateTree(nodes, (node) => {
        if (node.id === nodeId) {
            return { ...node, ...updates };
        }
        return node;
    });
    setNodes(newTree);

    // If the selected node or one of its children was updated, we need to refresh the
    // selectedNode state with the new data from the updated tree to avoid stale state.
    if (selectedNode) {
        const refreshedSelectedNode = findNode(selectedNode.id, newTree);
        setSelectedNode(refreshedSelectedNode);
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    if(!window.confirm("Are you sure you want to delete this item and all its children?")) return;

    const newTree = updateTree(nodes, (node) => (node.id === nodeId ? null : node));
    setNodes(newTree);

    // If a child of the selected node is deleted, we need to refresh the selected node
    if (selectedNode && selectedNode.children?.some(c => c.id === nodeId)) {
      const refreshedSelectedNode = findNode(selectedNode.id, newTree);
      setSelectedNode(refreshedSelectedNode);
    } else if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg font-sans">
      <div className={`absolute md:static top-0 left-0 h-full z-20 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <Sidebar 
          nodes={nodes} 
          selectedNode={selectedNode} 
          onNodeSelect={handleNodeSelect}
          onNodeAdd={handleAddNode}
          onNodeUpdate={handleUpdateNode}
          onNodeDelete={handleDeleteNode} 
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden p-2 bg-brand-sidebar flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-brand-text">
                {isSidebarOpen ? <XIcon /> : <MenuIcon />}
            </button>
            <h1 className="text-lg font-bold ml-4">Unified Systems Explorer</h1>
        </div>
        <ContentView 
            node={selectedNode}
            onNodeSelect={handleNodeSelect}
            onNodeAdd={() => handleAddNode(selectedNode?.id || null)}
            onNodeUpdate={handleUpdateNode}
            onNodeDelete={handleDeleteNode}
        />
      </main>
    </div>
  );
};

export default App;
