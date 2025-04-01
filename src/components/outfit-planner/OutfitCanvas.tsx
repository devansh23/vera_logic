"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WardrobeItem } from "@/types/outfit";
import { Pin, ArrowUp, ArrowDown, Trash2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface CanvasItem extends WardrobeItem {
  left: number;
  top: number;
  zIndex: number;
  isPinned?: boolean;
  width: number;
  height: number;
}

interface OutfitCanvasProps {
  items: CanvasItem[];
  onUpdateItems: (items: CanvasItem[]) => void;
  onSave: (name: string, items: { id: string; left: number; top: number }[]) => void;
}

export const OutfitCanvas = ({ items, onUpdateItems, onSave }: OutfitCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [positionedItems, setPositionedItems] = useState<CanvasItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [outfitName, setOutfitName] = useState('');

  // Initialize positioned items
  useEffect(() => {
    const updatedItems = items.map(item => {
      const existingItem = positionedItems.find(pi => pi.id === item.id);
      
      if (existingItem) {
        return {
          ...existingItem,
          ...item,
        };
      }
      
      let defaultLeft = 100;
      let defaultTop = 100;
      let defaultWidth = 150;
      let defaultHeight = 150;
      
      if (item.category?.toLowerCase().includes("shirt") || 
          item.category?.toLowerCase().includes("sweater") || 
          item.category?.toLowerCase().includes("top")) {
        defaultTop = 50;
      } else if (item.category?.toLowerCase().includes("jean") || 
                item.category?.toLowerCase().includes("short") ||
                item.category?.toLowerCase().includes("pant")) {
        defaultTop = 220;
      } else if (item.category?.toLowerCase().includes("shoe") ||
                item.category?.toLowerCase().includes("footwear")) {
        defaultTop = 400;
      }
      
      defaultLeft += Math.floor(Math.random() * 100) - 50;
      
      return {
        ...item,
        left: defaultLeft,
        top: defaultTop,
        width: defaultWidth,
        height: defaultHeight,
        zIndex: 1,
      };
    });
    
    setPositionedItems(updatedItems);
  }, [items]);

  // Global mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !activeItemId || !canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const item = positionedItems.find(i => i.id === activeItemId);
      if (!item || item.isPinned) return;
      
      const updatedItems = [...positionedItems];
      const itemIndex = updatedItems.findIndex(i => i.id === activeItemId);
      
      let newLeft = e.clientX - canvasRect.left - dragOffset.x;
      let newTop = e.clientY - canvasRect.top - dragOffset.y;
      
      // Constrain to canvas bounds
      newLeft = Math.max(0, Math.min(newLeft, canvasRect.width - item.width));
      newTop = Math.max(0, Math.min(newTop, canvasRect.height - item.height));
      
      updatedItems[itemIndex] = {
        ...item,
        left: newLeft,
        top: newTop
      };

      setPositionedItems(updatedItems);
      onUpdateItems(updatedItems);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setActiveItemId(null);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, activeItemId, dragOffset, positionedItems, onUpdateItems]);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (e.button !== 0) return;
    
    const item = positionedItems.find(i => i.id === id);
    if (!item || item.isPinned) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setActiveItemId(id);
    setIsDragging(true);
    
    const newItems = positionedItems.map(item => 
      item.id === id 
        ? { ...item, zIndex: maxZIndex + 1 } 
        : item
    );
    setMaxZIndex(prev => prev + 1);
    setPositionedItems(newItems);
    onUpdateItems(newItems);
    
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      const item: WardrobeItem = JSON.parse(data);
      const left = e.clientX - canvasRect.left;
      const top = e.clientY - canvasRect.top;
      
      onUpdateItems([...positionedItems, { 
        ...item, 
        left, 
        top, 
        zIndex: maxZIndex,
        width: 128, // Initial width
        height: 128 // Initial height
      }]);
      setMaxZIndex(prev => prev + 1);
    }
  };

  const handleSave = () => {
    if (!outfitName.trim()) return;
    
    const outfitItems = positionedItems.map(({ id, left, top }) => ({
      id,
      left,
      top,
    }));
    
    onSave(outfitName, outfitItems);
    setShowSaveDialog(false);
    setOutfitName('');
  };

  const handleRemoveItem = (id: string) => {
    onUpdateItems(positionedItems.filter(item => item.id !== id));
  };

  const handleMoveUp = (id: string) => {
    const item = positionedItems.find(i => i.id === id);
    if (!item) return;
    
    const itemsAbove = positionedItems.filter(i => i.zIndex > item.zIndex);
    if (itemsAbove.length === 0) return;
    
    const nextZIndex = Math.min(...itemsAbove.map(i => i.zIndex));
    const itemToSwap = positionedItems.find(i => i.zIndex === nextZIndex);
    
    const newItems = positionedItems.map(i => {
      if (i.id === id) return { ...i, zIndex: nextZIndex };
      if (i.id === itemToSwap?.id) return { ...i, zIndex: item.zIndex };
      return i;
    });
    
    onUpdateItems(newItems);
  };

  const handleMoveDown = (id: string) => {
    const item = positionedItems.find(i => i.id === id);
    if (!item) return;
    
    const itemsBelow = positionedItems.filter(i => i.zIndex < item.zIndex);
    if (itemsBelow.length === 0) return;
    
    const nextZIndex = Math.max(...itemsBelow.map(i => i.zIndex));
    const itemToSwap = positionedItems.find(i => i.zIndex === nextZIndex);
    
    const newItems = positionedItems.map(i => {
      if (i.id === id) return { ...i, zIndex: nextZIndex };
      if (i.id === itemToSwap?.id) return { ...i, zIndex: item.zIndex };
      return i;
    });
    
    onUpdateItems(newItems);
  };

  const handleTogglePin = (id: string) => {
    onUpdateItems(positionedItems.map(item => 
      item.id === id 
        ? { ...item, isPinned: !item.isPinned }
        : item
    ));
  };

  // New handlers for size buttons
  const handleIncreaseSize = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const itemIndex = positionedItems.findIndex(i => i.id === id);
    if (itemIndex === -1) return;
    
    const item = positionedItems[itemIndex];
    const updatedItems = [...positionedItems];
    
    updatedItems[itemIndex] = {
      ...item,
      width: item.width * 1.2,
      height: item.height * 1.2
    };
    
    setPositionedItems(updatedItems);
    onUpdateItems(updatedItems);
  };

  const handleDecreaseSize = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const itemIndex = positionedItems.findIndex(i => i.id === id);
    if (itemIndex === -1) return;
    
    const item = positionedItems[itemIndex];
    const updatedItems = [...positionedItems];
    
    updatedItems[itemIndex] = {
      ...item,
      width: Math.max(50, item.width * 0.8),
      height: Math.max(50, item.height * 0.8)
    };
    
    setPositionedItems(updatedItems);
    onUpdateItems(updatedItems);
  };

  const handleResetSize = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const itemIndex = positionedItems.findIndex(i => i.id === id);
    if (itemIndex === -1) return;
    
    const item = positionedItems[itemIndex];
    const updatedItems = [...positionedItems];
    
    updatedItems[itemIndex] = {
      ...item,
      width: 150,
      height: 150
    };
    
    setPositionedItems(updatedItems);
    onUpdateItems(updatedItems);
  };

  // Group items by category
  const itemsByCategory = positionedItems.reduce<{[key: string]: CanvasItem[]}>((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={canvasRef}
        className="flex-1 border-2 border-dashed border-gray-300 rounded-lg bg-white relative overflow-hidden canvas-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {positionedItems.map((item) => (
          <div
            key={item.id}
            className="absolute cursor-move"
            style={{
              left: `${item.left}px`,
              top: `${item.top}px`,
              zIndex: item.zIndex,
              width: `${item.width}px`,
              height: `${item.height}px`,
            }}
            onMouseDown={(e) => !item.isPinned && handleMouseDown(e, item.id)}
          >
            <div className="relative group h-full">
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePin(item.id);
                  }}
                  className={`p-1.5 rounded-md hover:bg-gray-100 ${item.isPinned ? 'text-blue-500' : 'text-gray-500'}`}
                  title={item.isPinned ? "Unpin" : "Pin"}
                >
                  <Pin size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveUp(item.id);
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                  title="Move Up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveDown(item.id);
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                  title="Move Down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={(e) => handleIncreaseSize(item.id, e)}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                  title="Increase Size"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={(e) => handleDecreaseSize(item.id, e)}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                  title="Decrease Size"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  onClick={(e) => handleResetSize(item.id, e)}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                  title="Reset Size"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item.id);
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-red-500"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="relative h-full">
                <img
                  src={item.image || item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-contain bg-white rounded-lg shadow-sm"
                  draggable={false}
                />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {item.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {positionedItems.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Drag and drop items here to create your outfit
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-2">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category} className="text-sm">
              <span className="font-medium">{category}:</span> {items.length}
            </div>
          ))}
        </div>
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button>Save Outfit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Outfit</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input
                  id="name"
                  placeholder="Enter outfit name"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
