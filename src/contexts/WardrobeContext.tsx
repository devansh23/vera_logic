'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { WardrobeItem } from '@/types/outfit';
import { useSession } from 'next-auth/react';
import { categorizeItems } from '@/lib/categorize-items';

// Function to perform deep comparison of arrays
function areItemsEqual(items1: WardrobeItem[], items2: WardrobeItem[]): boolean {
  if (items1.length !== items2.length) return false;
  
  // Create map of items by ID for faster lookup
  const itemMap = new Map();
  items1.forEach(item => itemMap.set(item.id, item));
  
  // Check if all items in items2 match corresponding items in items1
  return items2.every(item2 => {
    const item1 = itemMap.get(item2.id);
    if (!item1) return false;
    
    // Compare all properties
    return Object.keys(item2).every(key => {
      // @ts-ignore - Dynamic property access
      return JSON.stringify(item1[key]) === JSON.stringify(item2[key]);
    });
  });
}

// Define the context type
interface WardrobeContextType {
  items: WardrobeItem[];
  categorizedItems: Record<string, WardrobeItem[]>;
  isLoading: boolean;
  error: string | null;
  refreshItems: () => Promise<void>;
  addItem: (item: WardrobeItem) => Promise<WardrobeItem>;
  removeItem: (id: string) => Promise<void>;
  saveWardrobe: (showMessage?: boolean) => Promise<void>;
  clearWardrobe: () => Promise<void>;
}

// Create the context
const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

// Provider props type
interface WardrobeProviderProps {
  children: ReactNode;
}

