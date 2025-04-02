import { WardrobeItem } from '@/types/outfit';

const categoryKeywords: Record<string, string[]> = {
  // Men's Categories
  'T-Shirts': ['t-shirt', 't shirts', 't-shirts', 't shirt', 'tshirt', 'tshirts', 'tee', 'tees', 'crew neck t-shirt', 'v-neck t-shirt'],
  'Casual Shirts': ['casual shirt', 'casual shirts', 'linen shirt', 'oxford shirt', 'chambray shirt', 'button-down', 'button down', 'button up', 'flannel shirt'],
  'Formal Shirts': ['formal shirt', 'dress shirt', 'business shirt', 'office shirt', 'slim fit shirt', 'regular fit shirt'],
  'Sweatshirts': ['sweatshirt', 'hooded sweatshirt', 'hoodie', 'pullover sweat', 'crew neck sweatshirt', 'zip-up sweatshirt'],
  'Sweaters': ['sweater', 'pullover', 'cardigan', 'jumper', 'knit', 'wool sweater', 'cashmere sweater', 'v-neck sweater'],
  'Jackets': ['jacket', 'bomber', 'trucker jacket', 'denim jacket', 'zip-up jacket', 'leather jacket', 'windbreaker', 'rain jacket'],
  'Blazers & Coats': ['blazer', 'coat', 'suit jacket', 'overcoat', 'trench coat', 'peacoat', 'sport coat', 'winter coat'],
  'Mens Jeans': ['men jeans', 'men jean', 'slim fit jeans', 'straight fit jeans', 'regular fit jeans', 'skinny jeans', 'bootcut jeans', 'tapered jeans', 'relaxed fit jeans'],
  'Casual Trousers': ['trouser', 'trousers', 'casual trouser', 'chinos', 'khakis', 'casual pant', 'cargo pant', 'cotton pant', 'linen pant', 'dress pant'],
  'Mens Shorts': ['men short', 'bermuda', 'cargo short', 'denim short', 'chino short', 'athletic short', 'swim trunk'],
  'Track Pants & Joggers': ['track pant', 'jogger', 'trackpant', 'sweatpant', 'athletic pant', 'running pant', 'training pant'],
  
  // Women's Categories
  'Dresses': ['dress', 'gown', 'maxi', 'midi dress', 'a-line dress', 'bodycon', 'shift dress', 'wrap dress', 'cocktail dress', 'party dress'],
  'Womens Tops': ['women top', 'ladies top', 'blouse', 'crop top', 'camisole', 'tank top', 'sleeveless top', 'tunic', 'peplum'],
  'Womens Jeans': ['women jeans', 'ladies jeans', 'skinny jeans', 'boyfriend jeans', 'mom jeans', 'high-waisted jeans', 'straight leg jeans', 'wide leg jeans'],
  'Skirts': ['skirt', 'mini skirt', 'midi skirt', 'maxi skirt', 'pleated skirt', 'a-line skirt', 'pencil skirt', 'wrap skirt'],
  'Womens Shorts': ['women short', 'ladies short', 'mini short', 'high waisted short', 'denim short', 'bermuda short'],
  
  // Footwear
  'Mens Casual Shoes': ['men casual shoe', 'sneaker', 'espadrille', 'canvas shoe', 'loafer', 'boat shoe', 'slip-on', 'athletic shoe'],
  'Womens Casual Shoes': ['women casual shoe', 'ladies sneaker', 'women loafer', 'ballet flat', 'slip-on shoe', 'walking shoe'],
  'Formal Shoes': ['formal shoe', 'oxford', 'brogue', 'derby', 'dress shoe', 'monk strap', 'wingtip', 'cap toe'],
  'Heels': ['heel', 'stiletto', 'pump', 'platform heel', 'wedge', 'block heel', 'kitten heel', 'peep toe'],
  'Boots': ['boot', 'ankle boot', 'chelsea boot', 'winter boot', 'combat boot', 'hiking boot', 'riding boot', 'desert boot'],
  'Sandals & Floaters': ['sandal', 'floater', 'slider', 'flip flop', 'sport sandal', 'gladiator sandal', 'beach sandal'],
  
  // Accessories
  'Bags & Backpacks': ['bag', 'backpack', 'laptop bag', 'messenger bag', 'duffel bag', 'tote', 'handbag', 'crossbody'],
  'Watches': ['watch', 'wristwatch', 'smartwatch', 'chronograph', 'analog watch', 'digital watch', 'sport watch'],
  'Sunglasses': ['sunglass', 'eyeglass', 'spectacle', 'shade', 'aviator', 'wayfarer', 'polarized'],
  'Belts': ['belt', 'leather belt', 'casual belt', 'formal belt', 'dress belt', 'woven belt', 'braided belt'],
  'Wallets': ['wallet', 'card holder', 'money clip', 'billfold', 'coin purse', 'travel wallet', 'phone wallet']
};

export function categorizeItem(item: Partial<WardrobeItem> & { name: string }): string {
  // If item already has a category, return it
  if (item.category) {
    return item.category;
  }

  // Combine all item information for matching
  const textToMatch = [
    item.name,
    item.brand,
    item.color,
    item.sourceRetailer
  ].filter(Boolean).join(' ').toLowerCase();

  // First try to determine if it's men's or women's item
  const isWomensItem = /women|ladies|feminine|girl|womens/i.test(textToMatch);
  const isMensItem = /men|masculine|boy|mens/i.test(textToMatch);

  // Try to match against category keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    // Skip women's categories for men's items and vice versa
    if ((isWomensItem && category.startsWith('Mens')) || 
        (isMensItem && (category.startsWith('Womens') || category === 'Dresses' || category === 'Skirts'))) {
      continue;
    }

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

  // If no match found, try to determine a general category
  if (/shoe|sneaker|footwear/i.test(textToMatch)) {
    return isWomensItem ? 'Womens Casual Shoes' : 'Mens Casual Shoes';
  }
  
  if (/jean|denim/i.test(textToMatch)) {
    return isWomensItem ? 'Womens Jeans' : 'Mens Jeans';
  }
  
  if (/shirt|top/i.test(textToMatch)) {
    if (isWomensItem) {
      return 'Womens Tops';
    } else {
      return /formal|dress|business/i.test(textToMatch) ? 'Formal Shirts' : 'Casual Shirts';
    }
  }

  // If still no match found, return Uncategorized
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