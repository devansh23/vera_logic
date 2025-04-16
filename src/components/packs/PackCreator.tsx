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
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Pack' : 'Create New Pack'}
        </h1>
        
        <div className="mb-4">
          <label htmlFor="packName" className="block text-sm font-medium text-gray-700 mb-1">
            Pack Name *
          </label>
          <input
            id="packName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter pack name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="packDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="packDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a description for your pack"
            rows={3}
          />
        </div>
      </div>
      
      {/* Selection counts */}
      <div className="flex gap-4 items-center mb-4">
        <div className="text-sm">
          <span className="font-medium">{selectedOutfitIds.length}</span> outfits selected
        </div>
        <div className="text-sm">
          <span className="font-medium">{selectedItemIds.length}</span> items selected
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'outfits'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('outfits')}
          >
            Outfits
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'items'
                ? 'border-b-2 border-blue-500 text-blue-600'
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
              <div className="text-center py-8 text-gray-500">
                You don't have any outfits yet. Create outfits first to add them to your pack.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {outfits.map((outfit) => (
                  <div 
                    key={outfit.id} 
                    className={`border rounded-lg p-3 relative cursor-pointer ${
                      selectedOutfitIds.includes(outfit.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => toggleOutfit(outfit.id)}
                  >
                    <div className="h-32 bg-gray-100 rounded-md mb-2 overflow-hidden">
                      <img
                        src={outfit.tryOnImage || fallbackImage}
                        alt={outfit.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = fallbackImage;
                        }}
                      />
                    </div>
                    <h3 className="text-sm font-medium truncate">{outfit.name}</h3>
                    
                    {/* Selection indicator */}
                    {selectedOutfitIds.includes(outfit.id) && (
                      <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
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
              <div className="text-center py-8 text-gray-500">
                You don't have any wardrobe items yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {wardrobeItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`border rounded-lg p-2 relative cursor-pointer ${
                      selectedItemIds.includes(item.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="h-24 bg-gray-100 rounded-md mb-2 overflow-hidden">
                      <img
                        src={item.image || fallbackImage}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = fallbackImage;
                        }}
                      />
                    </div>
                    <h3 className="text-xs font-medium truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{item.brand}</p>
                    
                    {/* Selection indicator */}
                    {selectedItemIds.includes(item.id) && (
                      <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
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
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
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