// Provider component
export function WardrobeProvider({ children }: WardrobeProviderProps) {
  const { data: session } = useSession();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [categorizedItems, setCategorizedItems] = useState<Record<string, WardrobeItem[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialLoadComplete = useRef(false);
  const loadingRef = useRef(false);

  // Update categorizedItems whenever items change
  useEffect(() => {
    setCategorizedItems(categorizeItems(items));
  }, [items]);

  // Function to load all wardrobe items
  const refreshItems = async () => {
    if (!session?.user?.id) {
      setError('You must be signed in to view your wardrobe');
      return;
    }

    // Prevent concurrent API calls
    if (loadingRef.current) {
      console.log('Skipping duplicate wardrobe load - already in progress');
      return;
    }

    setIsLoading(true);
    loadingRef.current = true;
    setError(null);

    try {
      const response = await fetch('/api/wardrobe');
      if (!response.ok) {
        throw new Error('Failed to fetch wardrobe items');
      }
      
      const data = await response.json();
      setItems(data);
      initialLoadComplete.current = true;
    } catch (error) {
      console.error('Error loading wardrobe:', error);
      setError(error instanceof Error ? error.message : 'Failed to load wardrobe');
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  };

  // Load items when session changes, but only if not already loaded
  useEffect(() => {
    if (session?.user?.id && !initialLoadComplete.current && !loadingRef.current) {
      refreshItems();
    }
  }, [session?.user?.id]);

  // Function to add a new item to the wardrobe
  const addItem = async (item: WardrobeItem): Promise<WardrobeItem> => {
    if (!session?.user?.id) {
      setError('You must be signed in to add items');
      throw new Error('Not signed in');
    }

    setIsLoading(true);
    setError(null);

    try {
      // If item has a productLink that looks like a URL, submit it as a URL
      if (item.productLink && (item.productLink.startsWith('http') || item.productLink.startsWith('/'))) {
        const url = item.productLink;
        const response = await fetch('/api/wardrobe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Server returned non-JSON response:', await response.text());
          throw new Error('Server error: Please try again or check if the development server is running.');
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || errorData.error || 'Failed to add product');
        }
        
        const data = await response.json();
        if (!data.item) {
          throw new Error('Invalid response from server: missing item data');
        }
        setItems(prev => [...prev, data.item]);
        return data.item;
      } else {
        // Otherwise, directly add the item to the items array
        // Make sure we preserve any existing ID rather than generating a temp one
        const newItem = {
          ...item,
          id: item.id && item.id.length > 0 ? item.id : `temp-${Date.now()}`, // Use provided ID if it exists
        };
        setItems(prev => [...prev, newItem]);
        return newItem;
      }
    } catch (error) {
      console.error('Error adding item to wardrobe:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to wardrobe';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove an item from the wardrobe
  const removeItem = async (id: string) => {
    if (!session?.user?.id) {
      setError('You must be signed in to remove items');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/wardrobe?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      await response.json();
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing item from wardrobe:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove item from wardrobe');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save the entire wardrobe state with retry logic
  const saveWardrobe = async (showMessage = true) => {
    if (!session?.user?.id) {
      setError('You must be signed in to save your wardrobe');
      return;
    }

    setIsLoading(true);
    setError(null);

    const maxRetries = 3;
    let retryCount = 0;
    let success = false;

    while (retryCount < maxRetries && !success) {
      try {
        // Make sure all items have IDs before sending to API
        const itemsToSave = items.map(item => {
          if (!item.id || item.id.startsWith('temp-')) {
            // Only regenerate ID if it's a temp ID or missing
            return { ...item, id: item.id || `temp-${Date.now()}` };
          }
          return item;
        });

        // If this is a retry, add a small delay to allow connections to be released
        if (retryCount > 0) {
          console.log(`Retrying save (attempt ${retryCount+1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }

        const response = await fetch('/api/wardrobe/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: itemsToSave }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || 'Failed to save wardrobe');
        }

        const result = await response.json();
        
        // If we got updated items back from the server, only refresh our state if they've actually changed
        if (result.updatedItems) {
          // Only update state if the items have actually changed
          if (!areItemsEqual(items, result.updatedItems)) {
            console.log('Items changed, updating state');
            setItems(result.updatedItems);
          } else {
            console.log('Items unchanged, skipping state update');
          }
        }
        
        if (showMessage) {
          // You can add a toast or notification here if needed
          console.log('Wardrobe saved successfully');
        }
        
        success = true;
        break;
      } catch (error) {
        retryCount++;
        console.error(`Error saving wardrobe (attempt ${retryCount}/${maxRetries}):`, error);
        
        // Only set error if all retries failed
        if (retryCount >= maxRetries) {
          setError(error instanceof Error ? error.message : 'Failed to save wardrobe after multiple attempts');
        }
      }
    }

    setIsLoading(false);
  };

  // Function to clear the entire wardrobe
  const clearWardrobe = async () => {
    if (!session?.user?.id) {
      setError('You must be signed in to clear your wardrobe');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Clear local state first
      setItems([]);
      
      // Then save empty state to backend
      const response = await fetch('/api/wardrobe/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: [] }),
      });

      if (!response.ok) {
        throw new Error('Failed to clear wardrobe');
      }
      
      await response.json();
    } catch (error) {
      console.error('Error clearing wardrobe:', error);
      setError(error instanceof Error ? error.message : 'Failed to clear wardrobe');
    } finally {
      setIsLoading(false);
    }
  };

  // Autosave wardrobe when items change, but only after initial load
  useEffect(() => {
    if (items.length > 0 && initialLoadComplete.current) {
      const timeoutId = setTimeout(() => {
        saveWardrobe(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [items]);

  return (
    <WardrobeContext.Provider
      value={{
        items,
        categorizedItems,
        isLoading,
        error,
        refreshItems,
        addItem,
        removeItem,
        saveWardrobe,
        clearWardrobe,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

// Hook to use the context
export function useWardrobe() {
  const context = useContext(WardrobeContext);
  
  if (!context) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  
  // Memoize the refreshItems function to prevent unnecessary re-renders
  const memoizedRefreshItems = useCallback(() => {
    if (context.isLoading) {
      console.log('Refresh skipped - already loading');
      return;
    }
    return context.refreshItems();
  }, [context.refreshItems, context.isLoading]);
  
  return { 
    ...context,
    refreshItems: memoizedRefreshItems
  };
} 