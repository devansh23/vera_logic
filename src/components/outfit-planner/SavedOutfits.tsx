import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface SavedOutfit {
  id: string;
  name: string;
  createdAt: string;
  tryOnImage?: string | null;
  items: {
    wardrobeItem: {
      image: string;
      name: string;
    };
    left: number;
    top: number;
    width: number;
    height: number;
  }[];
}

export function SavedOutfits() {
  const { data: session } = useSession();
  const router = useRouter();
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [outfitToDelete, setOutfitToDelete] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<SavedOutfit | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const response = await fetch('/api/outfits');
        if (!response.ok) {
          throw new Error('Failed to fetch outfits');
        }
        const data = await response.json();
        // The API may omit items for performance; we'll handle that gracefully in the UI
        setOutfits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load outfits');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchOutfits();
    }
  }, [session]);

  // Fallback image for items without an image
  const fallbackImage = '/placeholder-clothing.svg';

  const handleDelete = async (outfitId: string) => {
    try {
      const response = await fetch(`/api/outfits?id=${outfitId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete outfit');
      }

      setOutfits(outfits.filter(outfit => outfit.id !== outfitId));
      toast.success('Outfit deleted successfully');
    } catch (err) {
      toast.error('Failed to delete outfit');
      console.error('Error deleting outfit:', err);
    } finally {
      setOutfitToDelete(null);
    }
  };

  const handleEditOutfit = (outfitId: string) => {
    console.log('Navigating to outfit:', outfitId);
    
    // Create the target URL with the edit parameter
    const targetUrl = `/outfit-planner?edit=${outfitId}`;
    console.log('Navigation target URL:', targetUrl);
    
    // Force a full page navigation instead of client-side routing
    // This helps ensure the OutfitPlanner component is fully remounted
    if (typeof window !== 'undefined') {
      console.log('Using window.location for navigation');
      window.location.href = targetUrl;
    } else {
      // Fall back to Next.js router if window is not available
      router.push(targetUrl);
    }
  };

  const handleScheduleClick = (e: React.MouseEvent, outfit: SavedOutfit) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setSelectedOutfit(outfit);
    setShowScheduleModal(true);
  };

  const scheduleOutfit = async () => {
    if (!session?.user || !selectedOutfit || !selectedDate) return;
    
    try {
      const response = await fetch('/api/calendar-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: selectedOutfit.name,
          date: selectedDate.toISOString(),
          outfitId: selectedOutfit.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule outfit');
      }
      
      toast.success('Outfit scheduled successfully');
      setShowScheduleModal(false);
      setSelectedOutfit(null);
    } catch (err) {
      toast.error('Failed to schedule outfit');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading saved outfits...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error loading outfits: {error}
      </div>
    );
  }

  if (outfits.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No saved outfits yet. Create and save an outfit to see it here!
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-3 overflow-hidden">
        {outfits.map((outfit) => (
          <div
            key={outfit.id}
            className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow relative group cursor-pointer"
            onClick={() => handleEditOutfit(outfit.id)}
          >
            <h3 className="font-semibold text-lg mb-1">{outfit.name}</h3>
            <p className="text-sm text-gray-500 mb-1">
              Created {new Date(outfit.createdAt).toLocaleDateString()}
            </p>
            <div className="relative h-40 bg-gray-50 rounded-md overflow-hidden">
              {outfit.tryOnImage ? (
                <img
                  src={outfit.tryOnImage}
                  alt={`${outfit.name} preview`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImage;
                  }}
                />
              ) : Array.isArray((outfit as any).items) && (outfit as any).items.length > 0 ? (
                <div className="absolute inset-0">
                  {(outfit as any).items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="absolute"
                      style={{
                        left: `${item.left}px`,
                        top: `${item.top}px`,
                        width: `${item.width}px`,
                        height: `${item.height}px`,
                      }}
                    >
                      <img
                        src={item.wardrobeItem?.image || fallbackImage}
                        alt={item.wardrobeItem?.name || 'Clothing item'}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== fallbackImage) {
                            target.src = fallbackImage;
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <img
                  src={fallbackImage}
                  alt={`${outfit.name} preview placeholder`}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent onClick
                setOutfitToDelete(outfit.id);
              }}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              aria-label="Delete outfit"
            >
              <Trash2 size={16} />
            </button>
            
            {/* Schedule button */}
            <button
              onClick={(e) => handleScheduleClick(e, outfit)}
              className="absolute top-2 right-12 p-2 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
              aria-label="Schedule outfit"
            >
              <Calendar size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {outfitToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Outfit</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this outfit? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOutfitToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => outfitToDelete && handleDelete(outfitToDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && selectedOutfit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Schedule "{selectedOutfit.name}"</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input 
                type="date"
                className="w-full p-2 border rounded-md"
                value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedOutfit(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={scheduleOutfit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 