import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { categorizeItem } from './categorize-items';
import { WardrobeItem } from '@/types/wardrobe';

interface OrderItem {
  brand?: string;
  productName?: string;
  price?: number;
  imageUrl?: string;
  size?: string;
  color?: string;
}

/**
 * Add items from an order to the user's wardrobe
 * @param userId User ID
 * @param orderId Order ID to reference 
 * @param items Array of order items to add to wardrobe
 * @returns Array of created wardrobe item IDs
 */
export async function addOrderItemsToWardrobe(
  userId: string, 
  orderId: string, 
  items: OrderItem[]
): Promise<string[]> {
  const wardrobeItemIds: string[] = [];
  
  for (const item of items) {
    try {
      // Determine category for the item
      const category = categorizeItem({
        name: item.productName || 'Unknown Product',
        brand: item.brand || 'Unknown',
        color: item.color || '',
      });

      const wardrobeItem = await prisma.wardrobe.create({
        data: {
          userId: userId,
          brand: item.brand || 'Unknown',
          name: item.productName || 'Unknown Product',
          price: item.price ? item.price.toString() : '0',
          originalPrice: '',
          discount: '',
          image: item.imageUrl || '',
          productLink: orderId, // Use the order ID as reference
          size: item.size || '',
          color: item.color || '',
          category: category, // Add the determined category
        }
      });
      
      log('Added order item to wardrobe', { 
        itemId: wardrobeItem.id, 
        orderId: orderId,
        productName: item.productName,
        category: category
      });
      
      wardrobeItemIds.push(wardrobeItem.id);
    } catch (error) {
      log('Failed to add item to wardrobe', {
        error: error instanceof Error ? error.message : 'Unknown error',
        item
      });
    }
  }
  
  return wardrobeItemIds;
} 