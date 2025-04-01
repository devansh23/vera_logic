"use client"

import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { useWardrobe } from '@/contexts/WardrobeContext';

export const WardrobeSidebar = () => {
  const { items, categorizedItems } = useWardrobe();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Get categories in sorted order
  const categories = Object.keys(categorizedItems).sort((a, b) => a.localeCompare(b));

  // Filter items based on search query
  const filteredItems = searchQuery.trim() 
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.color && item.color.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  return (
    <div className="w-72 border-r border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Wardrobe Items</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search items..."
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {searchQuery.trim() ? (
          // Show search results
          <div className="p-4">
            <div className="text-sm font-medium text-gray-500 mb-2">
              Search Results ({filteredItems.length})
            </div>
            <div className="grid grid-cols-2 gap-2">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-md p-2 cursor-move hover:border-blue-400 transition-colors"
                  draggable
                  onDragStart={e => handleDragStart(e, item)}
                >
                  <div className="relative pb-[100%]">
                    <img
                      src={item.image || item.imageUrl}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs mt-1 truncate">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Show categories
          <div>
            {categories.map(category => (
              <div key={category} className="border-b border-gray-100">
                <button
                  className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50"
                  onClick={() => toggleCategory(category)}
                >
                  <span className="font-medium">{category}</span>
                  <span className="text-gray-400">
                    {expandedCategories[category] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                </button>
                
                {expandedCategories[category] && (
                  <div className="p-2 grid grid-cols-2 gap-2">
                    {categorizedItems[category]?.map(item => (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-md p-2 cursor-move hover:border-blue-400 transition-colors"
                        draggable
                        onDragStart={e => handleDragStart(e, item)}
                      >
                        <div className="relative pb-[100%]">
                          <img
                            src={item.image || item.imageUrl}
                            alt={item.name}
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs mt-1 truncate">{item.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}; 