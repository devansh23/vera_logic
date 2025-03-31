/**
 * Types for email extraction functionality
 */

/**
 * Represents an item extracted from an email
 */
export interface ExtractedItem {
  brand: string;
  name: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  size?: string;
  color?: string;
  productLink?: string;
  myntraLink?: string;  
  image?: string;
  sourceRetailer: string;
} 