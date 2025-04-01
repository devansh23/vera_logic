'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WardrobeItem } from '@/types/outfit';
import { useSession } from 'next-auth/react';

// Define the context type
interface WardrobeContextType {
  items: WardrobeItem[];
  isLoading: boolean;
  error: string | null;
  refreshItems: () => Promise<void>;
  addItem: (item: WardrobeItem) => Promise<WardrobeItem>;
  removeItem: (id: string) => Promise<void>;
  saveWardrobe: (showMessage?: boolean) => Promise<void>;
  clearWardrobe: () => Promise<void>;
  categorizedItems: Record<string, WardrobeItem[]>;
}

// Create the context with a default value
const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

// Hook to use the context
export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (context === undefined) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
}

interface WardrobeProviderProps {
  children: ReactNode;
}

export function WardrobeProvider({ children }: WardrobeProviderProps) {
  const { data: session } = useSession();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [categorizedItems, setCategorizedItems] = useState<Record<string, WardrobeItem[]>>({});

  // Load wardrobe items when session changes
  useEffect(() => {
    if (session?.user?.id) {
      refreshItems();
    }
  }, [session?.user?.id]);

  // Categorize items whenever they change
  useEffect(() => {
    setCategorizedItems(categorizeItems(items));
  }, [items]);

  // Autosave effect - triggers save whenever items change
  useEffect(() => {
    // Don't save if there are no items or no session
    if (!items.length || !session?.user?.id) return;
    
    // Clear any existing timeout to prevent multiple saves
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    // Set a new timeout to save after a short delay (debounce)
    const timeout = setTimeout(() => {
      saveWardrobe(false); // false means don't show success message for routine autosaves
    }, 1500); // 1.5 second delay
    
    setAutoSaveTimeout(timeout);
    
    // Cleanup function to clear timeout if component unmounts
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [items]);

  // Function to load all wardrobe items
  const refreshItems = async () => {
    if (!session?.user?.id) {
      setError('You must be signed in to access your wardrobe');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wardrobe');
      if (!response.ok) {
        throw new Error('Failed to load wardrobe');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error loading wardrobe:', error);
      setError(error instanceof Error ? error.message : 'Failed to load your wardrobe');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a new item to the wardrobe
  const addItem = async (item: WardrobeItem): Promise<WardrobeItem> => {
    if (!session?.user?.id) {
      throw new Error('You must be signed in to add items to your wardrobe');
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

        if (!response.ok) {
          throw new Error('Failed to add product');
        }
        
        const data = await response.json();
        setItems(prev => [...prev, data]);
        return data;
      } else {
        // Otherwise, directly add the item to the items array
        // This would normally make an API call to add the item to the database
        // For now, just add it locally
        const newItem = {
          ...item,
          id: item.id || `temp-${Date.now()}`, // Use provided ID or generate a temporary one
        };
        setItems(prev => [...prev, newItem]);
        return newItem;
      }
    } catch (error) {
      console.error('Error adding item to wardrobe:', error);
      setError(error instanceof Error ? error.message : 'Failed to add item to wardrobe');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove an item from the wardrobe
  const removeItem = async (id: string): Promise<void> => {
    if (!session?.user?.id) {
      throw new Error('You must be signed in to remove items from your wardrobe');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/wardrobe?id=${id}`, {
        method: 'DELETE',
      });

      // Even if the item is not found (404), we should still remove it from local state
      // since it means it's already not in the database
      if (!response.ok && response.status !== 404) {
        throw new Error('Failed to remove item');
      }

      // Update local state immediately after successful deletion
      setItems(prev => prev.filter(item => item.id !== id));
      
      // Only trigger a save if the delete was successful (not 404)
      if (response.ok) {
        await saveWardrobe(false);
      }
    } catch (error) {
      console.error('Error removing item from wardrobe:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove item from wardrobe');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save the entire wardrobe state
  const saveWardrobe = async (showMessage = true) => {
    if (!session?.user?.id) {
      setError('You must be signed in to save your wardrobe');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wardrobe/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to save wardrobe');
      }
      
      await response.json();
    } catch (error) {
      console.error('Error saving wardrobe:', error);
      setError(error instanceof Error ? error.message : 'Failed to save your wardrobe');
    } finally {
      setIsLoading(false);
    }
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
      setError(error instanceof Error ? error.message : 'Failed to clear your wardrobe');
      // Restore items if save failed
      await refreshItems();
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to categorize items by their category field
  const categorizeItems = (items: WardrobeItem[]): Record<string, WardrobeItem[]> => {
    const categorized: Record<string, WardrobeItem[]> = {};
    
    items.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(item);
    });
    
    return categorized;
  };

  return (
    <WardrobeContext.Provider
      value={{
        items,
        isLoading,
        error,
        refreshItems,
        addItem,
        removeItem,
        saveWardrobe,
        clearWardrobe,
        categorizedItems,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
} 