import { WardrobeItem } from '@/types/outfit';

const categoryKeywords: Record<string, string[]> = {
  // Men's Categories
  'T-Shirts': ['t-shirt', 't shirts', 't-shirts', 't shirt', 'tshirt', 'tshirts', 'tee', 'tees'],
  'Casual Shirts': ['casual shirt', 'casual shirts', 'linen shirt', 'oxford shirt', 'chambray shirt'],
  'Formal Shirts': ['formal shirt', 'dress shirt', 'business shirt', 'office shirt'],
  'Sweatshirts': ['sweatshirt', 'hooded sweatshirt', 'hoodie', 'pullover sweat'],
  'Sweaters': ['sweater', 'pullover', 'cardigan', 'jumper', 'knit'],
  'Jackets': ['jacket', 'bomber', 'trucker jacket', 'denim jacket', 'zip-up jacket'],
  'Blazers & Coats': ['blazer', 'coat', 'suit jacket', 'overcoat', 'trench coat'],
  'Mens Jeans': ['jeans', 'denim jean', 'jean', 'men jeans', 'men jean'],
  'Casual Trousers': ['casual trouser', 'chinos', 'khakis', 'casual pant'],
  'Mens Shorts': ['short', 'bermuda', 'cargo short', 'denim short'],
  'Track Pants & Joggers': ['track pant', 'jogger', 'trackpant', 'sweatpant'],
  
  // Women's Categories
  'Dresses': ['dress', 'gown', 'maxi', 'midi dress', 'a-line dress', 'bodycon'],
  'Womens Tops': ['women top', 'ladies top', 'blouse', 'crop top', 'camisole'],
  'Womens Jeans': ['women jeans', 'ladies jeans', 'skinny jeans', 'boyfriend jeans'],
  'Skirts': ['skirt', 'mini skirt', 'midi skirt', 'maxi skirt', 'pleated skirt'],
  'Womens Shorts': ['women short', 'ladies short', 'mini short'],
  
  // Footwear
  'Mens Casual Shoes': ['casual shoe', 'sneaker', 'espadrille', 'canvas shoe'],
  'Womens Casual Shoes': ['women casual shoe', 'ladies sneaker'],
  'Formal Shoes': ['formal shoe', 'oxford', 'brogue', 'derby'],
  'Heels': ['heel', 'stiletto', 'pump', 'platform heel', 'wedge'],
  'Boots': ['boot', 'ankle boot', 'chelsea boot', 'winter boot'],
  'Sandals & Floaters': ['sandal', 'floater', 'slider', 'flip flop'],
  
  // Accessories
  'Bags & Backpacks': ['bag', 'backpack', 'laptop bag', 'messenger bag', 'duffel bag'],
  'Watches': ['watch', 'wristwatch', 'smartwatch', 'chronograph'],
  'Sunglasses': ['sunglass', 'eyeglass', 'spectacle', 'shade'],
  'Belts': ['belt', 'leather belt', 'casual belt', 'formal belt'],
  'Wallets': ['wallet', 'card holder', 'money clip', 'billfold']
};

export function categorizeItem(item: Partial<WardrobeItem> & { name: string }): string {
  // If item already has a category, return it
  if (item.category) {
    return item.category;
  }

  // Combine name and description for matching
  const textToMatch = [
    item.name,
    item.brand,
    item.color,
    item.sourceRetailer
  ].filter(Boolean).join(' ').toLowerCase();

  // Try to match against category keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      // Create regex that matches whole words only
      const keywordParts = keyword.split(/\s+/);
      const keywordRegex = new RegExp(
        keywordParts.map(part => `\\b${part}\\b`).join('\\s+'),
        'i'
      );
      
      if (keywordRegex.test(textToMatch)) {
        return category;
      }
    }
  }

  // If no match found, return Uncategorized
  return 'Uncategorized';
}

export function categorizeItems(items: WardrobeItem[]): Record<string, WardrobeItem[]> {
  const categories: Record<string, WardrobeItem[]> = {};
  
  items.forEach(item => {
    const category = categorizeItem(item);
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  });
  
  return categories;
} 