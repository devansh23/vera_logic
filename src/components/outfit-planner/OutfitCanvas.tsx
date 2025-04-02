"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WardrobeItem } from "@/types/outfit";
import { Pin, ArrowUp, ArrowDown, Trash2, ZoomIn, ZoomOut } from "lucide-react";

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
    <div 
      ref={canvasRef}
      className="h-full w-full bg-white rounded-md shadow-sm border border-gray-100 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Canvas background */}
      <div className="bg-[url('/grid-pattern.svg')] bg-center h-full w-full absolute opacity-5"></div>
      
      {/* Canvas items */}
      {positionedItems.map(item => (
        <div 
          key={item.id}
          className={`absolute cursor-grab ${item.isPinned ? "border-2 border-primary" : "border border-gray-200"} ${activeItemId === item.id ? "ring-2 ring-primary ring-opacity-50" : ""} rounded-md overflow-hidden bg-white shadow-sm transition-shadow`}
          style={{
            left: `${item.left}px`,
            top: `${item.top}px`,
            zIndex: item.zIndex,
            width: `${item.width}px`,
            height: `${item.height}px`,
          }}
          onMouseDown={(e) => handleMouseDown(e, item.id)}
        >
          {/* Item image */}
          <div className="relative h-full w-full overflow-hidden bg-white">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-contain"
                draggable={false}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-gray-400 p-2 text-center">
                {item.name}
              </div>
            )}
          </div>
          
          {/* Controls overlay */}
          <div className="absolute top-0 right-0 p-1 flex space-x-1 bg-white bg-opacity-80 rounded-bl-md">
            <button 
              onClick={(e) => {e.stopPropagation(); handleTogglePin(item.id)}}
              className={`p-1 rounded-sm ${item.isPinned ? "text-primary bg-primary-foreground" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
              title={item.isPinned ? "Unpin" : "Pin"}
            >
              <Pin size={12} />
            </button>
            <button 
              onClick={(e) => {e.stopPropagation(); handleMoveUp(item.id)}}
              className="p-1 rounded-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              title="Bring forward"
            >
              <ArrowUp size={12} />
            </button>
            <button 
              onClick={(e) => {e.stopPropagation(); handleMoveDown(item.id)}}
              className="p-1 rounded-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              title="Send backward"
            >
              <ArrowDown size={12} />
            </button>
          </div>
          
          {/* Size controls */}
          <div className="absolute bottom-0 right-0 p-1 flex space-x-1 bg-white bg-opacity-80 rounded-tl-md">
            <button 
              onClick={(e) => handleIncreaseSize(item.id, e)}
              className="p-1 rounded-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              title="Increase size"
            >
              <ZoomIn size={12} />
            </button>
            <button 
              onClick={(e) => handleDecreaseSize(item.id, e)}
              className="p-1 rounded-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              title="Decrease size"
            >
              <ZoomOut size={12} />
            </button>
          </div>
          
          {/* Remove button */}
          <div className="absolute bottom-0 left-0 p-1">
            <button 
              onClick={(e) => {e.stopPropagation(); handleRemoveItem(item.id)}}
              className="p-1 rounded-sm text-red-400 hover:text-red-600 hover:bg-red-50"
              title="Remove"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      ))}
      
      {/* Save button */}
      <div className="absolute bottom-4 right-4">
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm">Save Outfit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Your Outfit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input 
                placeholder="Outfit name" 
                value={outfitName} 
                onChange={(e) => setOutfitName(e.target.value)}
              />
              <Button onClick={handleSave} disabled={!outfitName.trim()}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Placeholder for empty state */}
      {positionedItems.length === 0 && (
        <div className="flex items-center justify-center h-full text-center p-8">
          <div className="max-w-sm">
            <h3 className="text-lg font-medium text-gray-400 mb-2">Design Your Outfit</h3>
            <p className="text-sm text-gray-400 mb-4">
              Drag items from your wardrobe to create an outfit. Position each piece by dragging it on the canvas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
