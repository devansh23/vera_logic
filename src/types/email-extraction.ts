/**
 * Types for email extraction functionality
 */

/**
 * Represents an item extracted from an email
 */
export interface ExtractedItem {
  brand?: string;
  name: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  size?: string;
  color?: string;
  image?: string;
  imageUrl?: string;
  productLink?: string;
  myntraLink?: string;
  category?: string;
  orderId?: string;
  sourceRetailer?: string;
} 