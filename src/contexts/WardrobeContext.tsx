'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WardrobeItem } from '@/types/outfit';
import { useSession } from 'next-auth/react';
import { categorizeItems } from '@/lib/categorize-items';

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

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wardrobe');
      if (!response.ok) {
        throw new Error('Failed to fetch wardrobe items');
      }
      
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error loading wardrobe:', error);
      setError(error instanceof Error ? error.message : 'Failed to load wardrobe');
    } finally {
      setIsLoading(false);
    }
  };

  // Load items when session changes
  useEffect(() => {
    if (session?.user?.id) {
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

        if (!response.ok) {
          throw new Error('Failed to add product');
        }
        
        const data = await response.json();
        setItems(prev => [...prev, data]);
        return data;
      } else {
        // Otherwise, directly add the item to the items array
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
      if (showMessage) {
        // You can add a toast or notification here if needed
        console.log('Wardrobe saved successfully');
      }
    } catch (error) {
      console.error('Error saving wardrobe:', error);
      setError(error instanceof Error ? error.message : 'Failed to save wardrobe');
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
      setError(error instanceof Error ? error.message : 'Failed to clear wardrobe');
    } finally {
      setIsLoading(false);
    }
  };

  // Autosave wardrobe when items change
  useEffect(() => {
    if (items.length > 0) {
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

// Custom hook to use the wardrobe context
export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (context === undefined) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
} 