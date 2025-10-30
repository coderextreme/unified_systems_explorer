
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { SystemNode } from '../types';
import { NodeType } from '../types';
import { DomainIcon, SystemIcon, ConceptIcon, ModelIcon, ToolIcon, PencilIcon, TrashIcon } from './Icons';

interface DiagramNodeProps {
  node: SystemNode;
  onNodeUpdate: (nodeId: string, updates: Partial<SystemNode>) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeSelect: (node: SystemNode) => void;
  onDragStart: () => void;
  onDrag: (position: { x: number; y: number }) => void;
  onDragEnd: (position: { x: number; y: number }) => void;
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

const GRID_SIZE = 20;

const DiagramNode: React.FC<DiagramNodeProps> = ({ node, onNodeUpdate, onNodeDelete, onNodeSelect, onDragStart, onDrag, onDragEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(node.name);
  
  const nodeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Ref to store drag-related state to avoid re-renders during drag
  const dragState = useRef<{
      isDown: boolean;
      isDragging: boolean;
      startX: number;
      startY: number;
      offsetX: number;
      offsetY: number;
  } | null>(null);

  useEffect(() => {
    setName(node.name);
  }, [node.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleInteractionMove = useCallback((e: MouseEvent | TouchEvent) => {
      if (!dragState.current || !dragState.current.isDown) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const dx = clientX - dragState.current.startX;
      const dy = clientY - dragState.current.startY;

      // Start dragging only after moving a certain threshold
      if (!dragState.current.isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
          dragState.current.isDragging = true;
          setIsDragging(true);
          onDragStart();
      }

      if (dragState.current.isDragging) {
        if ('preventDefault' in e && e.cancelable) e.preventDefault();

        const parentRect = nodeRef.current?.parentElement?.getBoundingClientRect();
        const nodeRect = nodeRef.current?.getBoundingClientRect();
        if (!parentRect || !nodeRect) return;

        let newX = clientX - parentRect.left - dragState.current.offsetX;
        let newY = clientY - parentRect.top - dragState.current.offsetY;
        
        newX = Math.max(0, Math.min(newX, parentRect.width - nodeRect.width));
        newY = Math.max(0, Math.min(newY, parentRect.height - nodeRect.height));

        const snappedX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
        const snappedY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

        if (nodeRef.current) {
          nodeRef.current.style.transform = `translate(${snappedX}px, ${snappedY}px)`;
        }
        onDrag({ x: snappedX, y: snappedY });
      }
  }, [onDragStart, onDrag]);

  const handleInteractionEnd = useCallback(() => {
    window.removeEventListener('mousemove', handleInteractionMove as EventListener);
    window.removeEventListener('touchmove', handleInteractionMove as EventListener);
    window.removeEventListener('mouseup', handleInteractionEnd);
    window.removeEventListener('touchend', handleInteractionEnd);

    if (dragState.current) {
        if (dragState.current.isDragging) {
            const transform = nodeRef.current?.style.transform;
            if (transform && transform.includes('translate')) {
                const [x, y] = transform.replace(/translate\(|px|\)/g, '').split(',').map(v => parseFloat(v));
                onDragEnd({ x, y });
            } else {
                onDragEnd(node.position || { x: 0, y: 0 });
            }
        } else {
            // If not dragging, it's a tap/click
            onNodeSelect(node);
        }
    }
    
    setIsDragging(false);
    dragState.current = null;
  }, [onDragEnd, onNodeSelect, node, handleInteractionMove]);

  const handleInteractionStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isEditing || dragState.current) return;
    
    e.stopPropagation();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const nodeRect = nodeRef.current?.getBoundingClientRect();
    if (!nodeRect) return;

    dragState.current = {
        isDown: true,
        isDragging: false,
        startX: clientX,
        startY: clientY,
        offsetX: clientX - nodeRect.left,
        offsetY: clientY - nodeRect.top,
    };
    
    window.addEventListener('mousemove', handleInteractionMove as EventListener);
    window.addEventListener('touchmove', handleInteractionMove as EventListener, { passive: false });
    window.addEventListener('mouseup', handleInteractionEnd);
    window.addEventListener('touchend', handleInteractionEnd);
  }, [isEditing, handleInteractionMove, handleInteractionEnd]);

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

  const position = node.position || { x: 0, y: 0 };

  return (
    <div
      ref={nodeRef}
      className={`absolute w-40 p-3 group bg-brand-content border-2 border-transparent rounded-lg shadow-md transition-all duration-150 cursor-grab ${isDragging ? 'shadow-2xl border-brand-accent scale-105 cursor-grabbing z-10 opacity-75' : 'hover:border-brand-accent/50'}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)`, touchAction: 'none' }}
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
    >
      <div className="flex items-center mb-1">
        <div className="text-brand-text-muted mr-2">{getNodeIcon(node.type)}</div>
        {isEditing ? (
             <input 
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag while editing
                className="bg-gray-900 text-white w-full p-0 m-0 border-0 focus:ring-0 text-sm"
            />
        ) : (
             <h3 className="text-white font-semibold text-sm truncate flex-1">{node.name}</h3>
        )}
       
      </div>
       <p className="text-xs text-brand-text-muted px-1 truncate">{node.description}</p>
       <div className="absolute top-0 right-0 -mt-2 -mr-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                title="Edit"
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                onMouseDown={(e) => e.stopPropagation()}
                className="p-1.5 bg-brand-sidebar rounded-full hover:bg-brand-accent text-white"
            >
                <PencilIcon />
            </button>
            <button
                title="Delete"
                onClick={(e) => { e.stopPropagation(); onNodeDelete(node.id); }}
                onMouseDown={(e) => e.stopPropagation()}
                className="p-1.5 bg-brand-sidebar rounded-full hover:bg-brand-accent text-white"
            >
                <TrashIcon />
            </button>
        </div>
    </div>
  );
};

export default DiagramNode;
