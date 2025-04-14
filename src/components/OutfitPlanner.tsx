"use client"

import React, { useState, useEffect, useRef } from 'react';
import { WardrobeItem } from '@/types/wardrobe';
import { WardrobeSidebar } from './outfit-planner/WardrobeSidebar';
import OutfitCanvas from './outfit-planner/OutfitCanvas';
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
  const [shouldRefreshWardrobe, setShouldRefreshWardrobe] = useState(false);

  // Refresh wardrobe items when the component mounts, but only once
  useEffect(() => {
    if ((!refreshAttempted.current && !isLoading) || shouldRefreshWardrobe) {
      refreshAttempted.current = true;
      setShouldRefreshWardrobe(false);
      console.log('OutfitPlanner: Refreshing wardrobe items');
      refreshItems();
    }
  }, [refreshItems, isLoading, shouldRefreshWardrobe]);

  const updateCanvasItems = (items: CanvasItem[]) => {
    setCanvasItems(items);
  };

  const saveOutfit = async (name: string, items: { 
    id: string; 
    left: number; 
    top: number; 
    width: number; 
    height: number; 
    zIndex: number; 
    isPinned?: boolean;
    name?: string;
    wardrobeItemId?: string; // This might come from the canvas now
  }[]) => {
    if (!session?.user?.id) {
      setError('Please sign in to save outfits');
      return null;
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
        setError(`Some items in your outfit (${missingItems.length}) no longer exist in your wardrobe. Refreshing item list...`);
        // Trigger a refresh when missing items are detected
        setShouldRefreshWardrobe(true);
        return null;
      }
      
      // Set loading state
      setError(null);
      
      // Extra validation for numeric values to prevent null constraint violations
      const validatedItems = items.map(item => {
        // Get matching wardrobe item for better error reporting
        const wardrobeItem = wardrobeItems.find(w => w.id === item.id);
        
        // Convert all numeric values to correct types for Prisma
        // left and top must be Float in Prisma
        const left = parseFloat(Number(item.left || 0).toFixed(2));
        const top = parseFloat(Number(item.top || 0).toFixed(2));
        const width = parseFloat(Number(item.width || 150).toFixed(2));
        const height = parseFloat(Number(item.height || 150).toFixed(2));
        // zIndex must be Int in Prisma
        const zIndex = Math.round(Number(item.zIndex || 1));
        
        // Always use the item.id as wardrobeItemId, regardless of whether
        // item.wardrobeItemId was provided
        return {
          wardrobeItemId: item.id,
          left, 
          top,
          width,
          height,
          zIndex,
          isPinned: Boolean(item.isPinned),
          // Add name for better error reporting
          name: wardrobeItem?.name || 'Unknown Item'
        };
      });
      
      // Prepare the request payload
      const outfitData = {
        name,
        items: validatedItems
      };
      
      console.log('Saving outfit with data:', JSON.stringify(outfitData, null, 2));
      
      const response = await fetch('/api/outfits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(outfitData),
      });
      
      // Try to parse the response as JSON, handle potential parsing errors
      let data;
      try {
        data = await response.json();
        console.log('Response from server:', data);
      } catch (e) {
        console.error('Failed to parse server response:', e);
        throw new Error('Failed to understand server response. Please try again.');
      }
      
      if (!response.ok) {
        // Handle specific database constraint errors
        if (data?.details && typeof data.details === 'string') {
          const errorDetails = data.details;
          
          if (errorDetails.includes('Null constraint violation')) {
            console.error('Null constraint violation detected:', errorDetails);
            throw new Error('There was a problem with the data format. Please try again.');
          } else if (errorDetails.includes('PrismaClientKnownRequestError')) {
            console.error('Prisma error detected:', errorDetails);
            throw new Error('Database error when saving outfit. Please try again with different values.');
          } else {
            throw new Error(`Server error: ${errorDetails}`);
          }
        } else if (data?.details && Array.isArray(data.details)) {
          // This is an array of missing items
          const missingItemNames = data.details.map((item: any) => item.name).join(', ');
          throw new Error(`Cannot save outfit: The following items are no longer in your wardrobe: ${missingItemNames}`);
        }
        
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred while saving your outfit. Please try again.';
      setError(errorMessage);
      
      // If the error message contains "no longer in your wardrobe", trigger a refresh
      if (errorMessage.includes('no longer in your wardrobe') || errorMessage.includes('wardrobe items do not exist')) {
        console.log('Triggering wardrobe refresh due to missing items');
        setShouldRefreshWardrobe(true);
      }
      
      // Clear error message after 8 seconds
      setTimeout(() => {
        setError(null);
      }, 8000);
      
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