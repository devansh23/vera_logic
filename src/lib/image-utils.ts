/**
 * Utility functions for handling images in the application
 */

/**
 * Normalize an image URL to prepare it for display or deduplication
 * This function ensures consistency in how image URLs are processed
 */
export function normalizeImageUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Convert to absolute URL if it's relative
    let normalizedUrl = url;
    if (url.startsWith('//')) {
      normalizedUrl = `https:${url}`;
    } else if (url.startsWith('/')) {
      // This is a site-relative URL, but we can't reliably handle it without context
      // For now, just return as is
      return url;
    }
    
    // Remove tracking parameters and fragments
    const urlObj = new URL(normalizedUrl);
    
    // Remove common tracking parameters
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    // Remove fragment (hash)
    urlObj.hash = '';
    
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, return the original URL
    return url;
  }
}

/**
 * Process an image buffer to extract just the clothing item using the extract-item API
 * 
 * @param imageBuffer The original image buffer
 * @param rawItemName The name of the item to help identify what type of clothing it is
 * @param mimeType Optional mime type, defaults to 'image/jpeg' if not provided
 * @returns A buffer containing either the cropped image or the original image if cropping failed
 */
export async function processItemImage(
  imageBuffer: Buffer, 
  rawItemName: string,
  mimeType: string = 'image/jpeg'
): Promise<Buffer> {
  // Define mapping of clothing keywords to item types
  const keywordMap: Record<string, string[]> = {
    trousers: ['trousers', 'pants', 'jeans', 'slacks', 'chinos'],
    hoodie: ['hoodie', 'sweatshirt', 'sweater', 'jumper', 'pullover'],
    shirt: ['shirt', 'button-up', 'button-down', 'jacquard', 'textured shirt'],
    tshirt: ['t-shirt', 'tshirt', 'tee', 't shirt'],
    jacket: ['jacket', 'coat', 'blazer'],
    dress: ['dress', 'gown', 'frock'],
    skirt: ['skirt', 'miniskirt', 'maxi skirt'],
    shorts: ['shorts', 'bermudas'],
    top: ['top', 'blouse', 'tank top', 'camisole'],
  };

  // Check for a match in the provided item name
  const lowerName = rawItemName.toLowerCase();
  
  // Special case handling for hard-to-detect items
  if (lowerName.includes('jacquard') || lowerName.includes('ecru')) {
    console.log('Detected special case: jacquard/ecru shirt');
    return await attemptExtractWithType(imageBuffer, 'shirt', mimeType);
  }
  
  // Find matching keyword
  const matched = Object.keys(keywordMap).find((key) =>
    keywordMap[key].some((term) => lowerName.includes(term))
  );
  
  // Log for debugging
  console.log(`processItemImage: itemName=${rawItemName}, matched=${matched || 'none'}`);
  
  // If no match found, return the original image
  if (!matched) return imageBuffer;

  return await attemptExtractWithType(imageBuffer, matched, mimeType);
}

/**
 * Helper function to attempt item extraction with a specific type
 */
async function attemptExtractWithType(
  imageBuffer: Buffer,
  itemType: string,
  mimeType: string
): Promise<Buffer> {
  try {
    // Create a FormData object for the API request
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    
    // Append the image with the correct mime type
    formData.append('image', imageBuffer, {
      filename: 'upload.jpg',
      contentType: mimeType,
    });
    
    // Append the matched item name
    formData.append('itemName', itemType);
    
    console.log(`Attempting extraction with itemType: ${itemType}`);
    
    // Get the API URL dynamically based on environment
    // This handles both client and server-side contexts
    const apiBaseUrl = typeof window !== 'undefined' 
      ? window.location.origin  // Client-side
      : process.env.NEXTAUTH_URL || 'http://localhost:3000'; // Server-side
    
    // Make the request to the extract-item API using absolute URL
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${apiBaseUrl}/api/extract-item`, {
      method: 'POST',
      body: formData as any,
    });

    if (!response.ok) {
      throw new Error(`Cropping failed with status: ${response.status}`);
    }
    
    // Convert response to buffer
    const responseArrayBuffer = await response.arrayBuffer();
    return Buffer.from(responseArrayBuffer);
  } catch (error) {
    console.error('Image extraction failed:', error);
    // Return the original image if extraction fails
    return imageBuffer;
  }
}

import { log } from './logger';

export async function fetchImageAsBuffer(imageUrl: string): Promise<Buffer | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      log('Failed to fetch image', { imageUrl, status: response.status });
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    log('Error fetching image', { imageUrl, error });
    return null;
  }
} 