'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { OutfitCanvas } from '@/components/outfit-planner/OutfitCanvas';
import { OutfitCalendar } from '@/components/outfit-planner/OutfitCalendar';
import { OutfitControls } from '@/components/outfit-planner/OutfitControls';
import { WardrobeSidebar } from '@/components/outfit-planner/WardrobeSidebar';
import { WardrobeItem } from '@/types/outfit';

interface CanvasItem extends WardrobeItem {
  left: number;
  top: number;
}

interface Outfit {
  id: string;
  name: string;
  items: {
    id: string;
    left: number;
    top: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  outfitId: string;
  outfit: Outfit;
}

export default function OutfitPlannerPage() {
  const { data: session } = useSession();
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [outfitItems, setOutfitItems] = useState<CanvasItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch wardrobe items
  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/wardrobe')
        .then((res) => res.json())
        .then((data) => {
          setWardrobeItems(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading wardrobe:', err);
          setError('Failed to load wardrobe items');
          setLoading(false);
        });
    }
  }, [session?.user?.id]);

  // Fetch outfits
  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/outfits')
        .then((res) => res.json())
        .then((data) => {
          setOutfits(data);
        })
        .catch((err) => {
          console.error('Error loading outfits:', err);
          setError('Failed to load outfits');
        });
    }
  }, [session?.user?.id]);

  // Fetch calendar events
  useEffect(() => {
    if (session?.user?.id) {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      fetch(
        `/api/calendar-events?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      )
        .then((res) => res.json())
        .then((data) => {
          setEvents(data);
        })
        .catch((err) => {
          console.error('Error loading calendar events:', err);
          setError('Failed to load calendar events');
        });
    }
  }, [session?.user?.id]);

  const handleSaveOutfit = async (name: string, items: any[]) => {
    try {
      const response = await fetch('/api/outfits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          items,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save outfit');
      }

      const newOutfit = await response.json();
      setOutfits((prev) => [...prev, newOutfit]);
    } catch (error) {
      console.error('Error saving outfit:', error);
      setError('Failed to save outfit');
    }
  };

  const handleScheduleOutfit = async (
    outfitId: string,
    date: Date,
    title: string
  ) => {
    try {
      const response = await fetch('/api/calendar-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outfitId,
          date: date.toISOString(),
          title,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule outfit');
      }

      const newEvent = await response.json();
      setEvents((prev) => [...prev, newEvent]);
    } catch (error) {
      console.error('Error scheduling outfit:', error);
      setError('Failed to schedule outfit');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex">
        {/* Left sidebar with wardrobe items */}
        <WardrobeSidebar 
          items={wardrobeItems} 
          onItemSelect={(item: WardrobeItem) => {
            // Create a new canvas item at a default position
            const canvasItem: CanvasItem = {
              ...item,
              left: 50,  // Default x position
              top: 50    // Default y position
            };
            // Add the item to the canvas
            setOutfitItems(prev => [...prev, canvasItem]);
          }}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col p-4">
          {/* Outfit canvas */}
          <div className="flex-1">
            <OutfitCanvas 
              items={outfitItems}
              onSave={handleSaveOutfit}
              onUpdateItems={setOutfitItems}
            />
          </div>

          {/* Controls and calendar */}
          <div className="h-64 mt-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <OutfitControls
                  outfits={outfits}
                  onSchedule={handleScheduleOutfit}
                />
              </div>
              <div className="flex-1">
                <OutfitCalendar events={events} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 