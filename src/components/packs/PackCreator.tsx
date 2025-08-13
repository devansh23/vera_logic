"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Check, X, Package, Save } from 'lucide-react';
import { toast } from 'react-toastify';

interface Outfit {
  id: string;
  name: string;
  tryOnImage?: string | null;
}

interface WardrobeItem {
  id: string;
  name: string;
  brand: string;
  image: string | null;
  category: string | null;
}

export function PackCreator({ packId }: { packId?: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [selectedOutfitIds, setSelectedOutfitIds] = useState<string[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'outfits' | 'items'>('outfits');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!packId;

  // Fetch existing pack data if editing
  useEffect(() => {
    const fetchPackData = async () => {
      if (packId && session?.user) {
        try {
          const response = await fetch(`/api/packs?id=${packId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch pack data');
          }
          const packData = await response.json();
          
          // Set pack details
          setName(packData.name);
          setDescription(packData.description || '');
          
          // Set selected outfits and items
          const outfitIds = packData.packOutfits.map((po: any) => po.outfitId);
          const itemIds = packData.packItems.map((pi: any) => pi.wardrobeItemId);
          
          setSelectedOutfitIds(outfitIds);
          setSelectedItemIds(itemIds);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load pack data');
          toast.error('Failed to load pack data');
        }
      }
    };
    
    fetchPackData();
  }, [packId, session]);

  // Fetch outfits and wardrobe items
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) return;
      
      setLoading(true);
      try {
        // Fetch outfits
        const outfitsResponse = await fetch('/api/outfits');
        if (!outfitsResponse.ok) {
          throw new Error('Failed to fetch outfits');
        }
        const outfitsData = await outfitsResponse.json();
        setOutfits(outfitsData);
        
        // Fetch wardrobe items
        const wardrobeResponse = await fetch('/api/wardrobe');
        if (!wardrobeResponse.ok) {
          throw new Error('Failed to fetch wardrobe items');
        }
        const wardrobeData = await wardrobeResponse.json();
        setWardrobeItems(wardrobeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [session]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please provide a name for your pack');
      return;
    }
    
    if (selectedOutfitIds.length === 0 && selectedItemIds.length === 0) {
      toast.error('Please add at least one outfit or item to your pack');
      return;
    }
    
    setSaving(true);
    
    try {
      const packData = {
        name: name.trim(),
        description: description.trim() || null,
        outfitIds: selectedOutfitIds,
        wardrobeItemIds: selectedItemIds
      };
      
      let response;
      
      if (isEditing) {
        // Update existing pack
        response = await fetch(`/api/packs`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...packData,
            id: packId
          }),
        });
      } else {
        // Create new pack
        response = await fetch('/api/packs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(packData),
        });
      }
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} pack`);
      }
      
      const result = await response.json();
      
      toast.success(`Pack ${isEditing ? 'updated' : 'created'} successfully`);
      router.push('/packs');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${isEditing ? 'update' : 'create'} pack`);
    } finally {
      setSaving(false);
    }
  };

  const toggleOutfit = (outfitId: string) => {
    setSelectedOutfitIds(prevIds => 
      prevIds.includes(outfitId)
        ? prevIds.filter(id => id !== outfitId)
        : [...prevIds, outfitId]
    );
  };

  const toggleItem = (itemId: string) => {
    setSelectedItemIds(prevIds => 
      prevIds.includes(itemId)
        ? prevIds.filter(id => id !== itemId)
        : [...prevIds, itemId]
    );
  };

  const handleCancel = () => {
    router.push('/packs');
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error}
      </div>
    );
  }

  // Fallback image for items without an image
  const fallbackImage = '/placeholder-clothing.svg';

  return (
    <div className="w-full max-w-none p-8">
      <div className="mb-8">
        <div className="mb-6">
          <label htmlFor="packName" className="block text-sm font-medium text-gray-700 mb-2">
            Pack Name *
          </label>
          <input
            id="packName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
            placeholder="Enter pack name"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="packDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            id="packDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
            placeholder="Add a description for your pack"
            rows={3}
          />
        </div>
      </div>
      
      {/* Selection counts */}
      <div className="flex gap-6 items-center mb-6">
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{selectedOutfitIds.length}</span> outfits selected
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{selectedItemIds.length}</span> items selected
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex">
          <button
            className={`py-3 px-6 font-medium text-sm transition-colors ${
              activeTab === 'outfits'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('outfits')}
          >
            Outfits
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm transition-colors ${
              activeTab === 'items'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('items')}
          >
            Wardrobe Items
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="mb-8">
        {activeTab === 'outfits' ? (
          <div>
            {outfits.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                You don't have any outfits yet. Create outfits first to add them to your pack.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {outfits.map((outfit) => (
                  <div 
                    key={outfit.id} 
                    className={`border-2 rounded-xl p-4 relative cursor-pointer transition-all ${
                      selectedOutfitIds.includes(outfit.id) 
                        ? 'border-gray-900 bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                    }`}
                    onClick={() => toggleOutfit(outfit.id)}
                  >
                    <div className="h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      {outfit.tryOnImage ? (
                        <img
                          src={outfit.tryOnImage}
                          alt={outfit.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = fallbackImage;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-medium truncate text-gray-900">{outfit.name}</h3>
                    
                    {/* Selection indicator */}
                    {selectedOutfitIds.includes(outfit.id) && (
                      <div className="absolute top-3 right-3 bg-gray-900 rounded-full p-1.5">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {wardrobeItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                You don't have any wardrobe items yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {wardrobeItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`border-2 rounded-lg p-3 relative cursor-pointer transition-all ${
                      selectedItemIds.includes(item.id) 
                        ? 'border-gray-900 bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="h-28 bg-gray-100 rounded-md mb-2 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = fallbackImage;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xs font-medium truncate text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{item.brand}</p>
                    
                    {/* Selection indicator */}
                    {selectedItemIds.includes(item.id) && (
                      <div className="absolute top-2 right-2 bg-gray-900 rounded-full p-1">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={handleCancel}
          className="px-6 py-3 border-2 border-[#2d2926] text-[#2d2926] rounded-full hover:bg-[#2d2926] hover:text-[#fdfcfa] transition-colors font-medium"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#2d2926] text-[#fdfcfa] rounded-full hover:bg-[#2d2926]/90 transition-colors flex items-center gap-2 font-medium"
          disabled={saving}
        >
          {saving ? (
            <>Saving...</>
          ) : (
            <>
              <Save size={18} />
              {isEditing ? 'Update Pack' : 'Create Pack'}
            </>
          )}
        </button>
      </div>
    </div>
  );
} 