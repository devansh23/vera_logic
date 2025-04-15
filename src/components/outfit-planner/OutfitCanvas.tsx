"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { WardrobeItem, CanvasItem, TryOnImage } from "@/types/wardrobe";
import { Pin, ArrowUp, ArrowDown, Trash2 } from "lucide-react";

interface OutfitCanvasProps {
  items: CanvasItem[];
  onUpdateItems: (items: CanvasItem[]) => void;
  onSave: (name: string, items: CanvasItem[], tryOnImageBase64?: string | null, saveAsNew?: boolean) => Promise<any>;
  initialTryOnImage?: TryOnImage | null;
  isEditing?: boolean;
  existingName?: string;
}

export default function OutfitCanvas({ 
  items, 
  onUpdateItems, 
  onSave, 
  initialTryOnImage,
  isEditing,
  existingName 
}: OutfitCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [positionedItems, setPositionedItems] = useState<CanvasItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [tryOnImage, setTryOnImage] = useState<TryOnImage | null>(null);
  const [isDraggingTryOn, setIsDraggingTryOn] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizingTryOn, setIsResizingTryOn] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [error, setError] = useState<string | null>(null);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [isResizingItem, setIsResizingItem] = useState<string | null>(null);
  const [itemResizeStart, setItemResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

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

  // Initialize try-on image from props
  useEffect(() => {
    if (initialTryOnImage) {
      setTryOnImage(initialTryOnImage);
    }
  }, [initialTryOnImage]);

  // Initialize outfit name from props when editing
  useEffect(() => {
    if (isEditing && existingName) {
      setOutfitName(existingName);
    }
  }, [isEditing, existingName]);

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
      try {
        const item: WardrobeItem = JSON.parse(data);
        // Make sure the item has an ID
        if (!item.id) {
          console.error('Dropped item is missing an ID:', item);
          return;
        }

        // Check if the item is already on the canvas
        const existingItem = positionedItems.find(pi => pi.id === item.id);
        if (existingItem) {
          console.log('Item is already on the canvas:', item.id);
          return;
        }

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
      } catch (error) {
        console.error('Error parsing dropped item:', error);
      }
    }
  };

  const handleSave = async () => {
    if (outfitName.trim() === '') {
      setError('Please enter a name for your outfit');
      return;
    }

    try {
      const result = await onSave(outfitName, positionedItems, tryOnImage ? tryOnImage.url : null, saveAsNew);
      if (result) {
        setShowSaveDialog(false);
        if (!isEditing || saveAsNew) {
          setOutfitName('');
        }
        setSaveAsNew(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save outfit');
    }
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

  // Handle canvas item resize with resize handle
  const handleItemResizeMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const item = positionedItems.find(i => i.id === id);
    if (!item) return;
    
    setIsResizingItem(id);
    setItemResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: item.width,
      height: item.height
    });
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

  const handleTryItOn = async () => {
    try {
      // Log the current items on canvas for debugging
      console.log('Items on canvas:', positionedItems);

      // Ensure there are items on the canvas
      if (positionedItems.length === 0) {
        console.error('No items on canvas to try on');
        return;
      }

      // Get canvas dimensions for positioning
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      // Set initial size for try-on image
      const initialWidth = 300; // You can adjust this value
      const initialHeight = 400; // You can adjust this value

      // Calculate position for top right corner
      const margin = 20;
      const xPosition = canvasRect.width - initialWidth - margin;
      const yPosition = margin;

      // Fetch user's full body photo
      const userPhotoResponse = await fetch('/api/user/full-body-photo');
      if (!userPhotoResponse.ok) {
        console.error('Failed to fetch user photo:', await userPhotoResponse.json());
        return;
      }
      const { fullBodyPhoto } = await userPhotoResponse.json();
      if (!fullBodyPhoto) {
        console.error('No full body photo found for user');
        return;
      }

      // Create FormData object
      const formData = new FormData();
      
      // Add user's full body photo
      const userPhotoBlob = await fetch(fullBodyPhoto).then(r => r.blob());
      formData.append('userImage', userPhotoBlob, 'user-photo.jpg');

      // Add each clothing item image
      for (let i = 0; i < positionedItems.length; i++) {
        const item = positionedItems[i];
        if (item.image) {
          const itemBlob = await fetch(item.image).then(r => r.blob());
          formData.append(`clothingImage${i}`, itemBlob, `clothing-${i}.jpg`);
        }
      }

      // Log the form data for debugging
      console.log('FormData entries:', Array.from(formData.entries()));

      // Call the virtual try-on API
      const response = await fetch('/api/virtual-tryon', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error calling virtual try-on API:', error);
        return;
      }

      // Get the response data
      const data = await response.json();
      if (!data.image) {
        console.error('No image in response:', data);
        return;
      }

      // Create a data URL from the base64 image
      const imageUrl = `data:image/png;base64,${data.image}`;

      // Set the try-on image with the new positioning
      setTryOnImage({
        url: imageUrl,
        position: { x: xPosition, y: yPosition },
        size: { width: initialWidth, height: initialHeight }
      });

      // Log the try-on image state
      console.log('Try-on image set:', {
        url: imageUrl,
        position: { x: xPosition, y: yPosition },
        size: { width: initialWidth, height: initialHeight }
      });

    } catch (error) {
      console.error('Error in handleTryItOn:', error);
    }
  };

  const handleTryOnMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingTryOn(true);
    setDragStart({
      x: e.clientX - (tryOnImage?.position.x || 0),
      y: e.clientY - (tryOnImage?.position.y || 0)
    });
  };

  const handleTryOnResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingTryOn(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: tryOnImage?.size.width || 0,
      height: tryOnImage?.size.height || 0
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingTryOn && tryOnImage) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setTryOnImage({
        ...tryOnImage,
        position: { x: newX, y: newY }
      });
    } else if (isResizingTryOn && tryOnImage) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newWidth = Math.max(100, resizeStart.width + deltaX);
      const newHeight = Math.max(100, resizeStart.height + deltaY);
      setTryOnImage({
        ...tryOnImage,
        size: { width: newWidth, height: newHeight }
      });
    } else if (isResizingItem) {
      const item = positionedItems.find(i => i.id === isResizingItem);
      if (!item) return;
      
      const deltaX = e.clientX - itemResizeStart.x;
      const deltaY = e.clientY - itemResizeStart.y;
      const newWidth = Math.max(50, itemResizeStart.width + deltaX);
      const newHeight = Math.max(50, itemResizeStart.height + deltaY);
      
      const updatedItems = positionedItems.map(i => 
        i.id === isResizingItem
          ? { ...i, width: newWidth, height: newHeight }
          : i
      );
      
      setPositionedItems(updatedItems);
      onUpdateItems(updatedItems);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingTryOn(false);
    setIsResizingTryOn(false);
    setIsResizingItem(null);
  };

  const handleDeleteTryOn = () => {
    setTryOnImage(null);
  };

  return (
    <div 
      ref={canvasRef}
      className="h-full w-full bg-white rounded-md shadow-sm border border-gray-100 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Canvas background */}
      <div className="bg-[url('/grid-pattern.svg')] bg-center h-full w-full absolute opacity-5"></div>
      
      {/* Canvas items */}
      {positionedItems.map(item => (
        <div 
          key={item.id}
          className={`absolute group cursor-grab ${item.isPinned ? "border-2 border-primary" : "border border-gray-200"} ${activeItemId === item.id ? "ring-2 ring-primary ring-opacity-50" : ""} rounded-md overflow-visible bg-white shadow-sm transition-shadow`}
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
          
          {/* Item name label attached at the bottom - shown on hover */}
          <div 
            className="absolute bottom-0 left-0 right-0 translate-y-full mt-1 bg-gray-800 py-1 px-2 text-center rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
          >
            <p className="text-white text-xs truncate">{item.name}</p>
          </div>
          
          {/* Controls overlay - completely hidden until hover */}
          <div className="absolute top-0 right-0 p-1 flex space-x-1 bg-white bg-opacity-80 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
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
          
          {/* Resize handle in the bottom right corner */}
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            onMouseDown={(e) => handleItemResizeMouseDown(e, item.id)}
          />
          
          {/* Remove button - completely hidden until hover */}
          <div className="absolute bottom-0 left-0 p-1 bg-white bg-opacity-80 rounded-tr-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
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
              <DialogDescription>
                {isEditing 
                  ? "Update the existing outfit or save as a new one."
                  : "Give your outfit a name to save it to your collection."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input 
                placeholder="Outfit name" 
                value={outfitName} 
                onChange={(e) => setOutfitName(e.target.value)}
              />
              {tryOnImage && (
                <div className="relative w-full aspect-[2/3] bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={tryOnImage.url} 
                    alt="Try on preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              {isEditing ? (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setSaveAsNew(false);
                      handleSave();
                    }} 
                    className="flex-1"
                    disabled={!outfitName.trim()}
                  >
                    Update Outfit
                  </Button>
                  <Button 
                    onClick={() => {
                      setSaveAsNew(true);
                      handleSave();
                    }}
                    className="flex-1"
                    disabled={!outfitName.trim()}
                  >
                    Save as New
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={!outfitName.trim()}
                  className="w-full"
                >
                  Save
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Try it on button */}
      <div className="absolute bottom-4 right-32">
        <Button variant="default" size="sm" onClick={handleTryItOn}>Try it on</Button>
      </div>
      
      {/* Display try-on image */}
      {tryOnImage && (
        <div 
          className="absolute bg-white rounded-md shadow-md overflow-hidden"
          style={{
            left: `${tryOnImage.position.x}px`,
            top: `${tryOnImage.position.y}px`,
            width: `${tryOnImage.size.width}px`,
            height: `${tryOnImage.size.height}px`,
            cursor: isDraggingTryOn ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleTryOnMouseDown}
        >
          <img 
            src={tryOnImage.url} 
            alt="Try on result" 
            className="w-full h-full object-contain"
          />
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
            onMouseDown={handleTryOnResizeMouseDown}
          />
          <button
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            onClick={handleDeleteTryOn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
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
}
