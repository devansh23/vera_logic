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
  outfit?: { id: string };
}

interface OutfitPlannerProps {
  editId?: string | null;
}

// Add a debug script loader function
const loadDebugScript = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const script = document.createElement('script');
    script.src = '/test-outfit-loading.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }
  return () => {};
};

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

  // Load the debug script in development mode
  useEffect(() => {
    return loadDebugScript();
  }, []);

  useEffect(() => {
    // Log the editId when it changes
    if (editId) {
      console.log(`OutfitPlanner received editId: ${editId}`);
    }
  }, [editId]);

  useEffect(() => {
    if (editId) {
      const loadOutfit = async () => {
        try {
          setLoading(true);
          console.log(`Loading outfit with ID: ${editId}`);
          
          const response = await fetch(`/api/outfits?id=${editId}`);
          if (!response.ok) {
            console.error(`API response not OK: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to load outfit: ${response.status} ${response.statusText}`);
          }
          
          const outfit = await response.json();
          console.log('Successfully loaded outfit data:', outfit);
          
          // Validate the outfit data
          if (!outfit || !outfit.id || !outfit.items || !Array.isArray(outfit.items)) {
            console.error('Invalid outfit data received:', outfit);
            throw new Error('Invalid outfit data received from API');
          }
          
          // Check if items array is empty
          if (outfit.items.length === 0) {
            console.warn('Outfit has no items');
          }
          
          // Set the outfit name
          setOutfitName(outfit.name || 'Unnamed Outfit');
          
          // Set the virtual try-on image if it exists
          if (outfit.tryOnImage) {
            console.log('Setting try-on image:', outfit.tryOnImage);
            setTryOnImage({
              url: outfit.tryOnImage,
              position: { x: 0, y: 0 }, // Default position
              size: { width: 400, height: 600 } // Default size
            });
          } else {
            // Explicitly clear any existing try-on image
            console.log('No try-on image found, clearing any existing one');
            setTryOnImage(null);
          }
          
          // Map the outfit items to the canvas format
          const canvasItems = outfit.items.map((item: any) => {
            // Validate that wardrobeItem exists
            if (!item.wardrobeItem) {
              console.warn('Item missing wardrobeItem:', item);
              return null;
            }
            
            return {
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
            };
          })
          .filter(Boolean); // Remove any null items
          
          console.log(`Mapped ${canvasItems.length} canvas items:`, canvasItems);
          
          // Only update state if we have valid data
          if (canvasItems.length > 0) {
            setItems(canvasItems);
          } else {
            console.warn('No valid canvas items found in outfit data');
            setError('This outfit appears to be empty or contains invalid items');
          }
        } catch (err) {
          console.error('Error loading outfit:', err);
          setError(err instanceof Error ? err.message : 'Failed to load outfit');
        } finally {
          setLoading(false);
        }
      };

      loadOutfit();
    } else {
      console.log('No editId provided, not loading any outfit');
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
  }[], tryOnImageBase64?: string | null, saveAsNew?: boolean): Promise<SaveOutfitResponse | null> => {
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
        id: saveAsNew ? undefined : editId, // Only include ID if updating existing outfit
        name,
        items: validatedItems,
        tryOnImage: tryOnImageBase64 || (tryOnImage ? tryOnImage.url : null)
      };
      
      console.log('Saving outfit with data:', JSON.stringify(outfitData, null, 2));
      
      const response = await fetch('/api/outfits', {
        method: saveAsNew ? 'POST' : editId ? 'PUT' : 'POST',
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
      
      setSaveSuccess(`Outfit "${name}" ${saveAsNew ? 'saved as new' : editId ? 'updated' : 'saved'} successfully!`);
      
      // If we saved as new, redirect to the new outfit
      if (saveAsNew && data?.outfit?.id) {
        router.push(`/outfit-planner?edit=${data.outfit.id}`);
      }
      
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
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-600 font-medium">Loading your outfit...</p>
        {editId && (
          <p className="text-sm text-gray-500 mt-2">Loading outfit ID: {editId}</p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-lg text-center">
          <p className="font-bold mb-2">Error loading outfit</p>
          <p>{error}</p>
          
          <div className="mt-4">
            <button 
              onClick={() => router.push('/outfit-planner')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
            >
              Create New Outfit
            </button>
            <button 
              onClick={() => router.push('/outfit-planner?tab=saved')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              View Saved Outfits
            </button>
          </div>
        </div>
      </div>
    );
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
          isEditing={!!editId}
          existingName={outfitName || ''}
        />
      </div>
    </div>
  );
}