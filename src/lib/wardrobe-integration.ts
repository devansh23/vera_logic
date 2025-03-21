import { ExtractedWardrobeItem } from './email-item-extractor';
import { prisma } from './prisma';
import { log } from './logger';

/**
 * Results of adding items to wardrobe
 */
export interface WardrobeAdditionResult {
  totalItems: number;
  addedItems: number;
  duplicatesSkipped: number;
  addedWardrobeItems: any[]; // Array of created Prisma Wardrobe items
  duplicateItems: ExtractedWardrobeItem[]; // Items skipped due to duplication
}

/**
 * Add extracted items to the user's wardrobe with deduplication
 */
export async function addItemsToWardrobe(
  userId: string,
  items: ExtractedWardrobeItem[]
): Promise<WardrobeAdditionResult> {
  log('Adding items to wardrobe', { userId, itemCount: items.length });
  
  // Initialize result
  const result: WardrobeAdditionResult = {
    totalItems: items.length,
    addedItems: 0,
    duplicatesSkipped: 0,
    addedWardrobeItems: [],
    duplicateItems: []
  };
  
  if (items.length === 0) {
    log('No items to add to wardrobe', { userId });
    return result;
  }
  
  // Get existing wardrobe items for deduplication
  const existingItems = await prisma.wardrobe.findMany({
    where: { userId }
  });
  
  log('Existing wardrobe items', { userId, existingItemCount: existingItems.length });
  
  // Process each item
  for (const item of items) {
    // Check if this item is a duplicate
    const isDuplicate = checkForDuplicate(item, existingItems);
    
    if (isDuplicate) {
      // Skip this item
      log('Skipping duplicate item', { 
        userId, 
        itemName: item.name, 
        brand: item.brand,
        imageUrl: item.imageUrl 
      });
      
      result.duplicatesSkipped++;
      result.duplicateItems.push(item);
      continue;
    }
    
    // Add new item to wardrobe
    try {
      const newWardrobeItem = await prisma.wardrobe.create({
        data: {
          userId,
          brand: item.brand,
          name: item.name,
          price: item.price || '',
          originalPrice: item.originalPrice || '',
          discount: item.discount || '',
          image: item.imageUrl || '',
          productLink: item.productLink || '',
          size: item.size || '',
          color: item.color || '',
          source: 'email',
          sourceEmailId: item.emailId,
          sourceOrderId: item.orderId,
          sourceRetailer: item.retailer
        }
      });
      
      log('Added item to wardrobe', { userId, itemId: newWardrobeItem.id, itemName: item.name });
      
      result.addedItems++;
      result.addedWardrobeItems.push(newWardrobeItem);
      
      // Also add this to the existing items array to prevent duplicates within this batch
      existingItems.push(newWardrobeItem);
    } catch (error) {
      log('Error adding item to wardrobe', { userId, item, error });
    }
  }
  
  log('Wardrobe addition completed', { 
    userId, 
    totalItems: result.totalItems,
    addedItems: result.addedItems,
    duplicatesSkipped: result.duplicatesSkipped
  });
  
  return result;
}

/**
 * Check if an item is a duplicate based on multiple criteria
 */
function checkForDuplicate(newItem: ExtractedWardrobeItem, existingItems: any[]): boolean {
  // First check for exact matches
  const exactMatch = existingItems.some(existingItem => 
    existingItem.sourceEmailId === newItem.emailId &&
    existingItem.sourceOrderId === newItem.orderId
  );
  
  if (exactMatch) {
    return true; // Definite duplicate - from the same email and order
  }
  
  // Then check for image URL matches
  if (newItem.normalizedImageUrl) {
    const imageMatch = existingItems.some(existingItem => {
      // Normalize the existing image URL if present
      if (!existingItem.image) return false;
      
      const normalizedExistingImage = normalizeImageUrl(existingItem.image);
      return normalizedExistingImage === newItem.normalizedImageUrl;
    });
    
    if (imageMatch) {
      return true; // Images are the same, likely the same product
    }
  }
  
  // Finally check for brand + name similarity
  return existingItems.some(existingItem => {
    // Brand is required to be the same
    const brandMatch = existingItem.brand.toLowerCase() === newItem.brand.toLowerCase();
    if (!brandMatch) return false;
    
    // Check name similarity
    const nameSimilarity = calculateNameSimilarity(
      existingItem.name.toLowerCase(), 
      newItem.name.toLowerCase()
    );
    
    // Consider similar if similarity is above threshold AND size matches if available
    const isSimilar = nameSimilarity > 0.7;
    const sizeMatch = !existingItem.size || !newItem.size || 
                      existingItem.size.toLowerCase() === newItem.size.toLowerCase();
    
    return isSimilar && sizeMatch;
  });
}

/**
 * Normalize image URL for comparison (remove query params, size specs, etc.)
 */
function normalizeImageUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Remove query parameters
    const baseUrl = url.split('?')[0];
    
    // Remove size specifications like /thumb/, /large/, etc.
    const normalizedUrl = baseUrl.replace(/\/(thumb|small|medium|large|xl|xxl)\//, '/');
    
    // Remove image dimensions like _500x500, _100x100
    return normalizedUrl.replace(/_([\d]+x[\d]+)\./, '.');
  } catch (error) {
    log('Error normalizing image URL', { url, error });
    return url;
  }
}

/**
 * Calculate similarity between two strings
 * Returns a value between 0 and 1, where 1 is identical
 */
function calculateNameSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0;
  
  // Simple Jaccard similarity for product names
  const set1 = new Set(str1.split(/\s+/).filter(word => word.length > 3));
  const set2 = new Set(str2.split(/\s+/).filter(word => word.length > 3));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
} 