'use client'
import React, { useState, FormEvent, useRef, useEffect, ClipboardEvent as ReactClipboardEvent } from 'react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { prisma } from '@/lib/prisma'
import FullBodyPhotoUpload from '@/components/FullBodyPhotoUpload';
import { useWardrobe } from '@/contexts/WardrobeContext';
import { SavedOutfits } from '@/components/outfit-planner/SavedOutfits';
import { OutfitCalendar } from '@/components/outfit-planner/OutfitCalendar';

const inter = Inter({ subsets: ['latin'] })

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface MyntraProduct {
  brand?: string;  // Made optional
  name: string;
  price?: string;  // Made optional
  originalPrice?: string;
  discount?: string;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  description?: string;
  image?: string;
  myntraLink?: string;  // Keep for backward compatibility
  productLink?: string; // Add for H&M and other retailers
  category?: string;
  color?: string;
  pattern?: string;
  fabric?: string;
  dateAdded: string;
  size?: string;
  quantity?: string;
  seller?: string;
  sourceRetailer?: string;
  id: string;
  colorTag?: string;
  dominantColor?: string;
}

interface WardrobeItem {
  url: string;
  type: 'youtube' | 'myntra' | 'other';
  videoId?: string;
  preview?: LinkPreview;
  myntraData?: MyntraProduct;
  loading?: boolean;
}

interface SearchResult {
  url: string;
  brand: string;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
}

// Add types for categorized wardrobe
interface CategoryMap {
  [key: string]: MyntraProduct[];
}

// Add new interfaces for sorting and filtering
interface FilterOptions {
  categories: string[];
  brands: string[];
  retailers: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sizes: string[];
  colors: string[];
}

interface SortOption {
  type: 'date' | 'name' | 'price';
  direction: 'asc' | 'desc';
}

function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function isMyntraUrl(url: string): boolean {
  return url.includes('myntra.com');
}

