import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WardrobeItem } from "@/types/outfit";
import { Pin, ArrowUp, ArrowDown, Trash2 } from "lucide-react";

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
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [resizing, setResizing] = useState<{
    id: string;
    handle: string;
    initialWidth: number;
    initialHeight: number;
    initialX: number;
    initialY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ offsetX: number; offsetY: number } | null>(null);

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
      
      onUpdateItems([...items, { 
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

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const item = items.find(i => i.id === id);
    if (!item || item.isPinned) return;

    const canvasRect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - canvasRect.left - item.left;
    const offsetY = e.clientY - canvasRect.top - item.top;

    setActiveItem(id);
    setDragOffset({ offsetX, offsetY });

    const newItems = items.map(item => 
      item.id === id 
        ? { ...item, zIndex: maxZIndex } 
        : item
    );
    onUpdateItems(newItems);
    setMaxZIndex(prev => prev + 1);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeItem && dragOffset) {
      const item = items.find(i => i.id === activeItem);
      if (item?.isPinned) return;

      const canvasRect = e.currentTarget.getBoundingClientRect();
      const newItems = items.map(item => 
        item.id === activeItem 
          ? { 
              ...item, 
              left: e.clientX - canvasRect.left - dragOffset.offsetX,
              top: e.clientY - canvasRect.top - dragOffset.offsetY,
            } 
          : item
      );
      onUpdateItems(newItems);
    }
  };

  const handleMouseUp = () => {
    setActiveItem(null);
  };

  const handleSave = () => {
    if (!outfitName.trim()) return;
    
    const outfitItems = items.map(({ id, left, top }) => ({
      id,
      left,
      top,
    }));
    
    onSave(outfitName, outfitItems);
    setShowSaveDialog(false);
    setOutfitName('');
  };

  const handleRemoveItem = (id: string) => {
    onUpdateItems(items.filter(item => item.id !== id));
  };

  const handleMoveUp = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    const itemsAbove = items.filter(i => i.zIndex > item.zIndex);
    if (itemsAbove.length === 0) return;
    
    const nextZIndex = Math.min(...itemsAbove.map(i => i.zIndex));
    const itemToSwap = items.find(i => i.zIndex === nextZIndex);
    
    const newItems = items.map(i => {
      if (i.id === id) return { ...i, zIndex: nextZIndex };
      if (i.id === itemToSwap?.id) return { ...i, zIndex: item.zIndex };
      return i;
    });
    
    onUpdateItems(newItems);
  };

  const handleMoveDown = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    const itemsBelow = items.filter(i => i.zIndex < item.zIndex);
    if (itemsBelow.length === 0) return;
    
    const nextZIndex = Math.max(...itemsBelow.map(i => i.zIndex));
    const itemToSwap = items.find(i => i.zIndex === nextZIndex);
    
    const newItems = items.map(i => {
      if (i.id === id) return { ...i, zIndex: nextZIndex };
      if (i.id === itemToSwap?.id) return { ...i, zIndex: item.zIndex };
      return i;
    });
    
    onUpdateItems(newItems);
  };

  const handleTogglePin = (id: string) => {
    onUpdateItems(items.map(item => 
      item.id === id 
        ? { ...item, isPinned: !item.isPinned }
        : item
    ));
  };

  const handleResizeStart = (e: React.MouseEvent, id: string, handle: string) => {
    e.stopPropagation();
    const item = items.find(i => i.id === id);
    if (!item || item.isPinned) return;

    const canvasRect = (e.currentTarget.closest('.canvas-container') as HTMLElement).getBoundingClientRect();
    
    setResizing({
      id,
      handle,
      initialWidth: item.width,
      initialHeight: item.height,
      initialX: item.left,
      initialY: item.top,
      startX: e.clientX - canvasRect.left,
      startY: e.clientY - canvasRect.top,
    });

    const newItems = items.map(i => 
      i.id === id 
        ? { ...i, zIndex: maxZIndex } 
        : i
    );
    onUpdateItems(newItems);
    setMaxZIndex(prev => prev + 1);
  };

  const handleResizeMove = (e: React.MouseEvent) => {
    if (!resizing) return;

    const canvasRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const deltaX = e.clientX - canvasRect.left - resizing.startX;
    const deltaY = e.clientY - canvasRect.top - resizing.startY;
    
    const newItems = items.map(item => {
      if (item.id !== resizing.id) return item;

      let newWidth = resizing.initialWidth;
      let newHeight = resizing.initialHeight;
      let newLeft = resizing.initialX;
      let newTop = resizing.initialY;

      // Handle resize based on which handle is being dragged
      switch (resizing.handle) {
        case 'e':
          newWidth = Math.max(50, resizing.initialWidth + deltaX);
          break;
        case 'w':
          newWidth = Math.max(50, resizing.initialWidth - deltaX);
          newLeft = resizing.initialX + deltaX;
          break;
        case 's':
          newHeight = Math.max(50, resizing.initialHeight + deltaY);
          break;
        case 'n':
          newHeight = Math.max(50, resizing.initialHeight - deltaY);
          newTop = resizing.initialY + deltaY;
          break;
        case 'se':
          newWidth = Math.max(50, resizing.initialWidth + deltaX);
          newHeight = Math.max(50, resizing.initialHeight + deltaY);
          break;
        case 'sw':
          newWidth = Math.max(50, resizing.initialWidth - deltaX);
          newHeight = Math.max(50, resizing.initialHeight + deltaY);
          newLeft = resizing.initialX + deltaX;
          break;
        case 'ne':
          newWidth = Math.max(50, resizing.initialWidth + deltaX);
          newHeight = Math.max(50, resizing.initialHeight - deltaY);
          newTop = resizing.initialY + deltaY;
          break;
        case 'nw':
          newWidth = Math.max(50, resizing.initialWidth - deltaX);
          newHeight = Math.max(50, resizing.initialHeight - deltaY);
          newLeft = resizing.initialX + deltaX;
          newTop = resizing.initialY + deltaY;
          break;
      }

      return {
        ...item,
        width: newWidth,
        height: newHeight,
        left: newLeft,
        top: newTop,
      };
    });
    
    onUpdateItems(newItems);
  };

  const handleResizeEnd = () => {
    setResizing(null);
  };

  // Group items by category
  const itemsByCategory = items.reduce<{[key: string]: CanvasItem[]}>((acc, item) => {
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
        className="flex-1 border-2 border-dashed border-gray-300 rounded-lg bg-white relative overflow-hidden canvas-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={(e) => {
          handleMouseMove(e);
          handleResizeMove(e);
        }}
        onMouseUp={() => {
          handleMouseUp();
          handleResizeEnd();
        }}
        onMouseLeave={() => {
          handleMouseUp();
          handleResizeEnd();
        }}
      >
        {items.map((item) => (
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
              {!item.isPinned && (
                <>
                  <div
                    className="absolute top-0 left-0 w-2 h-2 bg-white border border-gray-400 cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, item.id, 'nw')}
                  />
                  <div
                    className="absolute top-0 right-0 w-2 h-2 bg-white border border-gray-400 cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, item.id, 'ne')}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-2 h-2 bg-white border border-gray-400 cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, item.id, 'sw')}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-2 h-2 bg-white border border-gray-400 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, item.id, 'se')}
                  />
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border border-gray-400 cursor-n-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, item.id, 'n')}
                  />
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border border-gray-400 cursor-s-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, item.id, 's')}
                  />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-gray-400 cursor-w-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, item.id, 'w')}
                  />
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-gray-400 cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, item.id, 'e')}
                  />
                </>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
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
