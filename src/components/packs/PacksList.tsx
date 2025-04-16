"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Package } from 'lucide-react';
import { toast } from 'react-toastify';

interface PackOutfit {
  id: string;
  outfitId: string;
  outfit: {
    id: string;
    name: string;
    tryOnImage?: string | null;
  };
}

interface PackItem {
  id: string;
  wardrobeItemId: string;
  wardrobeItem: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface Pack {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  packOutfits: PackOutfit[];
  packItems: PackItem[];
}

export function PacksList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [packToDelete, setPackToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await fetch('/api/packs');
        if (!response.ok) {
          throw new Error('Failed to fetch packs');
        }
        const data = await response.json();
        setPacks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load packs');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchPacks();
    }
  }, [session]);

  // Fallback image for items without an image
  const fallbackImage = '/placeholder-clothing.svg';

  const handleDelete = async (packId: string) => {
    try {
      const response = await fetch(`/api/packs?id=${packId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete pack');
      }

      setPacks(packs.filter(pack => pack.id !== packId));
      toast.success('Pack deleted successfully');
    } catch (err) {
      toast.error('Failed to delete pack');
      console.error('Error deleting pack:', err);
    } finally {
      setPackToDelete(null);
    }
  };

  const handleViewPack = (packId: string) => {
    // Navigate to the pack detail page
    router.push(`/packs/${packId}`);
  };

  const handleCreatePack = () => {
    // Navigate to the create pack page
    router.push('/packs/new');
  };

  if (loading) {
    return <div className="text-center py-4">Loading packs...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error loading packs: {error}
      </div>
    );
  }

  return (
    <>
      <div className="my-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Packs</h2>
        <button
          onClick={handleCreatePack}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={18} /> New Pack
        </button>
      </div>

      {packs.length === 0 ? (
        <div className="text-gray-500 text-center py-12 border-2 border-dashed rounded-lg">
          <Package className="mx-auto mb-4" size={48} />
          <p className="text-lg">You don't have any packs yet.</p>
          <p className="mb-4">Create a pack to organize your outfits for trips and events.</p>
          <button
            onClick={handleCreatePack}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create Your First Pack
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow relative group cursor-pointer"
              onClick={() => handleViewPack(pack.id)}
            >
              <h3 className="font-semibold text-lg mb-2">{pack.name}</h3>
              {pack.description && (
                <p className="text-sm text-gray-700 mb-2">{pack.description}</p>
              )}
              <p className="text-sm text-gray-500 mb-2">
                Created {new Date(pack.createdAt).toLocaleDateString()}
              </p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="text-sm font-medium text-gray-600">
                  {pack.packOutfits.length} Outfits
                </div>
                <span className="text-gray-400">•</span>
                <div className="text-sm font-medium text-gray-600">
                  {pack.packItems.length} Items
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {/* Preview of outfits */}
                {pack.packOutfits.slice(0, 3).map((packOutfit) => (
                  <div 
                    key={packOutfit.id} 
                    className="w-16 h-16 rounded overflow-hidden bg-gray-100"
                  >
                    <img
                      src={packOutfit.outfit.tryOnImage || fallbackImage}
                      alt={packOutfit.outfit.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = fallbackImage;
                      }}
                    />
                  </div>
                ))}
                
                {/* Preview of items */}
                {pack.packItems.slice(0, 3 - Math.min(3, pack.packOutfits.length)).map((packItem) => (
                  <div 
                    key={packItem.id} 
                    className="w-16 h-16 rounded overflow-hidden bg-gray-100"
                  >
                    <img
                      src={packItem.wardrobeItem.image || fallbackImage}
                      alt={packItem.wardrobeItem.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = fallbackImage;
                      }}
                    />
                  </div>
                ))}
                
                {/* Show count if there are more than 6 items total */}
                {(pack.packOutfits.length + pack.packItems.length > 6) && (
                  <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      +{pack.packOutfits.length + pack.packItems.length - 6}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent onClick
                  setPackToDelete(pack.id);
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Delete pack"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      {packToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Pack?</h3>
            <p className="mb-6">
              Are you sure you want to delete this pack? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPackToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(packToDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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