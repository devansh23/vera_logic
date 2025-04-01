'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface WardrobeItem {
  id: string;
  name: string;
  image: string;
  category?: string;
  brand?: string;
  description?: string;
}

interface OutfitPlannerProps {
  wardrobeItems: WardrobeItem[];
}

// Define clothing categories following Myntra's official structure
const categoryKeywords: Record<string, string[]> = {
  // ====== MEN'S TOPWEAR ======
  'T-Shirts': ['t-shirt', 't shirts', 't-shirts', 't shirt', 'tshirt', 'tshirts', 'tee', 'tees', 'men t-shirt', 'men tee', 'men t-shirts', 'tops'],
  'Casual Shirts': ['casual shirt', 'casual shirts', 'linen shirt', 'linen shirts', 'denim shirt', 'denim shirts', 'oxford shirt', 'oxford shirts', 'chambray shirt', 'chambray shirts', 'men casual shirt', 'men casual shirts', 'shirts'],
  'Formal Shirts': ['formal shirt', 'formal shirts', 'dress shirt', 'dress shirts', 'business shirt', 'business shirts', 'office shirt', 'office shirts', 'men formal shirt', 'men formal shirts'],
  'Sweatshirts': ['sweatshirt', 'sweatshirts', 'pullover sweat', 'hooded sweatshirt', 'hooded sweatshirts', 'men sweatshirt', 'men sweatshirts', 'hoodie'],
  'Sweaters': ['sweater', 'sweaters', 'pullover', 'pullovers', 'cardigan', 'cardigans', 'jumper', 'jumpers', 'knit', 'knits', 'men sweater', 'men sweaters'],
  'Jackets': ['jacket', 'jackets', 'bomber', 'bombers', 'trucker jacket', 'trucker jackets', 'denim jacket', 'denim jackets', 'zip-up jacket', 'zip-up jackets', 'men jacket', 'men jackets', 'coats'],
  'Blazers & Coats': ['blazer', 'blazers', 'coat', 'coats', 'sports coat', 'sports coats', 'suit jacket', 'suit jackets', 'overcoat', 'overcoats', 'trench coat', 'trench coats', 'men blazer', 'men blazers', 'men coat', 'men coats', 'suits'],
  'Overshirts': ['overshirt', 'overshirts', 'shacket', 'shackets', 'men overshirt', 'men overshirts'],
  'Mens Jeans': ['jeans', 'denim jean', 'denim jeans', 'jean', 'men jeans', 'men jean'],
  'Casual Trousers': ['casual trouser', 'casual trousers', 'chinos', 'khakis', 'casual pant', 'casual pants', 'men casual trouser', 'men casual trousers', 'men chinos', 'trousers'],
  'Mens Shorts': ['short', 'shorts', 'bermuda', 'bermudas', 'cargo short', 'cargo shorts', 'denim short', 'denim shorts', 'men short', 'men shorts'],
  'Track Pants & Joggers': ['track pant', 'track pants', 'jogger', 'joggers', 'trackpant', 'trackpants', 'track bottom', 'track bottoms', 'athletic pant', 'athletic pants', 'sweatpant', 'sweatpants', 'drawstring pant', 'drawstring pants', 'dressy jogger', 'dressy joggers', 'men jogger', 'men joggers'],
  'Womens Tops': ['women top', 'women tops', 'ladies top', 'ladies tops', 'fashion top', 'fashion tops', 'crop top', 'crop tops', 'camisole', 'camisoles', 'women blouse', 'women blouses', 'ladies blouse', 'ladies blouses', 'women shirt', 'women shirts', 'ladies shirt', 'ladies shirts', 'tops'],
  'Dresses': ['dress', 'dresses', 'gown', 'gowns', 'maxi', 'maxis', 'midi dress', 'midi dresses', 'a-line dress', 'a-line dresses', 'bodycon', 'bodycons', 'shift dress', 'shift dresses', 'women dress', 'women dresses'],
  'Womens Jeans': ['women jeans', 'ladies jeans', 'skinny jeans', 'boyfriend jeans', 'straight leg jeans', 'women denim'],
  'Trousers & Capris': ['trouser', 'trousers', 'capri', 'capris', 'cropped pant', 'cropped pants', 'cigarette pant', 'cigarette pants', 'culottes', 'women trouser', 'women trousers', 'ladies pant', 'ladies pants'],
  'Shorts & Skirts': ['women short', 'women shorts', 'ladies short', 'ladies shorts', 'mini skirt', 'mini skirts', 'midi skirt', 'midi skirts', 'maxi skirt', 'maxi skirts', 'denim skirt', 'denim skirts', 'pleated skirt', 'pleated skirts'],
  'Rain Jackets': ['rain jacket', 'rain jackets', 'raincoat', 'raincoats', 'waterproof jacket', 'waterproof jackets', 'windcheater', 'windcheaters', 'men rain jacket', 'men rain jackets'],
  'Mens Sleepwear & Loungewear': ['sleepwear', 'loungewear', 'pajama', 'pajamas', 'pyjama', 'pyjamas', 'lounge pant', 'lounge pants', 'night suit', 'night suits', 'night dress', 'night dresses', 'sleep shirt', 'sleep shirts', 'men sleepwear', 'lounge short', 'lounge shorts', 'sleep short', 'sleep shorts', 'night short', 'night shorts'],
  'Womens Sleepwear': ['women sleepwear', 'nightdress', 'nightdresses', 'nightgown', 'nightgowns', 'pajama set', 'pajama sets', 'women loungewear', 'lounge pant women', 'lounge pants women'],
  'Womens Swimwear': ['women swimwear', 'swimsuit', 'swimsuits', 'bikini', 'bikinis', 'one piece', 'one pieces', 'swimming costume', 'swimming costumes', 'beachwear'],
  'Mens Swimwear': ['swimwear', 'swim trunk', 'swim trunks', 'swimming short', 'swimming shorts', 'swim brief', 'swim briefs', 'men swimwear'],
  'Accessories': ['belt', 'belts', 'scarf', 'scarves', 'glove', 'gloves', 'hat', 'hats', 'cap', 'caps', 'wallet', 'wallets', 'bag', 'bags', 'backpack', 'backpacks', 'watch', 'watches', 'sunglasses', 'jewelry', 'accessories']
};

