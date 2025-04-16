"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, ArrowLeft, Package } from 'lucide-react';
import { toast } from 'react-toastify';

interface PackOutfit {
  id: string;
  outfitId: string;
  outfit: {
    id: string;
    name: string;
    tryOnImage?: string | null;
    items: {
      wardrobeItem: {
        name: string;
        image: string | null;
      };
    }[];
  };
}

interface PackItem {
  id: string;
  wardrobeItemId: string;
  wardrobeItem: {
    id: string;
    name: string;
    brand: string;
    image: string | null;
    category: string | null;
    price: string | null;
    color: string | null;
  };
}

interface Pack {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  packOutfits: PackOutfit[];
  packItems: PackItem[];
}

export function PackDetail({ packId }: { packId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteOutfitConfirm, setShowDeleteOutfitConfirm] = useState<string | null>(null);
  const [showDeleteItemConfirm, setShowDeleteItemConfirm] = useState<string | null>(null);
  const [showDeletePackConfirm, setShowDeletePackConfirm] = useState(false);

  useEffect(() => {
    const fetchPack = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch(`/api/packs?id=${packId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch pack');
        }
        const data = await response.json();
        setPack(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pack');
      } finally {
        setLoading(false);
      }
    };

    fetchPack();
  }, [packId, session]);

  const handleEditPack = () => {
    router.push(`/packs/${packId}/edit`);
  };

  const handleBack = () => {
    router.push('/packs');
  };

  const handleRemoveOutfit = async (outfitId: string) => {
    try {
      const response = await fetch(`/api/packs/${packId}/outfits?outfitId=${outfitId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove outfit from pack');
      }

      // Update local state
      setPack((prevPack) => {
        if (!prevPack) return null;
        
        return {
          ...prevPack,
          packOutfits: prevPack.packOutfits.filter(
            (po) => po.outfitId !== outfitId
          ),
        };
      });

      toast.success('Outfit removed from pack');
    } catch (err) {
      toast.error('Failed to remove outfit from pack');
    } finally {
      setShowDeleteOutfitConfirm(null);
    }
  };

  const handleRemoveItem = async (wardrobeItemId: string) => {
    try {
      const response = await fetch(`/api/packs/${packId}/items?wardrobeItemId=${wardrobeItemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from pack');
      }

      // Update local state
      setPack((prevPack) => {
        if (!prevPack) return null;
        
        return {
          ...prevPack,
          packItems: prevPack.packItems.filter(
            (pi) => pi.wardrobeItemId !== wardrobeItemId
          ),
        };
      });

      toast.success('Item removed from pack');
    } catch (err) {
      toast.error('Failed to remove item from pack');
    } finally {
      setShowDeleteItemConfirm(null);
    }
  };

  const handleDeletePack = async () => {
    try {
      const response = await fetch(`/api/packs?id=${packId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete pack');
      }

      toast.success('Pack deleted successfully');
      router.push('/packs');
    } catch (err) {
      toast.error('Failed to delete pack');
    } finally {
      setShowDeletePackConfirm(false);
    }
  };

  const handleViewOutfit = (outfitId: string) => {
    router.push(`/outfit-planner?edit=${outfitId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading pack details...</div>;
  }

  if (error || !pack) {
    return (
      <div className="text-red-500 text-center py-8">
        {error || 'Pack not found'}
      </div>
    );
  }

  // Fallback image for items without an image
  const fallbackImage = '/placeholder-clothing.svg';

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          onClick={handleBack}
          className="mr-4 text-gray-600 hover:text-gray-900"
          aria-label="Back to packs"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold flex-1">{pack.name}</h1>
        <div className="flex gap-2">
          <button
            onClick={handleEditPack}
            className="p-2 text-blue-600 hover:text-blue-800"
            aria-label="Edit pack"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={() => setShowDeletePackConfirm(true)}
            className="p-2 text-red-500 hover:text-red-700"
            aria-label="Delete pack"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Pack info */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        {pack.description && (
          <p className="text-gray-700 mb-4">{pack.description}</p>
        )}
        <div className="flex gap-4 text-sm text-gray-600">
          <div>Created: {new Date(pack.createdAt).toLocaleDateString()}</div>
          <div>Last updated: {new Date(pack.updatedAt).toLocaleDateString()}</div>
          <div>{pack.packOutfits.length} outfits</div>
          <div>{pack.packItems.length} individual items</div>
        </div>
      </div>

      {/* Outfits section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Outfits</h2>
        {pack.packOutfits.length === 0 ? (
          <div className="text-gray-500 text-center py-4 border rounded-lg">
            No outfits added to this pack yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pack.packOutfits.map((packOutfit) => (
              <div
                key={packOutfit.id}
                className="border rounded-lg p-4 bg-white shadow-sm relative group"
              >
                <div 
                  className="h-48 bg-gray-100 rounded-md mb-3 overflow-hidden cursor-pointer"
                  onClick={() => handleViewOutfit(packOutfit.outfit.id)}
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
                <h3 className="font-medium">{packOutfit.outfit.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {packOutfit.outfit.items.length} items
                </p>
                
                {/* Remove button */}
                <button
                  onClick={() => setShowDeleteOutfitConfirm(packOutfit.outfitId)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remove outfit from pack"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Individual items section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Individual Items</h2>
        {pack.packItems.length === 0 ? (
          <div className="text-gray-500 text-center py-4 border rounded-lg">
            No individual items added to this pack yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pack.packItems.map((packItem) => (
              <div
                key={packItem.id}
                className="border rounded-lg p-3 bg-white shadow-sm relative group"
              >
                <div className="h-36 bg-gray-100 rounded-md mb-2 overflow-hidden">
                  <img
                    src={packItem.wardrobeItem.image || fallbackImage}
                    alt={packItem.wardrobeItem.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackImage;
                    }}
                  />
                </div>
                <h3 className="text-sm font-medium truncate">{packItem.wardrobeItem.name}</h3>
                <p className="text-xs text-gray-500 truncate">{packItem.wardrobeItem.brand}</p>
                
                {/* Remove button */}
                <button
                  onClick={() => setShowDeleteItemConfirm(packItem.wardrobeItemId)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remove item from pack"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete outfit confirmation dialog */}
      {showDeleteOutfitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Remove Outfit?</h3>
            <p className="mb-6">
              Are you sure you want to remove this outfit from the pack?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteOutfitConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveOutfit(showDeleteOutfitConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete item confirmation dialog */}
      {showDeleteItemConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Remove Item?</h3>
            <p className="mb-6">
              Are you sure you want to remove this item from the pack?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteItemConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveItem(showDeleteItemConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete pack confirmation dialog */}
      {showDeletePackConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Pack?</h3>
            <p className="mb-6">
              Are you sure you want to delete this entire pack? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeletePackConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePack}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 