// Add ProductOverlay component
const ProductOverlay = ({ 
  products, 
  onSelect, 
  onClose 
}: { 
  products: SearchResult[], 
  onSelect: (url: string) => void, 
  onClose: () => void 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select a Product to Add to Your Wardrobe</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product, index) => (
            <div 
              key={index}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {product.image && (
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-xs rounded">
                    Match #{index + 1}
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.brand}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.name}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-lg">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                  {product.discount && (
                    <span className="text-sm text-green-600 font-medium">{product.discount}</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => onSelect(product.url)}
                    className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  >
                    Add to Wardrobe
                  </button>
                  <a 
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-4 text-center text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors"
                  >
                    View on Myntra
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WardrobeItem = ({ product, onDelete }: { product: MyntraProduct, onDelete: () => void }) => {
  // Function to convert color names to CSS color values
  const getColorValue = (color?: string): string => {
    if (!color) return 'transparent';
    
    // If it's already a hex code, return it
    if (color.startsWith('#')) {
      return color;
    }
    
    // Normalize the color name: lowercase and trim
    const normalizedColor = color.toLowerCase().trim();
    
    // Map of common color names to hex values
    const colorMap: Record<string, string> = {
      // Basic colors
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#FF0000',
      'green': '#008000',
      'blue': '#0000FF',
      'yellow': '#FFFF00',
      'purple': '#800080',
      'orange': '#FFA500',
      'pink': '#FFC0CB',
      'brown': '#A52A2A',
      
      // Grays
      'gray': '#808080',
      'grey': '#808080',
      'dark gray': '#404040',
      'dark grey': '#404040',
      'light gray': '#D3D3D3',
      'light grey': '#D3D3D3',
      'charcoal': '#36454F',
      'silver': '#C0C0C0',
      
      // Blues
      'navy': '#000080',
      'navy blue': '#000080',
      'royal blue': '#4169E1',
      'sky blue': '#87CEEB',
      'light blue': '#ADD8E6',
      'dark blue': '#00008B',
      'teal': '#008080',
      'turquoise': '#40E0D0',
      'aqua': '#00FFFF',
      
      // Reds
      'maroon': '#800000',
      'burgundy': '#800020',
      'crimson': '#DC143C',
      'coral': '#FF7F50',
      'salmon': '#FA8072',
      'dark red': '#8B0000',
      
      // Greens
      'olive': '#808000',
      'lime': '#00FF00',
      'dark green': '#006400',
      'light green': '#90EE90',
      'forest green': '#228B22',
      'mint': '#98FB98',
      'emerald': '#50C878',
      
      // Yellows & Browns
      'gold': '#FFD700',
      'khaki': '#F0E68C',
      'beige': '#F5F5DC',
      'tan': '#D2B48C',
      'sand': '#C2B280',
      'chocolate': '#D2691E',
      'dark brown': '#5C4033',
      'light brown': '#B5651D',
      
      // Purples & Pinks
      'magenta': '#FF00FF',
      'violet': '#EE82EE',
      'lavender': '#E6E6FA',
      'plum': '#DDA0DD',
      'dark purple': '#301934',
      'light pink': '#FFB6C1',
      'hot pink': '#FF69B4',
      'fuchsia': '#FF00FF',
      
      // Common clothing colors
      'indigo': '#4B0082',
      'denim': '#1560BD',
      'off white': '#F8F8FF',
      'cream': '#FFFDD0',
      'ivory': '#FFFFF0',
      'camel': '#C19A6B',
      'mustard': '#FFDB58',
    };
    
    // Try to find an exact match
    if (colorMap[normalizedColor]) {
      return colorMap[normalizedColor];
    }
    
    // If no exact match, try to find a partial match
    for (const [colorName, colorValue] of Object.entries(colorMap)) {
      if (normalizedColor.includes(colorName)) {
        return colorValue;
      }
    }
    
    // If we can't map it, use it directly (CSS might understand some color names)
    return normalizedColor;
  };
  
  // Format color text to be more user-friendly
  const getColorText = (color?: string) => {
    if (!color) return 'Unknown color';
    // If it's a hex code, make it more readable
    if (color.startsWith('#')) {
      return `Color code: ${color}`;
    }
    // Otherwise return the color name
    return color;
  };
  
  const colorValue = getColorValue(product.color || product.colorTag || product.dominantColor);
  const colorText = getColorText(product.color || product.colorTag || product.dominantColor);
  
  return (
    <div className="relative group">
      <div className="aspect-square relative">
        <div className="absolute inset-0">
          <img
            src={product.image || product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-contain bg-gray-50"
          />
        </div>
        <button
          onClick={onDelete}
          className="absolute top-2 left-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete item"
        >
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="p-4 bg-white">
        <div className="flex items-center gap-2 mb-1">
          {/* Color Square with custom tooltip */}
          {(product.color || product.colorTag || product.dominantColor) && (
            <div className="relative group/color">
              <div 
                className="w-4 h-4 rounded-sm border border-gray-300 flex-shrink-0" 
                style={{ 
                  backgroundColor: colorValue
                }}
              />
              {/* Custom tooltip */}
              <div className="absolute left-0 bottom-full mb-1 w-auto min-w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 invisible group-hover/color:opacity-100 group-hover/color:visible transition-all duration-200 z-10 whitespace-nowrap">
                {colorText}
              </div>
            </div>
          )}
          <h3 className="font-semibold">{product.brand}</h3>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.name}</p>
        <div className="flex flex-col gap-2">
          {(product.productLink || product.myntraLink) && (
            <a
              href={product.productLink || product.myntraLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <span>Visit {product.brand}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Add a helper function to categorize items
const categorizeItems = (items: MyntraProduct[]): CategoryMap => {
  // Default category for items without a category
  const defaultCategory = 'Uncategorized';
  
  // Define clothing categories following Myntra's official structure for both men and women
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
    'Mens Sleepwear & Loungewear': ['sleepwear', 'loungewear', 'pajama', 'pajamas', 'pyjama', 'pyjamas', 'lounge pant', 'lounge pants', 'night suit', 'night suits', 'night dress', 'night dresses', 'sleep shirt', 'sleep shirts', 'men sleepwear', 'lounge short', 'lounge shorts', 'sleep short', 'sleep shorts', 'night short', 'night shorts'],
    'Womens Tops': ['women top', 'women tops', 'ladies top', 'ladies tops', 'fashion top', 'fashion tops', 'crop top', 'crop tops', 'camisole', 'camisoles', 'women blouse', 'women blouses', 'ladies blouse', 'ladies blouses', 'women shirt', 'women shirts', 'ladies shirt', 'ladies shirts', 'tops'],
    'Dresses': ['dress', 'dresses', 'gown', 'gowns', 'maxi', 'maxis', 'midi dress', 'midi dresses', 'a-line dress', 'a-line dresses', 'bodycon', 'bodycons', 'shift dress', 'shift dresses', 'women dress', 'women dresses'],
    'Womens Jeans': ['women jeans', 'ladies jeans', 'skinny jeans', 'boyfriend jeans', 'straight leg jeans', 'women denim'],
    'Trousers & Capris': ['trouser', 'trousers', 'capri', 'capris', 'cropped pant', 'cropped pants', 'cigarette pant', 'cigarette pants', 'culottes', 'women trouser', 'women trousers', 'ladies pant', 'ladies pants'],
    'Shorts & Skirts': ['women short', 'women shorts', 'ladies short', 'ladies shorts', 'mini skirt', 'mini skirts', 'midi skirt', 'midi skirts', 'maxi skirt', 'maxi skirts', 'denim skirt', 'denim skirts', 'pleated skirt', 'pleated skirts'],
    'Rain Jackets': ['rain jacket', 'rain jackets', 'raincoat', 'raincoats', 'waterproof jacket', 'waterproof jackets', 'windcheater', 'windcheaters', 'men rain jacket', 'men rain jackets'],

    // ====== MEN'S BOTTOMWEAR ======
    'Mens_Jeans': ['jeans', 'denim jean', 'denim jeans', 'jean', 'men jeans', 'men jean', 'H&M jeans'],
    'Casual_Trousers': ['casual trouser', 'casual trousers', 'chinos', 'khakis', 'casual pant', 'casual pants', 'men casual trouser', 'men casual trousers', 'men chinos', 'H&M trousers'],
    'Formal_Trousers': ['formal trouser', 'formal trousers', 'dress pant', 'dress pants', 'dress trouser', 'dress trousers', 'suit pant', 'suit pants', 'office trouser', 'office trousers', 'men formal trouser', 'men formal trousers'],
    'Mens_Shorts': ['short', 'shorts', 'bermuda', 'bermudas', 'cargo short', 'cargo shorts', 'denim short', 'denim shorts', 'men short', 'men shorts', 'H&M shorts'],
    'Track_Pants_Joggers': ['track pant', 'track pants', 'jogger', 'joggers', 'trackpant', 'trackpants', 'track bottom', 'track bottoms', 'athletic pant', 'athletic pants', 'sweatpant', 'sweatpants', 'drawstring pant', 'drawstring pants', 'dressy jogger', 'dressy joggers', 'men jogger', 'men joggers'],

    // ====== MEN'S INNERWEAR & SLEEPWEAR ======
    'Briefs_Trunks': ['brief', 'briefs', 'trunk', 'trunks', 'underwear', 'underwears', 'undergarment', 'undergarments', 'men brief', 'men briefs', 'men trunk', 'men trunks', 'H&M underwear'],
    'Boxers': ['boxer', 'boxers', 'boxer brief', 'boxer briefs', 'boxer short', 'boxer shorts', 'men boxer', 'men boxers'],
    'Vests': ['vest', 'vests', 'undershirt', 'undershirts', 'sleeveless undershirt', 'sleeveless undershirts', 'inner vest', 'inner vests', 'men vest', 'men vests'],
    'Mens_Sleepwear_Loungewear': ['sleepwear', 'loungewear', 'pajama', 'pajamas', 'pyjama', 'pyjamas', 'lounge pant', 'lounge pants', 'night suit', 'night suits', 'night dress', 'night dresses', 'sleep shirt', 'sleep shirts', 'men sleepwear', 'lounge short', 'lounge shorts', 'sleep short', 'sleep shorts', 'night short', 'night shorts', 'H&M sleepwear'],
    'Mens_Thermals': ['thermal', 'thermals', 'thermal wear', 'winter thermal', 'winter thermals', 'heat tech', 'warm underwear', 'men thermal', 'men thermals'],

    // ====== MEN'S INDIAN & FESTIVE WEAR ======
    'Kurtas & Kurta Sets': ['kurta', 'kurtas', 'kurta set', 'kurta sets', 'kurta pajama', 'kurta pajamas', 'kurta pyjama', 'kurta pyjamas', 'men kurta', 'men kurtas'],
    'Sherwanis': ['sherwani', 'sherwanis', 'wedding sherwani', 'wedding sherwanis', 'groom sherwani', 'groom sherwanis'],
    'Nehru Jackets': ['nehru jacket', 'nehru jackets', 'modi jacket', 'modi jackets', 'waistcoat', 'waistcoats', 'ethnic jacket', 'ethnic jackets', 'indian jacket', 'indian jackets'],
    'Dhotis': ['dhoti', 'dhotis', 'dhoti pant', 'dhoti pants', 'ethnic bottom', 'ethnic bottoms', 'men dhoti', 'men dhotis'],

    // ====== MEN'S PLUS SIZE ======
    'Mens Plus Size': ['plus size', 'plus-size', 'oversized', 'plus fit', 'extended size', 'extended sizes', 'men plus size'],
    
    // ====== MEN'S FOOTWEAR ======
    'Mens Casual Shoes': ['casual shoe', 'casual shoes', 'everyday shoe', 'everyday shoes', 'lifestyle shoe', 'lifestyle shoes', 'men casual shoe', 'men casual shoes', 'espadrille', 'espadrilles', 'canvas shoe', 'canvas shoes'],
    'Mens Sports Shoes': ['sports shoe', 'sports shoes', 'running shoe', 'running shoes', 'training shoe', 'training shoes', 'athletic shoe', 'athletic shoes', 'gym shoe', 'gym shoes', 'men sports shoe', 'men sports shoes'],
    'Formal Shoes': ['formal shoe', 'formal shoes', 'oxford', 'oxfords', 'brogue', 'brogues', 'derby', 'derbies', 'loafer', 'loafers', 'monk shoe', 'monk shoes', 'dress shoe', 'dress shoes', 'men formal shoe', 'men formal shoes'],
    'Sneakers': ['sneaker', 'sneakers', 'casual sneaker', 'casual sneakers', 'fashion sneaker', 'fashion sneakers', 'high-top', 'high-tops', 'low-top', 'low-tops', 'men sneaker', 'men sneakers'],
    'Sandals & Floaters': ['sandal', 'sandals', 'floater', 'floaters', 'slider', 'sliders', 'open toe', 'open toes', 'men sandal', 'men sandals'],
    'Flip Flops': ['flip flop', 'flip flops', 'thong', 'thongs', 'beach sandal', 'beach sandals', 'slipper', 'slippers', 'men flip flop', 'men flip flops'],
    'Mens Socks': ['sock', 'socks', 'ankle sock', 'ankle socks', 'crew sock', 'crew socks', 'no-show sock', 'no-show socks', 'low cut sock', 'low cut socks', 'men sock', 'men socks'],
    
    // ====== PERSONAL CARE & GROOMING ======
    'Personal Care & Grooming': ['grooming', 'personal care', 'skincare', 'face wash', 'face washes', 'moisturizer', 'moisturizers', 'sunscreen', 'sunscreens', 'men grooming'],
    
    // ====== SUNGLASSES & FRAMES ======
    'Sunglasses & Frames': ['sunglass', 'sunglasses', 'eyeglass', 'eyeglasses', 'spectacle', 'spectacles', 'frame', 'frames', 'sun glass', 'sun glasses', 'shade', 'shades'],
    
    // ====== WATCHES ======
    'Mens Watches': ['watch', 'watches', 'wristwatch', 'wristwatches', 'analog watch', 'analog watches', 'digital watch', 'digital watches', 'chronograph', 'chronographs', 'men watch', 'men watches'],
    
    // ====== SPORTS & ACTIVE WEAR ======
    'Sports Sandals': ['sports sandal', 'sports sandals', 'hiking sandal', 'hiking sandals', 'outdoor sandal', 'outdoor sandals'],
    'Active T-Shirts': ['active t-shirt', 'active t-shirts', 'gym t-shirt', 'gym t-shirts', 'workout tee', 'workout tees', 'sport tee', 'sport tees', 'training t-shirt', 'training t-shirts', 'dry fit', 'quick dry'],
    'Track Pants & Shorts': ['track pant', 'track pants', 'athletic short', 'athletic shorts', 'running short', 'running shorts', 'gym short', 'gym shorts', 'workout pant', 'workout pants'],
    'Tracksuits': ['tracksuit', 'tracksuits', 'training suit', 'training suits', 'warm up suit', 'warm up suits', 'athletic set', 'athletic sets'],
    'Sports Jackets & Sweatshirts': ['sports jacket', 'sports jackets', 'athletic jacket', 'athletic jackets', 'hoodie', 'hoodies', 'workout sweatshirt', 'workout sweatshirts', 'gym hoodie', 'gym hoodies'],
    'Mens Sports Accessories': ['sports accessory', 'sports accessories', 'wristband', 'wristbands', 'headband', 'headbands', 'sport sock', 'sport socks', 'gym glove', 'gym gloves'],
    'Mens Swimwear': ['swimwear', 'swim trunk', 'swim trunks', 'swimming short', 'swimming shorts', 'swim brief', 'swim briefs', 'men swimwear'],
    
    // ====== GADGETS ======
    'Smart Wearables': ['smart watch', 'smart watches', 'fitness tracker', 'fitness trackers', 'smart band', 'smart bands', 'activity tracker', 'activity trackers'],
    'Fitness Gadgets': ['fitness gadget', 'fitness gadgets', 'smart scale', 'smart scales', 'muscle massager', 'muscle massagers', 'fitness monitor', 'fitness monitors'],
    'Headphones': ['headphone', 'headphones', 'earphone', 'earphones', 'earbud', 'earbuds', 'wireless earphone', 'wireless earphones', 'airpod', 'airpods'],
    'Speakers': ['speaker', 'speakers', 'bluetooth speaker', 'bluetooth speakers', 'wireless speaker', 'wireless speakers', 'portable speaker', 'portable speakers'],
    
    // ====== FASHION ACCESSORIES ======
    'Mens Wallets': ['wallet', 'wallets', 'card holder', 'card holders', 'money clip', 'money clips', 'billfold', 'billfolds', 'men wallet', 'men wallets'],
    'Mens Belts': ['belt', 'belts', 'leather belt', 'leather belts', 'casual belt', 'casual belts', 'formal belt', 'formal belts', 'men belt', 'men belts'],
    'Mens Perfumes': ['perfume', 'perfumes', 'fragrance', 'fragrances', 'cologne', 'colognes', 'body mist', 'body mists', 'body spray', 'body sprays', 'eau de toilette', 'men perfume', 'men perfumes'],
    'Trimmers': ['trimmer', 'trimmers', 'beard trimmer', 'beard trimmers', 'shaver', 'shavers', 'grooming kit', 'grooming kits'],
    'Mens Deodorants': ['deodorant', 'deodorants', 'antiperspirant', 'antiperspirants', 'body spray', 'body sprays', 'deo stick', 'deo sticks', 'men deodorant', 'men deodorants'],
    'Ties, Cufflinks & Pocket Squares': ['tie', 'ties', 'necktie', 'neckties', 'bow tie', 'bow ties', 'cufflink', 'cufflinks', 'pocket square', 'pocket squares', 'handkerchief', 'handkerchiefs'],
    'Accessory Gift Sets': ['gift set', 'gift sets', 'accessory set', 'accessory sets', 'wallet belt set', 'wallet belt sets', 'tie cufflink set', 'tie cufflink sets'],
    'Mens Caps & Hats': ['cap', 'caps', 'hat', 'hats', 'beanie', 'beanies', 'snapback', 'snapbacks', 'baseball cap', 'baseball caps', 'fedora', 'fedoras', 'men cap', 'men caps', 'men hat', 'men hats'],
    'Mens Mufflers & Scarves': ['muffler', 'mufflers', 'scarf', 'scarves', 'glove', 'gloves', 'mitten', 'mittens', 'winter accessory', 'winter accessories', 'men scarf', 'men scarves', 'men glove', 'men gloves'],
    'Phone Cases': ['phone case', 'phone cases', 'mobile cover', 'mobile covers', 'phone cover', 'phone covers', 'smartphone case', 'smartphone cases'],
    'Mens Rings & Wristwear': ['ring', 'rings', 'bracelet', 'bracelets', 'wristband', 'wristbands', 'bangle', 'bangles', 'men bracelet', 'men bracelets', 'men ring', 'men rings'],
    'Helmets': ['helmet', 'helmets', 'bike helmet', 'bike helmets', 'motorcycle helmet', 'motorcycle helmets'],
    
    // ====== BAGS & BACKPACKS ======
    'Mens Bags & Backpacks': ['bag', 'bags', 'backpack', 'backpacks', 'laptop bag', 'laptop bags', 'messenger bag', 'messenger bags', 'duffel bag', 'duffel bags', 'gym bag', 'gym bags', 'sling bag', 'sling bags', 'men bag', 'men bags', 'men backpack', 'men backpacks'],
    
    // ====== LUGGAGES & TROLLEYS ======
    'Mens Luggages': ['luggage', 'luggages', 'trolley', 'trolleys', 'suitcase', 'suitcases', 'cabin bag', 'cabin bags', 'travel bag', 'travel bags', 'hard case', 'hard cases'],

    // ====== WOMEN'S INDIAN & FUSION WEAR ======
    'Kurtas & Suits': ['women kurta', 'women kurtas', 'women suit', 'women suits', 'ladies kurta', 'ladies kurtas', 'kurti', 'kurtis', 'salwar kameez', 'anarkali', 'anarkalis', 'women ethnic suit', 'women ethnic suits'],
    'Kurtis, Tunics & Tops': ['kurti', 'kurtis', 'ethnic top', 'ethnic tops', 'tunic', 'tunics', 'ladies top', 'ladies tops', 'ethnic tunic', 'ethnic tunics', 'women kurti', 'women kurtis'],
    'Sarees': ['saree', 'sarees', 'sari', 'saris', 'silk saree', 'silk sarees', 'cotton saree', 'cotton sarees', 'designer saree', 'designer sarees'],
    'Ethnic Wear': ['ethnic wear', 'ethnic dress', 'ethnic dresses', 'lehenga', 'lehengas', 'choli', 'cholis', 'dupatta', 'dupattas', 'gown', 'gowns', 'women ethnic'],
    'Leggings, Salwars & Churidars': ['legging', 'leggings', 'salwar', 'salwars', 'churidar', 'churidars', 'patiala', 'patialas', 'palazzo', 'palazzos', 'ethnic pant', 'ethnic pants', 'women legging', 'women leggings'],
    'Skirts & Palazzos': ['skirt', 'skirts', 'palazzo pant', 'palazzo pants', 'ethnic skirt', 'ethnic skirts', 'long skirt', 'long skirts', 'maxi skirt', 'maxi skirts', 'women skirt', 'women skirts'],
    'Dress Materials': ['dress material', 'dress materials', 'fabric', 'fabrics', 'unstitched', 'suit material', 'suit materials', 'ethnic fabric', 'ethnic fabrics'],
    'Lehenga Cholis': ['lehenga', 'lehengas', 'lehenga choli', 'lehenga cholis', 'bridal lehenga', 'bridal lehengas', 'wedding lehenga', 'wedding lehengas', 'ghagra choli', 'ghagra cholis'],
    'Dupattas & Shawls': ['dupatta', 'dupattas', 'shawl', 'shawls', 'stole', 'stoles', 'ethnic scarf', 'ethnic scarves', 'women shawl', 'women shawls'],

    // ====== WOMEN'S WESTERN WEAR ======
    'Womens_Dresses': ['dress', 'dresses', 'gown', 'gowns', 'maxi', 'maxis', 'midi dress', 'midi dresses', 'a-line dress', 'a-line dresses', 'bodycon', 'bodycons', 'shift dress', 'shift dresses', 'women dress', 'women dresses', 'H&M dress', 'H&M dresses'],
    'Womens_Tops': ['women top', 'women tops', 'ladies top', 'ladies tops', 'fashion top', 'fashion tops', 'crop top', 'crop tops', 'camisole', 'camisoles', 'women blouse', 'women blouses', 'ladies blouse', 'ladies blouses', 'women shirt', 'women shirts', 'ladies shirt', 'ladies shirts', 'H&M top', 'H&M tops'],
    'Womens_Tshirts': ['women t-shirt', 'women t-shirts', 'ladies tee', 'ladies tees', 'graphic tee', 'graphic tees', 'printed t-shirt', 'printed t-shirts', 'basic tee', 'basic tees', 'women tshirt', 'women tshirts'],
    'Womens_Jeans': ['women jeans', 'ladies jeans', 'skinny jeans', 'boyfriend jeans', 'straight leg jeans', 'women denim', 'H&M jeans'],
    'Womens_Trousers_Capris': ['trouser', 'trousers', 'capri', 'capris', 'cropped pant', 'cropped pants', 'cigarette pant', 'cigarette pants', 'culottes', 'women trouser', 'women trousers', 'ladies pant', 'ladies pants', 'H&M trousers'],
    'Womens_Shorts_Skirts': ['women short', 'women shorts', 'ladies short', 'ladies shorts', 'mini skirt', 'mini skirts', 'midi skirt', 'midi skirts', 'maxi skirt', 'maxi skirts', 'denim skirt', 'denim skirts', 'pleated skirt', 'pleated skirts', 'H&M shorts'],
    'Co-ords': ['co-ord', 'co-ords', 'matching set', 'matching sets', 'twin set', 'twin sets', 'two piece set', 'two piece sets', 'coordinate set', 'coordinate sets'],
    'Playsuits': ['playsuit', 'playsuits', 'romper', 'rompers', 'short jumpsuit', 'short jumpsuits', 'beach playsuit', 'beach playsuits'],
    'Jumpsuits': ['jumpsuit', 'jumpsuits', 'overall', 'overalls', 'dungaree', 'dungarees', 'women jumpsuit', 'women jumpsuits', 'ladies jumpsuit', 'ladies jumpsuits'],
    'Shrugs': ['shrug', 'shrugs', 'bolero', 'boleros', 'cover up', 'cover ups', 'women shrug', 'women shrugs', 'ladies shrug', 'ladies shrugs'],
    'Womens Sweaters & Sweatshirts': ['women sweater', 'women sweaters', 'ladies sweatshirt', 'ladies sweatshirts', 'women pullover', 'women pullovers', 'women cardigan', 'women cardigans', 'knit top', 'knit tops', 'H&M sweater', 'H&M cardigans'],
    'Womens Jackets & Coats': ['women jacket', 'women jackets', 'ladies coat', 'ladies coats', 'women blazer', 'women blazers', 'parka', 'parkas', 'trench coat', 'trench coats', 'women outerwear', 'H&M jacket', 'H&M coats'],
    'Blazers & Waistcoats': ['women blazer', 'women blazers', 'ladies waistcoat', 'ladies waistcoats', 'women vest', 'women vests', 'suit jacket', 'suit jackets'],
    
    // ====== WOMEN'S PLUS SIZE ======
    'Womens Plus Size': ['women plus size', 'plus size dress', 'plus size dresses', 'plus size top', 'plus size tops', 'plus size jeans', 'curve', 'extended size women'],
    
    // ====== MATERNITY ======
    'Maternity': ['maternity', 'pregnancy', 'prenatal', 'pregnant', 'nursing', 'maternal', 'maternity wear'],
    
    // ====== WOMEN'S LINGERIE & SLEEPWEAR ======
    'Bra': ['bra', 'bras', 'brassiere', 'brassieres', 'sports bra', 'sports bras', 'push up bra', 'push up bras', 'padded bra', 'padded bras', 'nursing bra', 'nursing bras', 'strapless bra', 'strapless bras'],
    'Womens Briefs': ['women brief', 'women briefs', 'panty', 'panties', 'underwear', 'womens underwear', 'ladies brief', 'ladies briefs', 'bikini brief', 'bikini briefs'],
    'Shapewear': ['shapewear', 'body shaper', 'body shapers', 'slimming underwear', 'control brief', 'control briefs', 'corset', 'corsets', 'waist trainer', 'waist trainers'],
    'Womens Sleepwear': ['women sleepwear', 'nightdress', 'nightdresses', 'nightgown', 'nightgowns', 'pajama set', 'pajama sets', 'women loungewear', 'lounge pant women', 'lounge pants women', 'H&M sleepwear'],
    'Womens Swimwear': ['women swimwear', 'swimsuit', 'swimsuits', 'bikini', 'bikinis', 'one piece', 'one pieces', 'swimming costume', 'swimming costumes', 'beachwear'],
    'Camisoles & Thermals': ['camisole', 'camisoles', 'slip', 'slips', 'women thermal', 'women thermals', 'inner wear', 'tank top', 'tank tops', 'spaghetti top', 'spaghetti tops'],

    // ====== WOMEN'S FOOTWEAR ======
    'Flats': ['flat', 'flats', 'ballet flat', 'ballet flats', 'moccasin', 'moccasins', 'loafer', 'loafers', 'women flat', 'women flats', 'ladies flat', 'ladies flats', 'slip on', 'slip ons', 'women shoe', 'women shoes'],
    'Womens Casual Shoes': ['women casual shoe', 'women casual shoes', 'ladies sneaker', 'ladies sneakers', 'slip on shoe', 'slip on shoes', 'fashion sneaker', 'fashion sneakers', 'women everyday shoe', 'women everyday shoes'],
    'Heels': ['heel', 'heels', 'stiletto', 'stilettos', 'pump', 'pumps', 'platform heel', 'platform heels', 'wedge', 'wedges', 'block heel', 'block heels', 'high heel', 'high heels', 'kitten heel', 'kitten heels'],
    'Boots': ['women boot', 'women boots', 'ankle boot', 'ankle boots', 'knee high boot', 'knee high boots', 'ladies boot', 'ladies boots', 'winter boot', 'winter boots', 'chelsea boot', 'chelsea boots'],
    'Womens Sports Shoes': ['women sports shoe', 'women sports shoes', 'ladies running shoe', 'ladies running shoes', 'women athletic shoe', 'women athletic shoes', 'women floater', 'women floaters'],
    
    // ====== WOMEN'S SPORTS & ACTIVE WEAR ======
    'Womens Sports Clothing': ['women sportswear', 'activewear', 'gym wear', 'workout clothing', 'yoga wear', 'fitness apparel'],
    'Womens Sports Footwear': ['women sport shoe', 'women sport shoes', 'training shoe', 'training shoes', 'running shoe', 'running shoes', 'women gym shoe', 'women gym shoes', 'yoga shoe', 'yoga shoes'],
    'Womens Sports Accessories': ['women sport accessory', 'women sport accessories', 'fitness accessory', 'fitness accessories', 'yoga mat', 'yoga mats', 'gym bag', 'gym bags', 'water bottle', 'water bottles'],
    'Sports Equipment': ['sports equipment', 'fitness equipment', 'yoga prop', 'yoga props', 'exercise equipment', 'home gym'],
    
    // ====== BEAUTY & PERSONAL CARE ======
    'Makeup': ['makeup', 'cosmetic', 'cosmetics', 'foundation', 'foundations', 'lipstick', 'lipsticks', 'mascara', 'mascaras', 'eyeliner', 'eyeliners', 'blush', 'blushes', 'beauty product', 'beauty products'],
    'Skincare': ['skincare', 'face cream', 'face creams', 'serum', 'serums', 'moisturizer', 'moisturizers', 'face wash', 'face washes', 'sunscreen', 'sunscreens', 'beauty treatment', 'beauty treatments'],
    'Premium Beauty': ['premium beauty', 'luxury cosmetic', 'luxury cosmetics', 'high end makeup', 'designer beauty', 'prestige beauty'],
    'Lipsticks': ['lipstick', 'lipsticks', 'lip color', 'lip colors', 'lip gloss', 'lip glosses', 'liquid lipstick', 'liquid lipsticks', 'lip stain', 'lip stains', 'lip product', 'lip products'],
    'Fragrances': ['women perfume', 'women perfumes', 'ladies fragrance', 'ladies fragrances', 'eau de parfum', 'women cologne', 'women colognes', 'women body mist', 'women body mists', 'scent', 'scents'],
    
    // ====== JEWELLERY ======
    'Fashion Jewellery': ['fashion jewellery', 'costume jewellery', 'artificial jewellery', 'statement necklace', 'statement necklaces', 'fashion earring', 'fashion earrings'],
    'Fine Jewellery': ['fine jewellery', 'gold jewellery', 'silver jewellery', 'pearl jewellery', 'precious stone', 'precious stones'],
    'Earrings': ['earring', 'earrings', 'stud', 'studs', 'hoop earring', 'hoop earrings', 'drop earring', 'drop earrings', 'chandelier earring', 'chandelier earrings', 'ear cuff', 'ear cuffs'],
    
    // ====== WOMEN'S ACCESSORIES ======
    'Belts, Scarves & More': ['women belt', 'ladies scarf', 'women glove', 'women hair accessory', 'women fashion accessory'],
    'Watches & Wearables': ['women watch', 'ladies wristwatch', 'women fitness tracker', 'women smart watch', 'fashion watch'],
    'Womens Backpacks': ['women backpack', 'ladies backpack', 'fashion backpack', 'mini backpack', 'women rucksack'],
    'Handbags, Bags & Wallets': ['handbag', 'purse', 'clutch', 'tote bag', 'shoulder bag', 'crossbody bag', 'women wallet'],
    'Womens Luggages': ['women luggage', 'ladies suitcase', 'travel bag women', 'carry on', 'women trolley'],
    'Mens_Overshirts': ['overshirt', 'overshirts', 'shacket', 'shackets', 'men overshirt', 'men overshirts'],
  };
  
  // Initialize categories
  const categories: CategoryMap = {};
  
  // Sort items into categories
  items.forEach(item => {
    // Check if the item already has a category assigned
    if (item.category) {
      // Use the item's assigned category
      const category = item.category;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
      return;
    }
    
    // Try to determine category from name or description
    const nameAndDesc = (item.name + ' ' + (item.description || '')).toLowerCase();
    
    let matched = false;
    
    // Special case: handle footwear first to avoid misclassification
    if (/\b(espadrille|canvas shoe|casual shoe)\b/i.test(nameAndDesc)) {
      const category = 'Mens Casual Shoes';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
      matched = true;
    }
    
    // Special case: handle shorts and loungewear first to avoid misclassification
    else if (/\b(shorts?|bermuda|cargo)\b/i.test(nameAndDesc)) {
      let category = 'Mens Shorts';
      
      // Check if it's loungewear/sleepwear
      if (/\b(lounge|sleep|night|pajama|pyjama)\b/i.test(nameAndDesc)) {
        category = 'Mens Sleepwear & Loungewear';
      }
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
      matched = true;
    }
    
    // Special case: handle loungewear and sleepwear that aren't shorts
    else if (/\b(lounge|sleep|night|pajama|pyjama)\b/i.test(nameAndDesc)) {
      const category = 'Mens Sleepwear & Loungewear';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
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
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
      matched = true;
    }
    
    // Special case: handle women's dresses to ensure proper classification
    else if (/\b(dress|gown|maxi|bodycon|a-line|midi dress)\b/i.test(nameAndDesc) && 
             !nameAndDesc.includes('night') && 
             !nameAndDesc.includes('sleep') && 
             !nameAndDesc.includes('bed')) {
      const category = 'Dresses';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
      matched = true;
    }
    
    // Special case: handle women's lingerie to ensure proper classification
    else if (/\b(bra|brassiere|panty|underwear|lingerie|shapewear|bodysuit)\b/i.test(nameAndDesc) &&
             !/\b(shorts?|bermuda|cargo|lounge|sleep|night|pajama|pyjama)\b/i.test(nameAndDesc)) {
      let category = 'Briefs';
      // Only match exact word "bra", not part of other words
      if (/\b(bra|brassiere)\b/i.test(nameAndDesc) && 
          !/(brand|zebra|cobra|abrasive|abrasion|vibrant|calibrate|celebrate|fabric|library|vibrate)/i.test(nameAndDesc)) {
        category = 'Bra';
      } else if (/\b(shapewear|body\s*shaper|slimming|control)\b/i.test(nameAndDesc)) {
        category = 'Shapewear';
      }
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
      matched = true;
    }
    
    // General category matching
    if (!matched) {
      // First pass: search for exact matches using word boundaries and ensuring complete words
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
          // Split multi-word keywords and ensure each word is matched exactly
          const keywordParts = keyword.split(/\s+/);
          const keywordRegex = new RegExp(
            keywordParts.map(part => `\\b${part}\\b`).join('\\s+'),
            'i'
          );
          if (keywordRegex.test(nameAndDesc)) {
            if (!categories[category]) {
              categories[category] = [];
            }
            categories[category].push(item);
            matched = true;
            break;
          }
        }
        if (matched) break;
      }
      
      // Remove the second pass that was doing partial matches
      // This prevents incorrect categorization based on substrings
    }
    
    // If no match found, place in default category
    if (!matched) {
      if (!categories[defaultCategory]) {
        categories[defaultCategory] = [];
      }
      categories[defaultCategory].push(item);
    }
  });
  
  return categories;
};

export default function Home() {
  const { data: session, status } = useSession()
  const [inputValue, setInputValue] = useState('')
  const [products, setProducts] = useState<MyntraProduct[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const [showProductOverlay, setShowProductOverlay] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false)
  const [pdfText, setPdfText] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null)
  const { setAutosaveEnabled, autosaveEnabled } = useWardrobe();
  // Add state for expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  // Add state for wardrobe search/filter
  const [wardrobeFilter, setWardrobeFilter] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>({ type: 'date', direction: 'desc' });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    brands: [],
    retailers: [],
    priceRange: { min: 0, max: Infinity },
    sizes: [],
    colors: []
  });
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Load user's wardrobe on session change
  useEffect(() => {
    if (session?.user?.id) {
      loadUserWardrobe();
    }
  }, [session]);

  // Expand the first category automatically when products load
  useEffect(() => {
    if (products.length > 0) {
      const categories = categorizeItems(products);
      const firstCategory = Object.keys(categories)[0];
      if (firstCategory) {
        setExpandedCategories(prev => ({
          ...prev,
          [firstCategory]: true
        }));
      }
    }
  }, [products]);

  // Autosave effect - triggers save whenever products change
  useEffect(() => {
    // Don't save if autosave is disabled, there are no products, or no session
    if (!autosaveEnabled || !products.length || !session?.user?.id) return;
    
    // Clear any existing timeout to prevent multiple saves
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    // Set a new timeout to save after a short delay (debounce)
    const timeout = setTimeout(() => {
      saveWardrobe(false); // false means don't show success message for routine autosaves
    }, 1500); // 1.5 second delay
    
    setAutoSaveTimeout(timeout);
    
    // Cleanup function to clear timeout if component unmounts
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [products, autosaveEnabled]);

  const loadUserWardrobe = async () => {
    try {
      const response = await fetch('/api/wardrobe');
        if (!response.ok) {
        throw new Error('Failed to load wardrobe');
        }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading wardrobe:', error);
      setError('Failed to load your wardrobe');
    }
  };

  // Save the entire wardrobe state
  const saveWardrobe = async (showMessage = true) => {
    if (!session) {
      setError('Please sign in to save your wardrobe');
      return;
    }

    try {
      setIsSaving(true);
      if (showMessage) {
        setSaveSuccess(null);
      }
      setError(null);
      
      // Simply send the current state to the server
      const response = await fetch('/api/wardrobe/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: products }),
      });

      if (!response.ok) {
        throw new Error('Failed to save wardrobe');
      }
      
      const data = await response.json();
      
      // Update our state with the latest data from the server
      if (data.updatedItems) {
        setProducts(data.updatedItems);
      }
      
      if (showMessage) {
        setSaveSuccess(`Wardrobe saved successfully! (${data.count} items)`);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving wardrobe:', error);
      setError(error instanceof Error ? error.message : 'Failed to save wardrobe');
    } finally {
      setIsSaving(false);
    }
  };

  // Find the function that's handling the product updates
  const handleAddProduct = async (productUrl: string) => {
    if (!session) {
      setError('Please sign in to add products');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/wardrobe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({ url: productUrl }),
        });
        
        if (!response.ok) {
        throw new Error('Failed to add product');
      }
      
      const data = await response.json();
      // Debug logging to verify the data structure
      console.log('Product data received:', data);
      
      // Make sure we're accessing the correct property (data.item)
      if (!data.item) {
        console.error('Expected data.item but got:', data);
        throw new Error('Invalid response format from server');
      }
      
      // Ensure we're properly appending to existing products
      setProducts(prevProducts => {
        // Create a new array with all previous products plus the new one
        const updatedProducts = [...prevProducts, data.item];
        console.log('Updated products count:', updatedProducts.length);
        return updatedProducts;
      });
      
      setInputValue('');
      setShowProductOverlay(false);
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the handleSubmit function is causing the issue
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!inputValue) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      // Myntra search flow
      if (inputValue.includes('myntra.com') || 
          inputValue.includes('zara.com') || 
          inputValue.includes('hm.com') || 
          inputValue.includes('2.hm.com')) {
        // Direct product URL - add to wardrobe
        await handleAddProduct(inputValue);
      } else {
        // Search term - search Myntra for results
        const response = await fetch(`/api/myntra-search?query=${encodeURIComponent(inputValue)}`)
        if (!response.ok) {
          throw new Error('Failed to search Myntra')
        }
        const data = await response.json()
        
        if (data.length === 0) {
          setError('No results found')
        } else {
          setSearchResults(data)
          setShowProductOverlay(true)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to process request')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle direct product selection from search results
  const handleProductSelect = async (url: string) => {
    await handleAddProduct(url);
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsProcessingImage(true)
      setError(null)
      setSearchResults([])

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Process image
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to process image')
      }

      const data = await response.json()
      if (data.searchResults && data.searchResults.length > 0) {
        setSearchResults(data.searchResults)
        setShowProductOverlay(true)  // Show overlay when results are available
      } else {
        throw new Error('No matching products found')
      }
    } catch (error) {
      console.error('Error processing image:', error)
      setError(error instanceof Error ? error.message : 'Failed to process image')
    } finally {
      setIsProcessingImage(false)
    }
  }

  const handlePdfUpload = async (file: File) => {
    try {
      setError(null);
      setPdfText(null);
      console.log('Processing PDF:', file.name);

      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process PDF');
      }

      const data = await response.json();
      console.log('PDF processing result:', data);

      // Set the extracted text
      setPdfText(data.extractedText);

      // Add extracted items to wardrobe
      if (data.items && data.items.length > 0) {
        const newProducts = data.items.map((item: any) => ({
          brand: item.brand || 'Unknown Brand',
          name: item.name || 'Unknown Product',
          price: item.price || '',
          originalPrice: item.originalPrice || '',
          discount: item.discount || '',
          image: item.image || '',
          size: item.size || '',
          quantity: item.quantity || '',
          seller: item.seller || '',
          productLink: item.productLink || item.myntraLink || '', // Handle both types of links
          myntraLink: item.myntraLink || '', // Keep for backward compatibility
          dateAdded: new Date().toISOString(),
          id: item.id || '',
        }));

        setProducts(prevProducts => [...prevProducts, ...newProducts]);
        // Autosave will be triggered by the useEffect
        setError(`Successfully added ${newProducts.length} items to your wardrobe.`);
      } else {
        setError('No items found in the PDF.');
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      setError(error instanceof Error ? error.message : 'Failed to process PDF');
    }
  }

  const handlePaste = async (e: ReactClipboardEvent<HTMLDivElement> | ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of Array.from(items)) {
      if (item.type.includes('image')) {
        const file = item.getAsFile()
        if (file) {
          await handleImageUpload(file)
          break
        }
      }
    }
  }

  const handleOverlayClose = () => {
    setShowProductOverlay(false)
    setSearchResults([])
    setImagePreview(null)
  }

  const handleDeleteProduct = async (index: number) => {
    if (!session) {
      setError('Please sign in to manage your wardrobe');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      // Update local state first
      setProducts(prevProducts => prevProducts.filter((_, i) => i !== index));
      
      // Save the updated state to the backend
      const response = await fetch('/api/wardrobe/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: products.filter((_, i) => i !== index) }),
      });

      if (!response.ok) {
        throw new Error('Failed to save wardrobe after deletion');
      }
      
      setSaveSuccess('Item successfully removed from your wardrobe');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error deleting item:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete item');
    } finally {
      setIsSaving(false);
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteAllItems = async () => {
    if (!session) {
      setError('Please sign in to manage your wardrobe');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      // Empty the products array and save the empty state
      setProducts([]);
      
      // Save the empty state to the database
      const response = await fetch('/api/wardrobe/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: [] }),
      });

      if (!response.ok) {
        throw new Error('Failed to clear wardrobe');
      }
      
      setSaveSuccess('All items successfully removed from your wardrobe');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error clearing wardrobe:', error);
      setError(error instanceof Error ? error.message : 'Failed to clear wardrobe');
    } finally {
      setIsSaving(false);
      setShowDeleteAllConfirm(false);
    }
  };

  useEffect(() => {
    const handleDocumentPaste = (e: ClipboardEvent) => {
      handlePaste(e);
    };
    
    document.addEventListener('paste', handleDocumentPaste);
    return () => document.removeEventListener('paste', handleDocumentPaste);
  }, []);

  // Add function to toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Add helper function to extract unique values
  const getUniqueValues = (products: MyntraProduct[], key: keyof MyntraProduct) => {
    return Array.from(new Set(products.map(product => product[key]).filter(Boolean)));
  };

  // Add function to get price as number
  const getPriceAsNumber = (price: string) => {
    return Number(price.replace(/[^0-9.-]+/g, '')) || 0;
  };

  // Add sorting function
  const getSortedProducts = (products: MyntraProduct[]) => {
    return [...products].sort((a, b) => {
      switch (sortOption.type) {
        case 'date':
          const dateA = new Date(a.dateAdded || 0);
          const dateB = new Date(b.dateAdded || 0);
          return sortOption.direction === 'asc' 
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        case 'name':
          return sortOption.direction === 'asc'
            ? (a.name || '').localeCompare(b.name || '')
            : (b.name || '').localeCompare(a.name || '');
        case 'price':
          const priceA = getPriceAsNumber(a.price || '0');
          const priceB = getPriceAsNumber(b.price || '0');
          return sortOption.direction === 'asc'
            ? priceA - priceB
            : priceB - priceA;
        default:
          return 0;
      }
    });
  };

  // Add filtering function with proper types
  const getFilteredProducts = () => {
    if (!wardrobeFilter.trim() && !Object.values(filterOptions).some(v => 
      Array.isArray(v) ? v.length > 0 : v.min !== 0 || v.max !== Infinity
    )) {
      return getSortedProducts(products);
    }
    
    return getSortedProducts(products.filter(product => {
      // Text search
      const searchMatch = !wardrobeFilter.trim() || [
        product.name,
        product.brand,
        product.color,
        product.size
      ].some(field => field?.toLowerCase().includes(wardrobeFilter.toLowerCase()));

      // Category filter
      const categoryMatch = filterOptions.categories.length === 0 || 
        filterOptions.categories.includes(product.category || 'Uncategorized');

      // Brand filter
      const brandMatch = filterOptions.brands.length === 0 ||
        (product.brand ? filterOptions.brands.includes(product.brand) : false);

      // Retailer filter
      const retailerMatch = filterOptions.retailers.length === 0 ||
        filterOptions.retailers.includes(product.sourceRetailer || 'Unknown');

      // Price filter
      const price = getPriceAsNumber(product.price || '0');
      const priceMatch = price >= filterOptions.priceRange.min && 
        price <= filterOptions.priceRange.max;

      // Size filter
      const sizeMatch = filterOptions.sizes.length === 0 ||
        filterOptions.sizes.includes(product.size || '');

      // Color filter
      const colorMatch = filterOptions.colors.length === 0 ||
        filterOptions.colors.includes(product.color || '');

      return searchMatch && categoryMatch && brandMatch && retailerMatch && 
        priceMatch && sizeMatch && colorMatch;
    }));
  };

  // Add bulk delete function with proper types
  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    
    const updatedProducts = products.filter(product => !selectedItems.has(product.id));
    setProducts(updatedProducts);
      setSelectedItems(new Set());
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Existing content */}
          <div className="space-y-8">
            <div className="flex flex-col items-center">
              {session && (
                <div className="self-end flex items-center gap-2 mb-4">
                  {session?.user?.image && (
                    <Image src={session.user.image} width={32} height={32} alt="User" className="rounded-full" />
                  )}
                  <span className="text-sm">{session.user.name}</span>
                  <button className="text-sm text-purple-600 hover:underline" onClick={() => signOut()}>Sign Out</button>
                </div>
              )}
              
              <h1 className="text-4xl font-bold text-center text-purple-600 mb-2">
              Organize Your Wardrobe, <br />Elevate Your Style
              </h1>
              <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
                Your personal wardrobe assistant that helps you manage, style, and optimize your clothing collection.
              </p>
              
              {session ? (
                <div className="relative max-w-2xl mx-auto mb-16">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <a 
                      href="/email-fetcher" 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg px-8 py-4 text-center hover:opacity-90 transition-all mb-4 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Import Items from Your Email
                    </a>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                          <input
                            type="text"
                          placeholder="Enter Myntra URL or search for a product (e.g., 'blue cotton shirt')"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.type.startsWith('image/')) {
                                handleImageUpload(file);
                              } else if (file.type === 'application/pdf') {
                                handlePdfUpload(file);
                              }
                            }}
                            className="hidden"
                            ref={fileInputRef}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                            aria-label="Upload file"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                          </button>
                        </div>
                        <button 
                          type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap"
                        disabled={isLoading}
                        >
                        {isLoading ? 'Loading...' : 'Add to Wardrobe'}
                        </button>
                    </div>

                    {error && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg mt-4">
                        {error}
                      </div>
                    )}
                  </form>

                  {imagePreview && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                      <div className="aspect-video relative overflow-hidden rounded-lg">
                        <img
                          src={imagePreview}
                          alt="Uploaded screenshot"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[70vh] overflow-y-auto">
                      <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Found {searchResults.length} Products</h2>
                        {imagePreview && (
                          <p className="text-sm text-gray-600 mt-1">Results based on uploaded image</p>
                        )}
                      </div>
                      <div className="divide-y divide-gray-100">
                        {searchResults.map((result, index) => (
                          <div 
                            key={index}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            {result.image && (
                              <div className="relative w-24 h-24 flex-shrink-0">
                                <img 
                                  src={result.image} 
                                  alt={result.name}
                                  className="w-full h-full object-cover rounded"
                                />
                                {index < 3 && (
                                  <div className="absolute top-0 left-0 bg-purple-600 text-white px-2 py-1 text-xs rounded-br">
                                    Top {index + 1}
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{result.brand}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2">{result.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-semibold text-gray-900">{result.price}</span>
                                {result.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">{result.originalPrice}</span>
                                )}
                                {result.discount && (
                                  <span className="text-sm text-green-600 font-medium">{result.discount}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button 
                                className="px-4 py-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors whitespace-nowrap"
                                onClick={() => handleProductSelect(result.url)}
                                disabled={isLoading}
                              >
                                {isLoading ? 'Adding...' : 'Add to Wardrobe'}
                              </button>
                              <a 
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors text-center"
                              >
                                View on Myntra
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center mt-8">
                  <p className="mb-4 text-gray-600">Sign in to manage your wardrobe</p>
                  <button 
                    onClick={() => signIn('google')}
                    className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-6 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Image src="/google.svg" alt="Google" width={18} height={18} />
                    Sign in with Google
                  </button>
                </div>
              )}

              {/* Your Wardrobe Section */}
              {products.length > 0 && (
                <div>
                  <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    <div className="text-2xl font-semibold mb-4 md:mb-0">Your Wardrobe</div>
                    <div className="flex items-center gap-2">
                      {isSaving && (
                        <span className="text-gray-500 flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      )}
                      {saveSuccess && !isSaving && (
                        <span className="text-green-600 flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {saveSuccess}
                        </span>
                      )}
                      <span className="text-gray-500">{products.length} items</span>
                      <button
                        onClick={() => setShowDeleteAllConfirm(true)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors ml-4"
                        aria-label="Delete all items"
                      >
                        Delete All
                      </button>
                    </div>
                  </div>
                  
                  {/* Add sorting and filtering controls */}
                  <div className="mb-6 space-y-4">
                    {/* Search and main controls */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          placeholder="Search your wardrobe by name, brand, color or size..."
                          value={wardrobeFilter}
                          onChange={(e) => setWardrobeFilter(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {wardrobeFilter && (
                            <button
                              onClick={() => setWardrobeFilter('')}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <select
                          value={sortOption.type}
                          onChange={(e) => setSortOption({ ...sortOption, type: e.target.value as 'date' | 'name' | 'price' })}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        >
                          <option value="date">Date</option>
                          <option value="name">Name</option>
                          <option value="price">Price</option>
                        </select>

                        <select
                          value={sortOption.direction}
                          onChange={(e) => setSortOption({ ...sortOption, direction: e.target.value as 'asc' | 'desc' })}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        >
                          <option value="asc">Ascending</option>
                          <option value="desc">Descending</option>
                        </select>

                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                          Filters
                          {Object.values(filterOptions).some(v => Array.isArray(v) ? v.length > 0 : v.min !== 0 || v.max !== Infinity) && (
                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </button>

                        {selectedItems.size > 0 && (
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Selected ({selectedItems.size})
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filter panel */}
                    {showFilters && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Categories */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                            <select
                              multiple
                              value={filterOptions.categories}
                              onChange={(e) => setFilterOptions(prev => ({
                                ...prev,
                                categories: Array.from(e.target.selectedOptions, option => option.value)
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            >
                              {getUniqueValues(products, 'category').map(category => (
                                <option key={category?.toString() || 'uncategorized'} value={category || 'Uncategorized'}>
                                  {category || 'Uncategorized'}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Brands */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brands</label>
                            <select
                              multiple
                              value={filterOptions.brands}
                              onChange={(e) => setFilterOptions(prev => ({
                                ...prev,
                                brands: Array.from(e.target.selectedOptions, option => option.value)
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            >
                              {getUniqueValues(products, 'brand').map(brand => (
                                <option key={brand?.toString() || 'unknown'} value={brand || 'Unknown'}>
                                  {brand || 'Unknown'}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Retailers */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Retailers</label>
                            <select
                              multiple
                              value={filterOptions.retailers}
                              onChange={(e) => setFilterOptions(prev => ({
                                ...prev,
                                retailers: Array.from(e.target.selectedOptions, option => option.value)
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            >
                              {getUniqueValues(products, 'sourceRetailer').map(retailer => (
                                <option key={retailer?.toString() || 'unknown'} value={retailer || 'Unknown'}>
                                  {retailer || 'Unknown'}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Price Range */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                placeholder="Min"
                                value={filterOptions.priceRange.min || ''}
                                onChange={(e) => setFilterOptions(prev => ({
                                  ...prev,
                                  priceRange: {
                                    ...prev.priceRange,
                                    min: Number(e.target.value) || 0
                                  }
                                }))}
                                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                              />
                              <input
                                type="number"
                                placeholder="Max"
                                value={filterOptions.priceRange.max === Infinity ? '' : filterOptions.priceRange.max}
                                onChange={(e) => setFilterOptions(prev => ({
                                  ...prev,
                                  priceRange: {
                                    ...prev.priceRange,
                                    max: Number(e.target.value) || Infinity
                                  }
                                }))}
                                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                          </div>

                          {/* Sizes */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
                            <select
                              multiple
                              value={filterOptions.sizes}
                              onChange={(e) => setFilterOptions(prev => ({
                                ...prev,
                                sizes: Array.from(e.target.selectedOptions, option => option.value)
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            >
                              {getUniqueValues(products, 'size').map(size => (
                                <option key={size?.toString() || 'no-size'} value={size || ''}>
                                  {size || 'No Size'}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Colors */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                            <select
                              multiple
                              value={filterOptions.colors}
                              onChange={(e) => setFilterOptions(prev => ({
                                ...prev,
                                colors: Array.from(e.target.selectedOptions, option => option.value)
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            >
                              {getUniqueValues(products, 'color').map(color => (
                                <option key={color?.toString() || 'no-color'} value={color || ''}>
                                  {color || 'No Color'}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Filter actions */}
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setFilterOptions({
                              categories: [],
                              brands: [],
                              retailers: [],
                              priceRange: { min: 0, max: Infinity },
                              sizes: [],
                              colors: []
                            })}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                          >
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Update the WardrobeItem component to include selection */}
                  <div className="space-y-4">
                    {Object.entries(categorizeItems(getFilteredProducts()))
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([category, items]) => (
                      <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCategory(category)}
                          className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
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
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {items.map((product, index) => {
                                const globalIndex = products.findIndex(p => 
                                  p.name === product.name && 
                                  p.brand === product.brand && 
                                  p.image === product.image
                                );
                                
                                return (
                                  <div key={`${category}-${index}`} className="relative group">
                                    <div className="absolute top-2 left-2 z-10">
                                      <input
                                        type="checkbox"
                                        checked={selectedItems.has(product.id)}
                                        onChange={(e) => {
                                          const newSelected = new Set(selectedItems);
                                          if (e.target.checked) {
                                            newSelected.add(product.id);
                                          } else {
                                            newSelected.delete(product.id);
                                          }
                                          setSelectedItems(newSelected);
                                        }}
                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                      />
                                    </div>
                                      <WardrobeItem 
                                        product={product}
                                        onDelete={() => setShowDeleteConfirm(globalIndex)}
                                      />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add bulk delete confirmation modal */}
                  {selectedItems.size > 0 && showDeleteConfirm === null && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Delete Selected Items</h3>
                        <p className="text-gray-600 mb-6">
                          Are you sure you want to delete {selectedItems.size} selected items? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleBulkDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Delete Selected
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Add this before the closing main tag */}
            {showProductOverlay && searchResults.length > 0 && (
              <ProductOverlay
                products={searchResults}
                onSelect={handleProductSelect}
                onClose={handleOverlayClose}
              />
            )}

            {imagePreview && (
              <div className="fixed bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg">
                <img 
                  src={imagePreview} 
                  alt="Uploaded preview" 
                  className="w-24 h-24 object-cover rounded"
                />
                {isProcessingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                    <div className="text-white text-sm">Processing...</div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {pdfText && (
              <div className="mt-8 w-full max-w-6xl">
                <h2 className="text-2xl font-bold mb-4">Extracted Text from PDF</h2>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {pdfText}
                  </pre>
                </div>
              </div>
            )}

            {saveSuccess && (
              <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {saveSuccess}
              </div>
            )}

            {/* Delete All Confirmation Modal */}
            {showDeleteAllConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                  <h3 className="text-lg font-semibold mb-4">Delete All Items</h3>
                  <p className="text-gray-600 mb-6">Are you sure you want to remove all {products.length} items from your wardrobe? This action cannot be undone.</p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowDeleteAllConfirm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAllItems}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Deleting...' : 'Delete All'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm !== null && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                  <h3 className="text-lg font-semibold mb-4">Delete Item</h3>
                  <p className="text-gray-600 mb-6">Are you sure you want to remove this item from your wardrobe?</p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(showDeleteConfirm)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add SavedOutfits section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t">
        <h2 className="text-2xl font-semibold mb-6">Saved Outfits</h2>
        <SavedOutfits />
      </div>

      {/* Add OutfitCalendar section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t">
        <h2 className="text-2xl font-semibold mb-6">Outfit Calendar</h2>
        <OutfitCalendar />
      </div>

      {/* FullBodyPhotoUpload section at the bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t">
        <FullBodyPhotoUpload />
      </div>

    </main>
  )
}
