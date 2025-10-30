
import React, { useEffect, useRef, useState } from 'react';
import type { SystemNode } from '../types';
import DiagramNode from './DiagramNode';
import { FolderOpenIcon, PlusIcon } from './Icons';

interface DiagramViewProps {
  node: SystemNode | null;
  onNodeSelect: (node: SystemNode) => void;
  onNodeAdd: () => void;
  onNodeUpdate: (nodeId: string, updates: Partial<SystemNode>) => void;
  onNodeDelete: (nodeId: string) => void;
}

const DiagramView: React.FC<DiagramViewProps> = ({ node, onNodeSelect, onNodeAdd, onNodeUpdate, onNodeDelete }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [liveDrag, setLiveDrag] = useState<{ nodeId: string; position: { x: number; y: number } } | null>(null);

  // Auto-layout effect for nodes without a position
  useEffect(() => {
    if (!node?.children || !canvasRef.current) return;

    const nodesToPosition = node.children.filter(child => !child.position);
    if (nodesToPosition.length === 0) return;

    const { width, height } = canvasRef.current.getBoundingClientRect();
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const angleStep = (2 * Math.PI) / nodesToPosition.length;

    nodesToPosition.forEach((child, index) => {
      const angle = index * angleStep;
      const x = centerX + radius * Math.cos(angle) - 75; // Adjust for node width
      const y = centerY + radius * Math.sin(angle) - 35; // Adjust for node height
      onNodeUpdate(child.id, { position: { x, y } });
    });
  }, [node, onNodeUpdate]);

  if (!node) return null;
  
  const canvasWidth = canvasRef.current?.scrollWidth || 2000;
  const canvasHeight = canvasRef.current?.scrollHeight || 2000;
  const parentX = canvasWidth / 2;
  const parentY = 60;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center pb-4 border-b-2 border-brand-content mb-6 flex-shrink-0">
          <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center">
                  <span className="mr-4 text-brand-accent"><FolderOpenIcon /></span>
                  {node.name}
              </h1>
              <p className="text-lg text-brand-text-muted mt-2">{node.description}</p>
          </div>
          <button 
              onClick={onNodeAdd}
              className="flex items-center bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors"
          >
              <PlusIcon /> <span className="ml-2 hidden sm:inline">Add New Item</span>
          </button>
      </div>
      <div className="flex-grow overflow-auto relative bg-grid-pattern" ref={canvasRef}>
        <div className="absolute inset-0" style={{width: 2000, height: 2000}}>
           <svg className="absolute w-full h-full" pointerEvents="none">
             <defs>
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="0"
                    refY="3.5"
                    orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#4a5568" />
                </marker>
             </defs>
            {node.children?.map(child => {
              let childPosition = child.position;
              if (liveDrag?.nodeId === child.id) {
                childPosition = liveDrag.position;
              }
              if (!childPosition) return null;

              const childCenterX = childPosition.x + 80; // half-width of w-40
              const childCenterY = childPosition.y + 35; // half-height
              return (
                <line
                  key={`line-${child.id}`}
                  x1={parentX}
                  y1={parentY}
                  x2={childCenterX}
                  y2={childCenterY}
                  stroke="#4a5568"
                  strokeWidth="1.5"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
           </svg>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 text-center">
                <div className="p-3 bg-brand-sidebar border-2 border-brand-accent rounded-lg shadow-lg">
                    <h3 className="text-white font-bold truncate">{node.name}</h3>
                    <p className="text-xs text-brand-text-muted">Parent Context</p>
                </div>
            </div>
            {node.children?.map(child => (
                <DiagramNode 
                    key={child.id}
                    node={child}
                    onNodeUpdate={onNodeUpdate}
                    onNodeDelete={onNodeDelete}
                    onNodeSelect={onNodeSelect}
                    onDragStart={() => {
                        setLiveDrag({ nodeId: child.id, position: child.position || { x: 0, y: 0 } });
                    }}
                    onDrag={(position) => {
                        setLiveDrag({ nodeId: child.id, position });
                    }}
                    onDragEnd={(position) => {
                        onNodeUpdate(child.id, { position });
                    }}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

// A little extra CSS for the grid background
const style = document.createElement('style');
style.innerHTML = `
.bg-grid-pattern {
    background-color: #1a1a2e;
    background-image:
        linear-gradient(rgba(31, 64, 104, 0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(31, 64, 104, 0.3) 1px, transparent 1px);
    background-size: 20px 20px;
}`;
document.head.appendChild(style);


export default DiagramView;