const DraggableItem = ({ item, onDragEnd }: { item: WardrobeItem; onDragEnd: (item: WardrobeItem) => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'WARDROBE_ITEM',
    item: item,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item: any) => {
      onDragEnd(item as WardrobeItem);
    },
  }));

  return (
    <div
      ref={drag}
      className={`relative aspect-square cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-contain bg-gray-50 rounded-lg"
      />
    </div>
  );
};

const Canvas = ({ onDrop }: { onDrop: (item: WardrobeItem) => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'WARDROBE_ITEM',
    drop: (item: WardrobeItem) => {
      onDrop(item);
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`flex-1 min-h-[600px] bg-white rounded-lg border-2 border-dashed ${
        isOver ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
      } p-4`}
    >
      <div className="text-center text-gray-500 mt-8">
        Drag and drop items here to create your outfit
      </div>
    </div>
  );
};

export default function OutfitPlanner({ wardrobeItems }: OutfitPlannerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [outfitItems, setOutfitItems] = useState<WardrobeItem[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Move categorization logic into useMemo to prevent recalculation on every render
  const categorizedItems = useMemo(() => {
    return wardrobeItems.reduce((acc, item) => {
      let matched = false;
      const nameAndDesc = ((item.name || '') + ' ' + (item.description || '') + ' ' + (item.brand || '')).toLowerCase();

      // Special case: handle footwear first to avoid misclassification
      if (/\b(espadrille|canvas shoe|casual shoe)\b/i.test(nameAndDesc)) {
        const category = 'Mens Casual Shoes';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        matched = true;
      }
      
      // Special case: handle shorts and loungewear first to avoid misclassification
      else if (/\b(shorts?|bermuda|cargo)\b/i.test(nameAndDesc)) {
        let category = 'Mens Shorts';
        
        // Check if it's loungewear/sleepwear
        if (/\b(lounge|sleep|night|pajama|pyjama)\b/i.test(nameAndDesc)) {
          category = 'Mens Sleepwear & Loungewear';
        }
        
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        matched = true;
      }
      
      // Special case: handle loungewear and sleepwear that aren't shorts
      else if (/\b(lounge|sleep|night|pajama|pyjama)\b/i.test(nameAndDesc)) {
        const category = 'Mens Sleepwear & Loungewear';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        matched = true;
      }
      
      // Special case: handle shirts to ensure proper classification
      else if (/\b(shirt)\b/i.test(nameAndDesc)) {
        // Determine if it's a women's shirt or men's shirt
        let category = 'Casual Shirts';
        
        if (/\b(formal|dress|business|office)\b/i.test(nameAndDesc)) {
          category = 'Formal Shirts';
        } else if (/\b(women|ladies|woman|female)\b/i.test(nameAndDesc)) {
          category = 'Womens Tops';
        }
        
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        matched = true;
      }
      
      // Special case: handle women's dresses to ensure proper classification
      else if (/\b(dress|gown|maxi|bodycon|a-line|midi dress)\b/i.test(nameAndDesc) && 
               !nameAndDesc.includes('night') && 
               !nameAndDesc.includes('sleep') && 
               !nameAndDesc.includes('bed')) {
        const category = 'Dresses';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        matched = true;
      }

      // General category matching if no special case matched
      if (!matched) {
        // Try to match with predefined categories
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
          for (const keyword of keywords) {
            const keywordParts = keyword.split(/\s+/);
            const keywordRegex = new RegExp(
              keywordParts.map(part => `\\b${part}\\b`).join('\\s+'),
              'i'
            );
            if (keywordRegex.test(nameAndDesc)) {
              if (!acc[category]) {
                acc[category] = [];
              }
              acc[category].push(item);
              matched = true;
              break;
            }
          }
          if (matched) break;
        }

        // If still no match found, use the item's assigned category or 'Uncategorized'
        if (!matched) {
          const category = item.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
        }
      }

      return acc;
    }, {} as Record<string, WardrobeItem[]>);
  }, [wardrobeItems]);

  // Initialize expanded categories only once
  useEffect(() => {
    if (!isInitialized && Object.keys(categorizedItems).length > 0) {
      const firstCategory = Object.keys(categorizedItems)[0];
      setExpandedCategories({ [firstCategory]: true });
      setSelectedCategory(firstCategory);
      setIsInitialized(true);
    }
  }, [categorizedItems, isInitialized]);

  const handleDragEnd = (item: WardrobeItem) => {
    setOutfitItems((prev) => [...prev, item]);
  };

  const handleCanvasDrop = (item: WardrobeItem) => {
    setOutfitItems((prev) => [...prev, item]);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
    setSelectedCategory(category);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full gap-4">
        {/* Left Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="space-y-2">
            {Object.entries(categorizedItems).map(([category, items]) => (
              <div key={category} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className={`w-full px-4 py-2 text-left flex justify-between items-center ${
                    selectedCategory === category ? 'bg-purple-50 text-purple-700' : ''
                  }`}
                >
                  <span className="font-medium text-gray-800">
                    {category} ({items.length})
                  </span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      expandedCategories[category] ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedCategories[category] && (
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {items.map((item) => (
                      <DraggableItem key={item.id} item={item} onDragEnd={handleDragEnd} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1">
          <Canvas onDrop={handleCanvasDrop} />
          {outfitItems.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {outfitItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-square object-contain bg-gray-50 rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setOutfitItems((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
} 