'use client'
import React, { useState, FormEvent, useRef, useEffect, ClipboardEvent as ReactClipboardEvent } from 'react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { useWardrobe } from '@/contexts/WardrobeContext'
import { useWardrobeNotification } from '@/contexts/WardrobeNotificationContext'
import { toast } from 'react-toastify'
import { categorizeItem } from '@/lib/categorize-items'
import { ConfirmationModal } from '@/components/ConfirmationFlow'
import { WardrobeItem as ConfirmationItem } from '@/types/wardrobe'

const inter = Inter({ subsets: ['latin'] })

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface MyntraProduct {
  brand: string;
  name: string;
  price: string;
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
  subCategory?: string;
  color?: string;
  pattern?: string;
  fabric?: string;
  dateAdded: string;
  size?: string;
  quantity?: string;
  seller?: string;
  sourceRetailer?: string;
  id: string;
}

interface WardrobeItem {
  url: string;
  type: 'youtube' | 'myntra' | 'other';
  videoId?: string;
  preview?: LinkPreview;
  myntraData?: MyntraProduct;
  loading?: boolean;
  dateAdded?: string; // Make sure dateAdded is a string to match MyntraProduct
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

const WardrobeItem = ({ product, onDelete }: { product: MyntraProduct, onDelete: () => void }) => (
  <div className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
    <div className="aspect-square relative">
      <div className="absolute inset-0">
        <img
          src={product.image || product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <button
        onClick={onDelete}
        className="delete-button absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete item"
      >
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {product.price && (
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-900">
          {product.price}
        </div>
      )}
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-gray-900 line-clamp-1">
            {product.brand || 'Unknown Brand'}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {product.name}
          </p>
        </div>
      </div>
      {product.category && (
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
            {product.category}
          </span>
        </div>
      )}
      {product.productLink && (
        <a
          href={product.productLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center text-sm text-purple-600 hover:text-purple-700 gap-1"
        >
          <span>View Product</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  </div>
);

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

    // ====== MEN'S BOTTOMWEAR ======
    'Mens Jeans': ['jeans', 'denim jean', 'denim jeans', 'jean', 'men jeans', 'men jean', 'H&M jeans'],
    'Casual Trousers': ['casual trouser', 'casual trousers', 'chinos', 'khakis', 'casual pant', 'casual pants', 'men casual trouser', 'men casual trousers', 'men chinos', 'H&M trousers'],
    'Mens Shorts': ['short', 'shorts', 'bermuda', 'bermudas', 'cargo short', 'cargo shorts', 'denim short', 'denim shorts', 'men short', 'men shorts', 'H&M shorts'],
    'Track Pants & Joggers': ['track pant', 'track pants', 'jogger', 'joggers', 'trackpant', 'trackpants', 'track bottom', 'track bottoms', 'athletic pant', 'athletic pants', 'sweatpant', 'sweatpants', 'drawstring pant', 'drawstring pants', 'dressy jogger', 'dressy joggers', 'men jogger', 'men joggers'],

    // ====== MEN'S INNERWEAR & SLEEPWEAR ======
    'Briefs & Trunks': ['brief', 'briefs', 'trunk', 'trunks', 'underwear', 'underwears', 'undergarment', 'undergarments', 'men brief', 'men briefs', 'men trunk', 'men trunks', 'H&M underwear'],
    'Boxers': ['boxer', 'boxers', 'boxer brief', 'boxer briefs', 'boxer short', 'boxer shorts', 'men boxer', 'men boxers'],
    'Vests': ['vest', 'vests', 'undershirt', 'undershirts', 'sleeveless undershirt', 'sleeveless undershirts', 'inner vest', 'inner vests', 'men vest', 'men vests'],
    'Mens Sleepwear & Loungewear': ['sleepwear', 'loungewear', 'pajama', 'pajamas', 'pyjama', 'pyjamas', 'lounge pant', 'lounge pants', 'night suit', 'night suits', 'night dress', 'night dresses', 'sleep shirt', 'sleep shirts', 'men sleepwear', 'lounge short', 'lounge shorts', 'sleep short', 'sleep shorts', 'night short', 'night shorts', 'H&M sleepwear'],
    'Mens Thermals': ['thermal', 'thermals', 'thermal wear', 'winter thermal', 'winter thermals', 'heat tech', 'warm underwear', 'men thermal', 'men thermals'],

    // ====== WOMEN'S WESTERN WEAR ======
    'Dresses': ['dress', 'dresses', 'gown', 'gowns', 'maxi', 'maxis', 'midi dress', 'midi dresses', 'a-line dress', 'a-line dresses', 'bodycon', 'bodycons', 'shift dress', 'shift dresses', 'women dress', 'women dresses', 'H&M dress', 'H&M dresses'],
    'Womens Tops': ['women top', 'women tops', 'ladies top', 'ladies tops', 'fashion top', 'fashion tops', 'crop top', 'crop tops', 'camisole', 'camisoles', 'women blouse', 'women blouses', 'ladies blouse', 'ladies blouses', 'women shirt', 'women shirts', 'ladies shirt', 'ladies shirts', 'H&M top', 'H&M tops'],
    'Womens Jeans': ['women jeans', 'ladies jeans', 'skinny jeans', 'boyfriend jeans', 'straight leg jeans', 'women denim', 'H&M jeans for women'],
    'Trousers & Capris': ['women trouser', 'women trousers', 'capri', 'capris', 'cropped pant', 'cropped pants', 'cigarette pant', 'cigarette pants', 'culottes', 'ladies pant', 'ladies pants', 'H&M trousers for women'],
    'Shorts & Skirts': ['women short', 'women shorts', 'ladies short', 'ladies shorts', 'mini skirt', 'mini skirts', 'midi skirt', 'midi skirts', 'maxi skirt', 'maxi skirts', 'denim skirt', 'denim skirts', 'pleated skirt', 'pleated skirts', 'H&M shorts for women'],

    // ====== WOMEN'S FOOTWEAR ======
    'Womens Casual Shoes': ['women casual shoe', 'women casual shoes', 'ladies sneaker', 'ladies sneakers', 'slip on shoe', 'slip on shoes', 'fashion sneaker', 'fashion sneakers', 'women everyday shoe', 'women everyday shoes'],

    // Add other categories
    'Overshirts': ['overshirt', 'overshirts', 'shacket', 'shackets', 'men overshirt', 'men overshirts'],
    // ... existing code ...
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
  const { 
    items: products, 
    isLoading, 
    error: wardrobeError, 
    refreshItems: loadUserWardrobe, 
    addItem, 
    saveWardrobe,
    categorizedItems,
    removeItem,
    clearWardrobe
  } = useWardrobe();
  
  const { showNotification } = useWardrobeNotification();
  const { data: session, status } = useSession();
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [showProductOverlay, setShowProductOverlay] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  // Add state for expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  // Add state for wardrobe search/filter
  const [wardrobeFilter, setWardrobeFilter] = useState('');
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
  const [urlInputValue, setUrlInputValue] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingItems, setPendingItems] = useState<ConfirmationItem[]>([]);
  // ... rest of the code ...

  // Display combined error from both sources
  const error = localError || wardrobeError;

  // Expand the first category automatically when products load
  useEffect(() => {
    if (products.length > 0) {
      const firstCategory = Object.keys(categorizedItems)[0];
      if (firstCategory) {
        setExpandedCategories(prev => ({
          ...prev,
          [firstCategory]: true
        }));
      }
    }
  }, [products, categorizedItems]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!inputValue) return

    setSearchResults([])

    try {
      // Check if input is a Myntra URL
      if (inputValue.includes('myntra.com')) {
        await addProductToWardrobe(inputValue)
      } else {
        // Handle as search query
        const response = await fetch(`/api/myntra-search?q=${encodeURIComponent(inputValue)}`)
        if (!response.ok) {
          throw new Error('Failed to search products')
        }
        const data = await response.json()
        setSearchResults(data)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const addProductToWardrobe = async (url: string) => {
    if (!session) {
      return;
    }

    try {
      let productUrl = url;
      if (!url.startsWith('http')) {
        productUrl = url.startsWith('/') 
          ? `https://www.myntra.com${url}`
          : `https://www.myntra.com/${url}`;
      }
      
      setIsProductLoading(true);
      const response = await fetch(`/api/myntra-product?url=${encodeURIComponent(productUrl)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch product');
      }
      
      const data = await response.json();
      
      // Run categorization before creating the items for confirmation flow
      // Use categorizeItem function to determine the best category
      const productCategory = data.category || categorizeItem({
        name: data.name || 'Product',
        brand: data.brand || '',
        color: data.color || '',
        sourceRetailer: data.sourceRetailer || ''
      });
      
      // Create items for confirmation flow with brand from API response and categorized item
      const newItems: ConfirmationItem[] = [{
        id: Date.now().toString(),
        name: data.name || 'Product',
        brand: data.brand || '', // Initialize brand from API response
        category: productCategory, // Use the determined category
        imageUrl: data.image || data.images?.[0] || '',
      }];
      
      setPendingItems(newItems);
      setShowConfirmation(true);
      
      setInputValue('');
      setUrlInputValue('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding product:', error);
      setLocalError(error instanceof Error ? error.message : 'Failed to fetch product');
    } finally {
      setIsProductLoading(false);
    }
  };
  
  const handleConfirmItems = async (items: ConfirmationItem[]) => {
    try {
      // Map confirmed items to required WardrobeItem format
      const productsToAdd = items.map(item => ({
        id: item.id,
        // Use the edited brand if provided, otherwise use name-based fallback
        brand: item.brand || item.name.split(' ')[0] || 'Unknown Brand',
        name: item.name,
        price: '',
        category: item.category,
        image: item.imageUrl,
        dateAdded: new Date(),
        productLink: urlInputValue
      }));
      
      // Add each product to wardrobe
      for (const product of productsToAdd) {
        await addItem(product);
      }
      
      showNotification({
        type: 'success',
        message: `${items.length} item${items.length === 1 ? '' : 's'} added to your wardrobe`,
        itemCount: items.length
      });
      
      setShowConfirmation(false);
      setPendingItems([]);
    } catch (error) {
      console.error('Error confirming items:', error);
      setLocalError(error instanceof Error ? error.message : 'Failed to add items to wardrobe');
    }
  };
  
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setPendingItems([]);
  };

  const handleProductSelect = async (url: string) => {
    try {
      await addProductToWardrobe(url)
      handleOverlayClose()
    } catch (error) {
      console.error('Error in product selection:', error)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsProcessingImage(true)
      setLocalError(null)
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
      setLocalError(error instanceof Error ? error.message : 'Failed to process image')
    } finally {
      setIsProcessingImage(false)
    }
  }

  const handlePdfUpload = async (file: File) => {
    try {
      setLocalError(null);
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

        // Add each item to the wardrobe context
        for (const product of newProducts) {
          await addItem(product);
        }
        
        setLocalError(`Successfully added ${newProducts.length} items to your wardrobe.`);
      } else {
        setLocalError('No items found in the PDF.');
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      setLocalError(error instanceof Error ? error.message : 'Failed to process PDF');
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

  const handleDeleteProduct = (index: number) => {
    // Get the product from the index
    const product = products[index];
    if (product?.id) {
      removeItem(product.id)
        .then(() => {
          setShowDeleteConfirm(null);
          showNotification({
            type: 'success',
            message: 'Item removed from your wardrobe',
            itemCount: 1  // Specifying that 1 item was affected
          });
        })
        .catch(error => {
          setLocalError(error instanceof Error ? error.message : 'Failed to remove item');
        });
    }
  }

  const handleDeleteAllItems = async () => {
    try {
      await clearWardrobe();
      showNotification({
        type: 'success',
        message: 'All items successfully removed from your wardrobe',
        itemCount: products.length  // Specifying the number of items removed
      });
      // Close the confirmation dialog
      setShowDeleteAllConfirm(false);
    } catch (error) {
      console.error('Error deleting all items:', error);
      showNotification({
        type: 'error',
        message: 'Failed to delete all items',
        itemCount: 0  // No items affected in case of error
      });
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
          const priceA = getPriceAsNumber(a.price);
          const priceB = getPriceAsNumber(b.price);
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
      return getSortedProducts(products as unknown as MyntraProduct[]);
    }
    
    return getSortedProducts((products as unknown as MyntraProduct[]).filter(product => {
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
        filterOptions.brands.includes(product.brand || '');

      // Retailer filter
      const retailerMatch = filterOptions.retailers.length === 0 ||
        filterOptions.retailers.includes(product.sourceRetailer || 'Unknown');

      // Price filter
      const price = getPriceAsNumber(product.price);
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
    
    try {
      // Use Promise.all to delete all selected items in parallel
      await Promise.all(
        Array.from(selectedItems).map(id => removeItem(id))
      );
      
      // Clear selected items
      setSelectedItems(new Set());
      
      // Show success message
      showNotification({
        type: 'success',
        message: `${selectedItems.size} items removed from your wardrobe`,
        itemCount: selectedItems.size  // Use the actual count of selected items
      });
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Failed to remove selected items');
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 lg:p-12">
      <div className="flex flex-col items-center">
        {/* User profile section removed since it's already in the navigation bar */}
        
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-2">
        Organize Your Wardrobe, <br />Elevate Your Style
        </h1>
        
        <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
          Your personal wardrobe assistant that helps you manage, style, and optimize your clothing collection.
        </p>
        
        {session ? (
          <div className="relative max-w-2xl mx-auto mb-16">
            <div className="flex flex-col gap-6">
              <a 
                href="/email-fetcher" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg px-8 py-4 text-center hover:opacity-90 transition-all mb-4 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Import Items from Your Email
              </a>

              {/* Product URL Form */}
              <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Product by URL</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!urlInputValue) return;
                  addProductToWardrobe(urlInputValue);
                }} className="flex flex-col gap-4">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Paste a product URL here (e.g., https://www2.hm.com/...)"
                      value={urlInputValue}
                      onChange={(e) => setUrlInputValue(e.target.value)}
                      className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {urlInputValue && (
                      <button
                        type="button"
                        onClick={() => setUrlInputValue('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-purple-600 transition-colors"
                        aria-label="Clear URL"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                    disabled={isProductLoading || !urlInputValue}
                  >
                    {isProductLoading ? 'Fetching...' : 'Fetch Product'}
                  </button>
                </form>
              </div>

              {/* Product Search Form */}
              <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Search for Products</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!inputValue) return;
                  
                  // Only handle as search query
                  setSearchResults([]);
                  setLocalError(null);
                  
                  fetch(`/api/myntra-search?q=${encodeURIComponent(inputValue)}`)
                    .then(response => {
                      if (!response.ok) {
                        throw new Error('Failed to search products');
                      }
                      return response.json();
                    })
                    .then(data => {
                      setSearchResults(data);
                    })
                    .catch(error => {
                      console.error('Error:', error);
                      setLocalError(error.message);
                    });
                }} className="flex flex-col gap-4">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search for products (e.g., 'blue cotton shirt')"
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
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                    disabled={isProductLoading || !inputValue}
                  >
                    {isProductLoading ? 'Searching...' : 'Search Products'}
                  </button>
                </form>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg mt-4">
                  {error}
                </div>
              )}
            </div>

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
              <Image src="/google.svg" alt="Google" width={18} height={18} style={{ width: 'auto', height: 'auto' }} />
              Sign in with Google
            </button>
          </div>
        )}

        {/* Removed redundant Outfit Planner Banner */}

        {/* Your Wardrobe Section */}
        {products.length > 0 && (
          <div>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="text-2xl font-semibold mb-4 md:mb-0">Your Wardrobe</div>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <span className="text-gray-500 flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                )}
                {saveSuccess && !isLoading && (
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
                        {getUniqueValues(products as unknown as MyntraProduct[], 'category').map(category => (
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
                        {getUniqueValues(products as unknown as MyntraProduct[], 'brand').map(brand => (
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
                        {getUniqueValues(products as unknown as MyntraProduct[], 'sourceRetailer').map(retailer => (
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
                        {getUniqueValues(products as unknown as MyntraProduct[], 'size').map(size => (
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
                        {getUniqueValues(products as unknown as MyntraProduct[], 'color').map(color => (
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
              {Object.entries(categorizeItems(getFilteredProducts() as unknown as MyntraProduct[]))
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
                                  onClick={(e) => e.stopPropagation()} // Prevent parent click
                                />
                              </div>
                              {/* Add click handler to the div wrapping WardrobeItem */}
                              <div 
                                onClick={(e) => {
                                  // Don't trigger if the delete button or checkbox was clicked
                                  if (!(e.target as Element).closest('.delete-button')) {
                                    // Make sure we have the correct category by running categorization
                                    const productCategory = product.category || categorizeItem({
                                      name: product.name,
                                      brand: product.brand || '',
                                      color: product.color || '',
                                      sourceRetailer: product.sourceRetailer || ''
                                    });
                                    
                                    setPendingItems([{
                                      id: product.id,
                                      name: product.name,
                                      brand: product.brand || '',
                                      category: productCategory, // Use determined category
                                      imageUrl: product.image || ''
                                    }]);
                                    setShowConfirmation(true);
                                  }
                                }}
                              >
                                <WardrobeItem 
                                  product={product}
                                  onDelete={() => setShowDeleteConfirm(globalIndex)}
                                />
                              </div>
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
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete All'}
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

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          items={pendingItems}
          onConfirm={handleConfirmItems}
          onCancel={handleCancelConfirmation}
          // We're currently only using this from URL import flow, not wardrobe
          isWardrobe={false}
        />
      )}
    </main>
  )
}
