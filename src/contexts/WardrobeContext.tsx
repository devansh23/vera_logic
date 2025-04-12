'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { WardrobeItem } from '@/types/outfit';
import { useSession } from 'next-auth/react';
import { categorizeItems } from '@/lib/categorize-items';

// Function to perform deep comparison of arrays
function areItemsEqual(items1: WardrobeItem[], items2: WardrobeItem[]): boolean {
  if (items1 === items2) return true; // Same reference = same content
  if (items1.length !== items2.length) return false;
  
  try {
    // Create map of items by ID for faster lookup
    const itemMap = new Map();
    items1.forEach(item => itemMap.set(item.id, item));
    
    // Check if all items in items2 match corresponding items in items1
    return items2.every(item2 => {
      const item1 = itemMap.get(item2.id);
      if (!item1) return false;
      
      // For each property in item2, deep compare with item1
      return Object.keys(item2).every(key => {
        // Skip functions or other non-serializable values
        const val1 = (item1 as any)[key];
        const val2 = (item2 as any)[key];
        
        if (typeof val1 === 'function' || typeof val2 === 'function') {
          return true; // Skip function comparisons
        }
        
        // Use string comparison for deep equality
        return JSON.stringify(val1) === JSON.stringify(val2);
      });
    });
  } catch (e) {
    console.error('Error comparing items:', e);
    return false; // If any error occurs, assume they're different
  }
}

// Function to create a deep copy of an array of wardrobe items
function deepCopyItems(items: WardrobeItem[]): WardrobeItem[] {
  return JSON.parse(JSON.stringify(items));
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
  setAutosaveEnabled: (enabled: boolean) => void;
  autosaveEnabled: boolean;
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
  const lastSavedState = useRef<WardrobeItem[]>([]);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTime = useRef<number>(0);
  const isDirty = useRef<boolean>(false);
  const isAutosaving = useRef<boolean>(false);
  const [autosaveEnabled, setAutosaveEnabled] = useState(false);

  // Update categorizedItems whenever items change
  useEffect(() => {
    setCategorizedItems(categorizeItems(items));
    
    // Mark as dirty only if there's an actual change
    if (items.length > 0 && initialLoadComplete.current) {
      // Only consider it dirty if it's different from last saved state
      const hasChanged = !areItemsEqual(items, lastSavedState.current);
      if (hasChanged && !isAutosaving.current) {
        isDirty.current = true;
        console.log('Items changed - marked as dirty');
      }
    }
  }, [items]);

  // Function to load all wardrobe items
  const refreshItems = async () => {
    if (!session?.user?.id) {
      console.warn('Attempted to refresh wardrobe items without a user session');
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

    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        console.log(`Attempting to fetch wardrobe items (attempt ${retries + 1}/${maxRetries})`);
        const response = await fetch('/api/wardrobe');
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          console.error(`API response error: ${response.status} ${response.statusText}`, errorText);
          throw new Error(`Failed to fetch wardrobe items: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Successfully fetched ${data.length} wardrobe items`);
        
        // Deep copy and update
        const deepCopiedData = deepCopyItems(data);
        lastSavedState.current = deepCopiedData;
        isDirty.current = false; // Items just loaded, not dirty
        isAutosaving.current = false;
        setItems(deepCopiedData);
        initialLoadComplete.current = true;
        break; // Success, exit the retry loop
      } catch (error) {
        retries++;
        console.error(`Error loading wardrobe (attempt ${retries}/${maxRetries}):`, error);
        
        if (retries >= maxRetries) {
          setError(error instanceof Error ? error.message : 'Failed to load wardrobe');
        } else {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
      }
    }

    setIsLoading(false);
    loadingRef.current = false;
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
        
        // Update state and lastSavedState
        const newItems = [...items, data.item];
        setItems(newItems);
        // Don't update lastSavedState here - let autosave handle it
        
        return data.item;
      } else {
        // Otherwise, directly add the item to the items array
        // Make sure we preserve any existing ID rather than generating a temp one
        const newItem = {
          ...item,
          id: item.id && item.id.length > 0 ? item.id : `temp-${Date.now()}`, // Use provided ID if it exists
        };
        
        // Update state but don't update lastSavedState to trigger autosave
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
      
      // Update state but don't update lastSavedState to trigger autosave
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
    
    // Don't save if not dirty or too soon since last save (rate limit)
    if (!isDirty.current) {
      console.log('Skipping save - no changes to save');
      return;
    }
    
    const now = Date.now();
    if (now - lastSaveTime.current < 5000) { // Min 5 seconds between saves
      console.log('Skipping save - too soon since last save');
      return;
    }
    
    // Prevent concurrent saves
    if (isAutosaving.current) {
      console.log('Save already in progress - skipping');
      return;
    }

    setIsLoading(true);
    setError(null);
    isAutosaving.current = true;

    const maxRetries = 3;
    let retryCount = 0;
    let success = false;

    while (retryCount < maxRetries && !success) {
      try {
        // Make a deep copy of items to send
        const itemsToSend = deepCopyItems(items);
        
        console.log('Saving wardrobe with', itemsToSend.length, 'items');
        
        const response = await fetch('/api/wardrobe/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: itemsToSend }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || 'Failed to save wardrobe');
        }

        const result = await response.json();
        
        // Update last save time
        lastSaveTime.current = Date.now();
        isDirty.current = false;
        
        // Only update state if something actually changed from server
        if (result.updatedItems && !areItemsEqual(items, result.updatedItems)) {
          console.log('Server returned changed items - updating state');
          // Create deep copy of returned items
          const deepCopiedItems = deepCopyItems(result.updatedItems);
          // Update last saved state and set items
          lastSavedState.current = deepCopiedItems;
          setItems(deepCopiedItems);
        } else {
          console.log('No changes from server - keeping current state');
          // Still update last saved state with current items
          lastSavedState.current = deepCopyItems(items);
        }
        
        if (showMessage) {
          console.log('Wardrobe saved successfully');
        }
        
        success = true;
      } catch (error) {
        retryCount++;
        console.error(`Error saving wardrobe (attempt ${retryCount}/${maxRetries}):`, error);
        
        if (retryCount >= maxRetries) {
          setError(error instanceof Error ? error.message : 'Failed to save wardrobe after multiple attempts');
        } else {
          // Wait between retries
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
    }

    setIsLoading(false);
    isAutosaving.current = false;
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

  // Periodic autosave check (completely rewritten)
  useEffect(() => {
    if (!autosaveEnabled) return; // Skip if autosave is disabled
    
    const checkAndSaveIfNeeded = () => {
      if (initialLoadComplete.current && isDirty.current && !isAutosaving.current) {
        console.log('Scheduled check found dirty state - saving');
        saveWardrobe(false);
      }
    };
    
    const intervalId = setInterval(checkAndSaveIfNeeded, 10000);
    return () => clearInterval(intervalId);
  }, [autosaveEnabled]);
  
  // Manually run save when items are modified directly (add/remove)
  useEffect(() => {
    if (!autosaveEnabled) return; // Skip if autosave is disabled
    
    if (items.length > 0 && initialLoadComplete.current && isDirty.current && !isAutosaving.current) {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
      
      autosaveTimeoutRef.current = setTimeout(() => {
        const now = Date.now();
        if (now - lastSaveTime.current > 5000) {
          console.log('Debounced save triggered');
          saveWardrobe(false);
        } else {
          console.log('Debounced save skipped - too soon since last save');
        }
      }, 3000);
    }
    
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [items, autosaveEnabled]);

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
        setAutosaveEnabled,
        autosaveEnabled,
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