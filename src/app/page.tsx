'use client'
import React, { useState, FormEvent, useRef, useEffect, ClipboardEvent as ReactClipboardEvent } from 'react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { prisma } from '@/lib/prisma'

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
  <div className="relative group">
    <div className="aspect-square relative">
      <div className="absolute inset-0">
        <img
          src={product.image || product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-contain bg-gray-50"
        />
      </div>
    </div>
    <div className="p-4 bg-white">
      <h3 className="font-semibold mb-1">{product.brand}</h3>
      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.name}</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold">{product.price}</span>
        {product.originalPrice && (
          <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
        )}
        {product.discount && (
          <span className="text-sm text-green-600">{product.discount}</span>
        )}
      </div>
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
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete item"
        >
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
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
    'T-Shirts': ['t-shirt', 't shirt', 'tshirt', 'tee', 'men t-shirt', 'men tee'],
    'Casual Shirts': ['casual shirt', 'linen shirt', 'denim shirt', 'oxford shirt', 'chambray shirt', 'men casual shirt'],
    'Formal Shirts': ['formal shirt', 'dress shirt', 'business shirt', 'office shirt', 'men formal shirt'],
    'Sweatshirts': ['sweatshirt', 'pullover sweat', 'hooded sweatshirt', 'men sweatshirt'],
    'Sweaters': ['sweater', 'pullover', 'cardigan', 'jumper', 'knit', 'men sweater'],
    'Jackets': ['jacket', 'bomber', 'trucker jacket', 'denim jacket', 'zip-up jacket', 'men jacket'],
    'Blazers & Coats': ['blazer', 'coat', 'sports coat', 'suit jacket', 'overcoat', 'trench coat', 'men blazer', 'men coat'],
    'Suits': ['suit', 'three piece', 'two piece suit', 'tuxedo', 'men suit'],
    'Rain Jackets': ['rain jacket', 'raincoat', 'waterproof jacket', 'windcheater', 'men rain jacket'],

    // ====== MEN'S BOTTOMWEAR ======
    'Mens Jeans': ['jeans', 'denim jean', 'jean', 'men jeans', 'men jean'],
    'Casual Trousers': ['casual trouser', 'chinos', 'khakis', 'casual pant', 'men casual trouser', 'men chinos'],
    'Formal Trousers': ['formal trouser', 'dress pant', 'dress trouser', 'suit pant', 'office trouser', 'men formal trouser'],
    'Mens Shorts': ['shorts', 'bermuda', 'cargo shorts', 'denim shorts', 'men shorts'],
    'Track Pants & Joggers': ['track pant', 'jogger', 'joggers', 'trackpant', 'track bottom', 'athletic pant', 'sweatpant', 'drawstring pant', 'dressy jogger', 'men jogger'],

    // ====== MEN'S INNERWEAR & SLEEPWEAR ======
    'Briefs & Trunks': ['brief', 'trunk', 'underwear', 'undergarment', 'men brief', 'men trunk'],
    'Boxers': ['boxer', 'boxer brief', 'boxer short', 'men boxer'],
    'Vests': ['vest', 'undershirt', 'sleeveless undershirt', 'inner vest', 'men vest'],
    'Mens Sleepwear & Loungewear': ['sleepwear', 'loungewear', 'pajama', 'pyjama', 'lounge pant', 'night suit', 'night dress', 'sleep shirt', 'men sleepwear'],
    'Mens Thermals': ['thermal', 'thermal wear', 'winter thermal', 'heat tech', 'warm underwear', 'men thermal'],

    // ====== MEN'S INDIAN & FESTIVE WEAR ======
    'Kurtas & Kurta Sets': ['kurta', 'kurta set', 'kurta pajama', 'kurta pyjama', 'men kurta'],
    'Sherwanis': ['sherwani', 'wedding sherwani', 'groom sherwani'],
    'Nehru Jackets': ['nehru jacket', 'modi jacket', 'waistcoat', 'ethnic jacket', 'indian jacket'],
    'Dhotis': ['dhoti', 'dhoti pant', 'ethnic bottom', 'men dhoti'],

    // ====== MEN'S PLUS SIZE ======
    'Mens Plus Size': ['plus size', 'plus-size', 'oversized', 'plus fit', 'extended size', 'men plus size'],
    
    // ====== MEN'S FOOTWEAR ======
    'Mens Casual Shoes': ['casual shoe', 'everyday shoe', 'lifestyle shoe', 'men casual shoe'],
    'Mens Sports Shoes': ['sports shoe', 'running shoe', 'training shoe', 'athletic shoe', 'gym shoe', 'men sports shoe'],
    'Formal Shoes': ['formal shoe', 'oxford', 'brogue', 'derby', 'loafer', 'monk shoe', 'dress shoe', 'men formal shoe'],
    'Sneakers': ['sneaker', 'casual sneaker', 'fashion sneaker', 'high-top', 'low-top', 'men sneaker'],
    'Sandals & Floaters': ['sandal', 'floater', 'slider', 'open toe', 'men sandal'],
    'Flip Flops': ['flip flop', 'thong', 'beach sandal', 'slipper', 'men flip flop'],
    'Mens Socks': ['sock', 'ankle sock', 'crew sock', 'no-show sock', 'low cut sock', 'men sock'],
    
    // ====== PERSONAL CARE & GROOMING ======
    'Personal Care & Grooming': ['grooming', 'personal care', 'skincare', 'face wash', 'moisturizer', 'sunscreen', 'men grooming'],
    
    // ====== SUNGLASSES & FRAMES ======
    'Sunglasses & Frames': ['sunglasses', 'eyeglasses', 'spectacles', 'frames', 'sun glass', 'shades'],
    
    // ====== WATCHES ======
    'Mens Watches': ['watch', 'wristwatch', 'analog watch', 'digital watch', 'chronograph', 'men watch'],
    
    // ====== SPORTS & ACTIVE WEAR ======
    'Sports Sandals': ['sports sandal', 'hiking sandal', 'outdoor sandal'],
    'Active T-Shirts': ['active t-shirt', 'gym t-shirt', 'workout tee', 'sport tee', 'training t-shirt', 'dry fit', 'quick dry'],
    'Track Pants & Shorts': ['track pant', 'athletic short', 'running short', 'gym short', 'workout pant'],
    'Tracksuits': ['tracksuit', 'training suit', 'warm up suit', 'athletic set'],
    'Sports Jackets & Sweatshirts': ['sports jacket', 'athletic jacket', 'hoodie', 'workout sweatshirt', 'gym hoodie'],
    'Mens Sports Accessories': ['sports accessory', 'wristband', 'headband', 'sport sock', 'gym glove'],
    'Mens Swimwear': ['swimwear', 'swim trunk', 'swimming short', 'swim brief', 'men swimwear'],
    
    // ====== GADGETS ======
    'Smart Wearables': ['smart watch', 'fitness tracker', 'smart band', 'activity tracker'],
    'Fitness Gadgets': ['fitness gadget', 'smart scale', 'muscle massager', 'fitness monitor'],
    'Headphones': ['headphone', 'earphone', 'earbud', 'wireless earphone', 'airpod'],
    'Speakers': ['speaker', 'bluetooth speaker', 'wireless speaker', 'portable speaker'],
    
    // ====== FASHION ACCESSORIES ======
    'Mens Wallets': ['wallet', 'card holder', 'money clip', 'billfold', 'men wallet'],
    'Mens Belts': ['belt', 'leather belt', 'casual belt', 'formal belt', 'men belt'],
    'Mens Perfumes': ['perfume', 'fragrance', 'cologne', 'body mist', 'body spray', 'eau de toilette', 'men perfume'],
    'Trimmers': ['trimmer', 'beard trimmer', 'shaver', 'grooming kit'],
    'Mens Deodorants': ['deodorant', 'antiperspirant', 'body spray', 'deo stick', 'men deodorant'],
    'Ties, Cufflinks & Pocket Squares': ['tie', 'necktie', 'bow tie', 'cufflink', 'pocket square', 'handkerchief'],
    'Accessory Gift Sets': ['gift set', 'accessory set', 'wallet belt set', 'tie cufflink set'],
    'Mens Caps & Hats': ['cap', 'hat', 'beanie', 'snapback', 'baseball cap', 'fedora', 'men cap', 'men hat'],
    'Mens Mufflers & Scarves': ['muffler', 'scarf', 'glove', 'mitten', 'winter accessory', 'men scarf', 'men glove'],
    'Phone Cases': ['phone case', 'mobile cover', 'phone cover', 'smartphone case'],
    'Mens Rings & Wristwear': ['ring', 'bracelet', 'wristband', 'bangle', 'men bracelet', 'men ring'],
    'Helmets': ['helmet', 'bike helmet', 'motorcycle helmet'],
    
    // ====== BAGS & BACKPACKS ======
    'Mens Bags & Backpacks': ['bag', 'backpack', 'laptop bag', 'messenger bag', 'duffel bag', 'gym bag', 'sling bag', 'men bag', 'men backpack'],
    
    // ====== LUGGAGES & TROLLEYS ======
    'Mens Luggages': ['luggage', 'trolley', 'suitcase', 'cabin bag', 'travel bag', 'hard case'],

    // ====== WOMEN'S INDIAN & FUSION WEAR ======
    'Kurtas & Suits': ['women kurta', 'women suit', 'ladies kurta', 'kurti', 'salwar kameez', 'anarkali', 'women ethnic suit'],
    'Kurtis, Tunics & Tops': ['kurti', 'ethnic top', 'tunic', 'ladies top', 'ethnic tunic', 'women kurti'],
    'Sarees': ['saree', 'sari', 'silk saree', 'cotton saree', 'designer saree'],
    'Ethnic Wear': ['ethnic wear', 'ethnic dress', 'lehenga', 'choli', 'dupatta', 'gown', 'women ethnic'],
    'Leggings, Salwars & Churidars': ['legging', 'salwar', 'churidar', 'patiala', 'palazzo', 'ethnic pant', 'women legging'],
    'Skirts & Palazzos': ['skirt', 'palazzo pant', 'ethnic skirt', 'long skirt', 'maxi skirt', 'women skirt'],
    'Dress Materials': ['dress material', 'fabric', 'unstitched', 'suit material', 'ethnic fabric'],
    'Lehenga Cholis': ['lehenga', 'lehenga choli', 'bridal lehenga', 'wedding lehenga', 'ghagra choli'],
    'Dupattas & Shawls': ['dupatta', 'shawl', 'stole', 'ethnic scarf', 'women shawl'],
    
    // ====== WOMEN'S WESTERN WEAR ======
    'Dresses': ['dress', 'gown', 'maxi', 'midi dress', 'a-line dress', 'bodycon', 'shift dress', 'women dress'],
    'Womens Tops': ['women top', 'ladies top', 'fashion top', 'crop top', 'camisole', 'women blouse', 'ladies blouse', 'women shirt', 'ladies shirt'],
    'Tshirts': ['women t-shirt', 'ladies tee', 'graphic tee', 'printed t-shirt', 'basic tee', 'women tshirt'],
    'Womens Jeans': ['women jeans', 'ladies jeans', 'skinny jeans', 'boyfriend jeans', 'straight leg jeans', 'women denim'],
    'Trousers & Capris': ['trouser', 'capri', 'cropped pant', 'cigarette pant', 'culottes', 'women trouser', 'ladies pant'],
    'Shorts & Skirts': ['women short', 'ladies short', 'mini skirt', 'midi skirt', 'maxi skirt', 'denim skirt', 'pleated skirt'],
    'Co-ords': ['co-ord', 'matching set', 'twin set', 'two piece set', 'coordinate set'],
    'Playsuits': ['playsuit', 'romper', 'short jumpsuit', 'beach playsuit'],
    'Jumpsuits': ['jumpsuit', 'overalls', 'dungarees', 'women jumpsuit', 'ladies jumpsuit'],
    'Shrugs': ['shrug', 'bolero', 'cover up', 'women shrug', 'ladies shrug'],
    'Womens Sweaters & Sweatshirts': ['women sweater', 'ladies sweatshirt', 'women pullover', 'women cardigan', 'knit top'],
    'Womens Jackets & Coats': ['women jacket', 'ladies coat', 'women blazer', 'parka', 'trench coat', 'women outerwear'],
    'Blazers & Waistcoats': ['women blazer', 'ladies waistcoat', 'women vest', 'suit jacket'],
    
    // ====== WOMEN'S PLUS SIZE ======
    'Womens Plus Size': ['women plus size', 'plus size dress', 'plus size top', 'plus size jeans', 'curve', 'extended size women'],
    
    // ====== MATERNITY ======
    'Maternity': ['maternity', 'pregnancy', 'prenatal', 'pregnant', 'nursing', 'maternal', 'maternity wear'],
    
    // ====== WOMEN'S LINGERIE & SLEEPWEAR ======
    'Bra': ['bra', 'brassiere', 'sports bra', 'push up bra', 'padded bra', 'nursing bra', 'strapless bra'],
    'Womens Briefs': ['women brief', 'panty', 'underwear', 'womens underwear', 'ladies brief', 'bikini brief'],
    'Shapewear': ['shapewear', 'body shaper', 'slimming underwear', 'control brief', 'corset', 'waist trainer'],
    'Womens Sleepwear': ['women sleepwear', 'nightdress', 'nightgown', 'pajama set', 'women loungewear', 'lounge pant women'],
    'Womens Swimwear': ['women swimwear', 'swimsuit', 'bikini', 'one piece', 'swimming costume', 'beachwear'],
    'Camisoles & Thermals': ['camisole', 'slip', 'women thermal', 'inner wear', 'tank top', 'spaghetti top'],
    
    // ====== WOMEN'S FOOTWEAR ======
    'Flats': ['flat', 'ballet flat', 'moccasin', 'loafer', 'women flat', 'ladies flat', 'slip on', 'women shoe'],
    'Womens Casual Shoes': ['women casual shoe', 'ladies sneaker', 'slip on shoe', 'fashion sneaker', 'women everyday shoe'],
    'Heels': ['heel', 'stiletto', 'pump', 'platform heel', 'wedge', 'block heel', 'high heel', 'kitten heel'],
    'Boots': ['women boot', 'ankle boot', 'knee high boot', 'ladies boot', 'winter boot', 'chelsea boot'],
    'Womens Sports Shoes': ['women sports shoe', 'ladies running shoe', 'women athletic shoe', 'women floater'],
    
    // ====== WOMEN'S SPORTS & ACTIVE WEAR ======
    'Womens Sports Clothing': ['women sportswear', 'activewear', 'gym wear', 'workout clothing', 'yoga wear', 'fitness apparel'],
    'Womens Sports Footwear': ['women sport shoe', 'training shoe', 'running shoe', 'women gym shoe', 'yoga shoe'],
    'Womens Sports Accessories': ['women sport accessory', 'fitness accessory', 'yoga mat', 'gym bag', 'water bottle'],
    'Sports Equipment': ['sports equipment', 'fitness equipment', 'yoga props', 'exercise equipment', 'home gym'],
    
    // ====== BEAUTY & PERSONAL CARE ======
    'Makeup': ['makeup', 'cosmetic', 'foundation', 'lipstick', 'mascara', 'eyeliner', 'blush', 'beauty product'],
    'Skincare': ['skincare', 'face cream', 'serum', 'moisturizer', 'face wash', 'sunscreen', 'beauty treatment'],
    'Premium Beauty': ['premium beauty', 'luxury cosmetic', 'high end makeup', 'designer beauty', 'prestige beauty'],
    'Lipsticks': ['lipstick', 'lip color', 'lip gloss', 'liquid lipstick', 'lip stain', 'lip product'],
    'Fragrances': ['women perfume', 'ladies fragrance', 'eau de parfum', 'women cologne', 'women body mist', 'scent'],
    
    // ====== JEWELLERY ======
    'Fashion Jewellery': ['fashion jewellery', 'costume jewellery', 'artificial jewellery', 'statement necklace', 'fashion earring'],
    'Fine Jewellery': ['fine jewellery', 'gold jewellery', 'silver jewellery', 'pearl jewellery', 'precious stone'],
    'Earrings': ['earring', 'stud', 'hoop earring', 'drop earring', 'chandelier earring', 'ear cuff'],
    
    // ====== WOMEN'S ACCESSORIES ======
    'Belts, Scarves & More': ['women belt', 'ladies scarf', 'women glove', 'women hair accessory', 'women fashion accessory'],
    'Watches & Wearables': ['women watch', 'ladies wristwatch', 'women fitness tracker', 'women smart watch', 'fashion watch'],
    'Womens Backpacks': ['women backpack', 'ladies backpack', 'fashion backpack', 'mini backpack', 'women rucksack'],
    'Handbags, Bags & Wallets': ['handbag', 'purse', 'clutch', 'tote bag', 'shoulder bag', 'crossbody bag', 'women wallet'],
    'Womens Luggages': ['women luggage', 'ladies suitcase', 'travel bag women', 'carry on', 'women trolley'],
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
    
    // Special case: handle joggers and track pants first to avoid misclassification
    if (/\b(jogger|track\s*pant|sweat\s*pant)\b/i.test(nameAndDesc)) {
      const category = 'Track Pants & Joggers';
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
    else if (/\b(bra|panty|underwear|lingerie|shapewear|bodysuit)\b/i.test(nameAndDesc)) {
      let category = 'Briefs';
      if (/\b(bra|brassiere)\b/i.test(nameAndDesc)) {
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
    
    // Special case: handle bottomwear that might be incorrectly classified as dresses
    else if (/\b(trouser|pant|chino|jeans|shorts)\b/i.test(nameAndDesc) && nameAndDesc.includes('dressy')) {
      // Check specific keywords to determine exact category
      let category = 'Casual Trousers';
      
      if (/\bjogger|\btrack pant/i.test(nameAndDesc)) {
        category = 'Track Pants & Joggers';
      } else if (/\bjean/i.test(nameAndDesc)) {
        category = 'Mens Jeans';
      } else if (/\bshort/i.test(nameAndDesc)) {
        category = 'Mens Shorts';
      } else if (/\bformal|\bdress pant/i.test(nameAndDesc)) {
        category = 'Formal Trousers';
      } else if (/\bwomen|\bladies/i.test(nameAndDesc)) {
        category = 'Trousers & Capris';
      }
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
      matched = true;
    }
    
    // General category matching
    if (!matched) {
      // First pass: search for exact matches using word boundaries
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
          // Use word boundary checks for more accurate matching
          const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'i');
          if (regex.test(nameAndDesc)) {
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
      
      // Second pass: if no match found, try partial matches
      if (!matched) {
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
          for (const keyword of keywords) {
            if (nameAndDesc.includes(keyword)) {
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
      }
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
  // Add state for expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  // Add state for wardrobe search/filter
  const [wardrobeFilter, setWardrobeFilter] = useState('')

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
    // Don't save if there are no products or no session
    if (!products.length || !session?.user?.id) return;
    
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
  }, [products]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!inputValue) return

    setIsLoading(true)
    setError(null)
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
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const addProductToWardrobe = async (url: string) => {
    if (!session) {
      setError('Please sign in to add items to your wardrobe');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      let productUrl = url;
      if (!url.startsWith('http')) {
        productUrl = url.startsWith('/') 
          ? `https://www.myntra.com${url}`
          : `https://www.myntra.com/${url}`;
      }
      
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
      setProducts(prevProducts => [...prevProducts, data]);
      setInputValue('');
      setSearchResults([]);
      // Autosave will be triggered by the useEffect
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error instanceof Error ? error.message : 'Failed to add product to wardrobe');
    } finally {
      setIsLoading(false);
    }
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
          dateAdded: new Date().toISOString()
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

  const handleDeleteProduct = (index: number) => {
    setProducts(prevProducts => prevProducts.filter((_, i) => i !== index));
    setShowDeleteConfirm(null);
    // Autosave will be triggered by the useEffect
  }

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

  // Add function to filter wardrobe items
  const getFilteredProducts = () => {
    if (!wardrobeFilter.trim()) return products;
    
    const filterLower = wardrobeFilter.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(filterLower) ||
      product.brand.toLowerCase().includes(filterLower) ||
      (product.color && product.color.toLowerCase().includes(filterLower)) ||
      (product.size && product.size.toLowerCase().includes(filterLower))
    );
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 lg:p-12">
      <div className="flex flex-col items-center">
        {session && (
          <div className="self-end flex items-center gap-2 mb-4">
            {session?.user?.image && (
              <Image src={session.user.image} width={32} height={32} alt="User" className="rounded-full" />
            )}
            <span className="text-sm">{session.user.name}</span>
            <button className="text-sm text-purple-600 hover:underline" onClick={() => signOut()}>Sign Out</button>
            <a href="/email-fetcher" className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 ml-2">
              Email Fetcher
            </a>
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
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Enter Myntra URL or search for a product (e.g., 'blue cotton shirt')"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : inputValue.includes('myntra.com') ? 'Add to Wardrobe' : 'Search'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-500">or</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:border-purple-500 hover:text-purple-700 transition-all"
                    disabled={isProcessingImage}
                  >
                    {isProcessingImage ? 'Processing...' : 'Upload Order Screenshot'}
                  </button>
                  
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
                    className="hidden"
                    ref={pdfInputRef}
                  />
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    className="px-8 py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:border-purple-500 hover:text-purple-700 transition-all"
                  >
                    Upload PDF
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Or paste (Ctrl/Cmd + V) a screenshot of your Myntra order
                </p>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
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
                          className="px-4 py-2 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors whitespace-nowrap"
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
            
            {/* Add search/filter for wardrobe items */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your wardrobe by name, brand, color or size..."
                  value={wardrobeFilter}
                  onChange={(e) => setWardrobeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {wardrobeFilter ? (
                    <button
                      onClick={() => setWardrobeFilter('')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            
            {/* New categorized wardrobe display */}
            <div className="space-y-6">
              {Object.entries(categorizeItems(getFilteredProducts())).map(([category, items]) => (
                <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => toggleCategory(category)}
                    className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">{category}</h3>
                      <span className="ml-2 text-sm text-gray-600">({items.length} items)</span>
                    </div>
                    <div className="text-gray-500">
                      {expandedCategories[category] ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                  
                  {/* Collapsible category content */}
                  {expandedCategories[category] && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((product, index) => {
                          // Find the global index of this product
                          const globalIndex = products.findIndex(p => 
                            p.name === product.name && 
                            p.brand === product.brand && 
                            p.image === product.image
                          );
                          
                          return (
                            <WardrobeItem 
                              key={`${category}-${index}`} 
                              product={product} 
                              onDelete={() => setShowDeleteConfirm(globalIndex)} 
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
    </main>
  )
}
