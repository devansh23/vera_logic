import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface SavedOutfit {
  id: string;
  name: string;
  createdAt: string;
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
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [outfitToDelete, setOutfitToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const response = await fetch('/api/outfits');
        if (!response.ok) {
          throw new Error('Failed to fetch outfits');
        }
        const data = await response.json();
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {outfits.map((outfit) => (
          <div
            key={outfit.id}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow relative group"
          >
            <h3 className="font-semibold text-lg mb-2">{outfit.name}</h3>
            <p className="text-sm text-gray-500 mb-2">
              Created {new Date(outfit.createdAt).toLocaleDateString()}
            </p>
            <div className="relative h-48 bg-gray-50 rounded-md overflow-hidden">
              <div className="absolute inset-0">
                {outfit.items.map((item, index) => (
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
                    {item.wardrobeItem.image && (
                      <img
                        src={item.wardrobeItem.image}
                        alt={item.wardrobeItem.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setOutfitToDelete(outfit.id)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              aria-label="Delete outfit"
            >
              <Trash2 size={16} />
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
    </>
  );
} 