import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { OutfitCanvas } from './OutfitCanvas';
import { WardrobeSidebar } from './WardrobeSidebar';
import type { WardrobeItem } from '@/types/wardrobe';

interface OutfitItem extends WardrobeItem {
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex: number;
  isPinned?: boolean;
}

interface OutfitPlannerProps {
  editId?: string | null;
}

export default function OutfitPlanner({ editId }: OutfitPlannerProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [items, setItems] = useState<OutfitItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editId) {
      const loadOutfit = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/outfits?id=${editId}`);
          if (!response.ok) {
            throw new Error('Failed to load outfit');
          }
          const outfit = await response.json();
          setItems(outfit.items.map((item: any) => ({
            ...item.wardrobeItem,
            left: item.left || 0,
            top: item.top || 0,
            width: item.width || 150,
            height: item.height || 150,
            zIndex: item.zIndex || 1,
            isPinned: item.isPinned || false
          })));
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load outfit');
        } finally {
          setLoading(false);
        }
      };

      loadOutfit();
    }
  }, [editId]);

  const handleUpdateItems = (newItems: OutfitItem[]) => {
    setItems(newItems);
  };

  const handleSave = async (name: string, outfitItems: OutfitItem[]) => {
    if (!session) {
      toast.error('Please sign in to save outfits');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/outfits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          items: outfitItems.map(item => ({
            wardrobeItemId: item.id,
            left: item.left,
            top: item.top,
            width: item.width,
            height: item.height,
            zIndex: item.zIndex,
            isPinned: item.isPinned
          }))
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save outfit');
      }

      toast.success('Outfit saved successfully!');
      router.push('/outfit-planner?tab=saved');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save outfit';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="flex h-full gap-4">
      <WardrobeSidebar />
      <div className="flex-1 flex flex-col">
        <OutfitCanvas 
          items={items}
          onUpdateItems={handleUpdateItems}
          onSave={handleSave}
        />
      </div>
    </div>
  );
} 