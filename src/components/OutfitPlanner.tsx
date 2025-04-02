"use client"

import React, { useState, useEffect } from 'react';
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
  const { items: wardrobeItems, isLoading, error } = useWardrobe();
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const updateCanvasItems = (items: CanvasItem[]) => {
    setCanvasItems(items);
  };

  const saveOutfit = async (name: string, items: { id: string; left: number; top: number }[]) => {
    if (!session?.user?.id) {
      return;
    }
    
    try {
      const response = await fetch('/api/outfits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          items: items.map(item => ({
            wardrobeItemId: item.id,
            left: item.left,
            top: item.top,
          })),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save outfit');
      }
      
      const data = await response.json();
      setSaveSuccess(`Outfit "${name}" saved successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving outfit:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded relative">
          <span className="block sm:inline">{error}</span>
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