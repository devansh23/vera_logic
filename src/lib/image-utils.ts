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