"use client"

import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useWardrobe } from '@/contexts/WardrobeContext';
import { WardrobeItem } from '@/types/outfit';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const WardrobeSidebar = () => {
  const { items, categorizedItems } = useWardrobe();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on search query
  const filteredItems = searchQuery.trim() 
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.color && item.color.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  // Get categories in sorted order
  const categories = Object.keys(categorizedItems).sort((a, b) => {
    // Put Uncategorized at the end
    if (a === 'Uncategorized') return 1;
    if (b === 'Uncategorized') return -1;
    return a.localeCompare(b);
  });

  const handleDragStart = (e: React.DragEvent, item: WardrobeItem) => {
    console.log('Dragging item with ID:', item.id);
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  return (
    <div className="w-64 h-full flex flex-col gap-2 p-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 text-sm"
        />
      </div>

      {/* Wardrobe items */}
      <ScrollArea className="flex-1">
        {searchQuery.trim() ? (
          // Show search results
          <div className="space-y-2">
            <h3 className="font-medium px-2 text-sm">Search Results ({filteredItems.length})</h3>
            <div className="grid grid-cols-2 gap-1 px-1">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="relative cursor-move rounded-md overflow-hidden border bg-popover hover:bg-accent hover:text-accent-foreground"
                  style={{ aspectRatio: '1/1' }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground p-1">
                      {item.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Show categorized items
          <Accordion type="multiple" defaultValue={categories} className="space-y-1">
            {categories.map((category) => (
              <AccordionItem key={category} value={category} className="border-b-0">
                <AccordionTrigger className="text-sm hover:no-underline py-2 px-2">
                  {category} ({categorizedItems[category].length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-1 p-1">
                    {categorizedItems[category].map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="relative cursor-move rounded-md overflow-hidden border bg-popover hover:bg-accent hover:text-accent-foreground"
                        style={{ aspectRatio: '1/1' }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground p-1">
                            {item.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </ScrollArea>
    </div>
  );
};
