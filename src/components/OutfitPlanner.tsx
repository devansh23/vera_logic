"use client"

import React, { useState, useEffect, useRef } from 'react';
import { WardrobeItem } from '@/types/outfit';
import { WardrobeSidebar } from './outfit-planner/WardrobeSidebar';
import { OutfitCanvas } from './outfit-planner/OutfitCanvas';
import { useSession } from 'next-auth/react';
import { useWardrobe } from '@/contexts/WardrobeContext';

interface OutfitPlannerProps {
  initialItems?: WardrobeItem[];
}

interface CanvasItem extends WardrobeItem {
  left: number;
  top: number;
  zIndex: number;
  isPinned?: boolean;
  width: number;
  height: number;
}

export default function OutfitPlanner({ initialItems = [] }: OutfitPlannerProps) {
  const { data: session } = useSession();
  const { items: wardrobeItems, isLoading, error, refreshItems } = useWardrobe();
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setError] = useState<string | null>(null);
  const refreshAttempted = useRef(false);

  // Refresh wardrobe items when the component mounts, but only once
  useEffect(() => {
    if (!refreshAttempted.current && !isLoading) {
      refreshAttempted.current = true;
      console.log('OutfitPlanner: Initial wardrobe refresh');
      refreshItems();
    }
  }, [refreshItems, isLoading]);

  const updateCanvasItems = (items: CanvasItem[]) => {
    setCanvasItems(items);
  };

  const saveOutfit = async (name: string, items: { id: string; left: number; top: number }[]) => {
    if (!session?.user?.id) {
      return;
    }
    
    try {
      // Log and validate the wardrobe items
      console.log('Canvas items for outfit:', items);
      console.log('Current wardrobe item IDs:', wardrobeItems.map(item => item.id));
      
      // Make sure we have wardrobe items
      if (items.length === 0) {
        setError('Cannot save an empty outfit. Please add items to your outfit.');
        return null;
      }
      
      // Validate that all items exist in the wardrobe
      const missingItems = items.filter(item => 
        !wardrobeItems.some(wardrobeItem => wardrobeItem.id === item.id)
      );

      if (missingItems.length > 0) {
        console.error('Missing wardrobe items:', missingItems);
        setError(`Some items in your outfit (${missingItems.length}) no longer exist in your wardrobe. Please refresh the page and try again.`);
        return null;
      }
      
      // Prepare the request payload
      const outfitData = {
        name,
        items: items.map(item => ({
          wardrobeItemId: item.id,
          left: item.left,
          top: item.top,
          // Add default values for width and height if needed
          width: 150,
          height: 150,
          zIndex: 1
        }))
      };
      
      console.log('Saving outfit with data:', outfitData);
      
      const response = await fetch('/api/outfits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(outfitData),
      });
      
      const data = await response.json();
      console.log('Response from server:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save outfit');
      }
      
      setSaveSuccess(`Outfit "${name}" saved successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
      
      return data;
    } catch (error) {
      console.error('Error saving outfit:', error);
      // Set error message in state to display to user
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded relative">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      
      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded relative">
          <span className="block sm:inline">{saveSuccess}</span>
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden border border-gray-200 rounded-lg">
        <div className="flex-shrink-0 border-r border-gray-200">
          <WardrobeSidebar />
        </div>
        <div className="flex-1 overflow-hidden p-4 bg-gray-50">
          <OutfitCanvas
            items={canvasItems}
            onUpdateItems={updateCanvasItems}
            onSave={saveOutfit}
          />
        </div>
      </div>
    </div>
  );
} 