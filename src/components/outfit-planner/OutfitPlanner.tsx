import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import OutfitCanvas from './OutfitCanvas';
import { WardrobeSidebar } from './WardrobeSidebar';
import { WardrobeItem, CanvasItem, TryOnImage } from "@/types/wardrobe";
import { useWardrobe } from '@/contexts/WardrobeContext';

// Use CanvasItem type directly since it already extends WardrobeItem with the correct properties
type OutfitItem = CanvasItem;

interface MissingItem {
  name: string;
  id: string;
}

interface SaveOutfitResponse {
  success?: boolean;
  error?: string;
  details?: MissingItem[];
}

interface OutfitPlannerProps {
  editId?: string | null;
}

export default function OutfitPlanner({ editId }: OutfitPlannerProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { items: wardrobeItems } = useWardrobe();
  const [items, setItems] = useState<OutfitItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [shouldRefreshWardrobe, setShouldRefreshWardrobe] = useState(false);
  const [outfitName, setOutfitName] = useState<string | null>(null);
  const [tryOnImage, setTryOnImage] = useState<TryOnImage | null>(null);

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
          
          // Set the outfit name
          setOutfitName(outfit.name);
          
          // Set the virtual try-on image if it exists
          if (outfit.tryOnImage) {
            setTryOnImage(outfit.tryOnImage);
          }
          
          // Map the outfit items to the canvas format
          const canvasItems = outfit.items.map((item: any) => ({
            ...item.wardrobeItem,
            left: item.left || 0,
            top: item.top || 0,
            width: item.width || 150,
            height: item.height || 150,
            zIndex: item.zIndex || 1,
            isPinned: item.isPinned || false,
            brand: item.wardrobeItem.brand || 'Unknown Brand',
            category: item.wardrobeItem.category || 'Uncategorized',
            price: item.wardrobeItem.price || '0'
          }));
          
          setItems(canvasItems);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load outfit');
        } finally {
          setLoading(false);
        }
      };

      loadOutfit();
    }
  }, [editId]);

  const handleUpdateItems = (newItems: CanvasItem[]) => {
    // Convert CanvasItem to OutfitItem by ensuring required fields
    const convertedItems: OutfitItem[] = newItems.map(item => ({
      ...item,
      brand: item.brand || 'Unknown Brand',
      category: item.category || 'Uncategorized'
    }));
    setItems(convertedItems);
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
    wardrobeItemId?: string;
  }[], tryOnImageBase64?: string | null): Promise<SaveOutfitResponse | null> => {
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
        id: editId, // Include the ID if we're editing
        name,
        items: validatedItems,
        tryOnImage: tryOnImageBase64 || tryOnImage?.url // Use existing try-on image URL if no new one is provided
      };
      
      console.log('Saving outfit with data:', JSON.stringify(outfitData, null, 2));
      
      const response = await fetch('/api/outfits', {
        method: editId ? 'PUT' : 'POST', // Use PUT for updates, POST for new outfits
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
          const missingItemNames = data.details.map((item: MissingItem) => item.name).join(', ');
          throw new Error(`Cannot save outfit: The following items are no longer in your wardrobe: ${missingItemNames}`);
        }
        
        throw new Error(data.error || 'Failed to save outfit');
      }
      
      setSaveSuccess(`Outfit "${name}" ${editId ? 'updated' : 'saved'} successfully!`);
      
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
          onSave={saveOutfit}
          initialTryOnImage={tryOnImage}
        />
      </div>
    </div>
  );
}