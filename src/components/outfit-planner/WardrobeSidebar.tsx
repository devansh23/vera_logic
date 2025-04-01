import React, { useState, useEffect } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WardrobeItem } from "@/types/outfit";

type WardrobeSidebarProps = {
  items: WardrobeItem[];
  onItemSelect?: (item: WardrobeItem) => void;
};

export const WardrobeSidebar = ({ items, onItemSelect }: WardrobeSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Define clothing categories and their keywords
  const categoryKeywords = {
    "T-Shirts": ["t-shirt", "tshirt", "tee"],
    "Casual Shirts": ["casual shirt", "shirt"],
    "Formal Shirts": ["formal shirt", "dress shirt"],
    "Jeans": ["jeans", "denim"],
    "Trousers": ["trousers", "pants", "chinos"],
    "Shorts": ["shorts"],
    "Dresses": ["dress", "gown"],
    "Skirts": ["skirt"],
    "Sweaters": ["sweater", "jumper", "pullover"],
    "Jackets": ["jacket", "coat", "blazer"],
    "Shoes": ["shoes", "sneakers", "boots", "sandals"],
    "Accessories": ["accessory", "accessories", "belt", "tie", "scarf"]
  };

  // Function to determine item category based on name and existing category
  const getItemCategory = (item: WardrobeItem): string => {
    // If item has a valid category that matches our predefined categories, use it
    if (item.category && Object.keys(categoryKeywords).includes(item.category)) {
      return item.category;
    }

    // Check item name and description against category keywords
    const itemText = `${item.name.toLowerCase()} ${item.description?.toLowerCase() || ''} ${item.brand?.toLowerCase() || ''}`;
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => itemText.includes(keyword))) {
        return category;
      }
    }

    // If no category matches, use the item's original category or "Uncategorized"
    return item.category || "Uncategorized";
  };

  // Get unique categories and count items in each
  const categories = items.reduce<{[key: string]: WardrobeItem[]}>(
    (acc, item) => {
      const category = getItemCategory(item);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, 
    {}
  );

  // Filter items based on search term
  const filteredCategories = searchTerm 
    ? Object.keys(categories).reduce<{[key: string]: WardrobeItem[]}>(
        (acc, category) => {
          const filteredItems = categories[category].filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filteredItems.length) {
            acc[category] = filteredItems;
          }
          return acc;
        }, 
        {}
      )
    : categories;
    
  const handleDragStart = (e: React.DragEvent, item: WardrobeItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  // Update expanded categories when search term changes
  useEffect(() => {
    const newExpandedCategories = searchTerm
      ? Object.keys(filteredCategories)
      : [];
      
    // Only update if the categories have actually changed
    if (JSON.stringify(newExpandedCategories.sort()) !== JSON.stringify(expandedCategories.sort())) {
      setExpandedCategories(newExpandedCategories);
    }
  }, [searchTerm]); // Only depend on searchTerm, not filteredCategories

  const handleItemClick = (item: WardrobeItem) => {
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  return (
    <div className="w-72 border-r bg-gray-50 flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium mb-2">Your Wardrobe</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <Accordion 
          type="multiple" 
          value={expandedCategories}
          onValueChange={setExpandedCategories}
          className="w-full"
        >
          {Object.keys(filteredCategories).sort().map((category) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="px-4 py-2 text-sm font-medium">
                {category} ({filteredCategories[category].length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2 p-2">
                  {filteredCategories[category].map((item) => (
                    <div 
                      key={item.id}
                      className="relative cursor-pointer hover:opacity-80 transition-opacity"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="rounded overflow-hidden border border-gray-200 bg-white">
                        <img 
                          src={item.image || item.imageUrl} 
                          alt={item.name}
                          className="w-full h-20 object-cover"
                        />
                      </div>
                      <p className="text-xs text-center mt-1 truncate px-1">{item.name}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
};

export default WardrobeSidebar;
