import getColors from 'get-image-colors';
import nearestColor from 'nearest-color';
import colornames from 'colornames';
import { log } from './logger';

export const COLOR_MAP = {
  black: '#000000',
  white: '#ffffff',
  grey: '#808080',
  beige: '#f5f5dc',
  red: '#ff0000',
  orange: '#ffa500',
  yellow: '#ffff00',
  green: '#008000',
  blue: '#0000ff',
  purple: '#800080',
  pink: '#ffc0cb',
  brown: '#a52a2a',
  navy: '#000080',
};

const nearest = nearestColor.from(COLOR_MAP);

// Helper function to calculate color distance (using simple RGB distance)
function getColorDistance(color1: string, color2: string): number {
  // Convert hex to RGB
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  // Calculate Euclidean distance
  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
}

// Function to find the closest predefined color
function findClosestColor(hexColor: string): string {
  let closestColor = '';
  let minDistance = Infinity;
  
  Object.entries(COLOR_MAP).forEach(([colorName, colorHex]) => {
    const distance = getColorDistance(hexColor, colorHex);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = colorName;
    }
  });
  
  return closestColor;
}

// Common color names mapping to our predefined colors
const COLOR_NAME_MAPPING: { [key: string]: string } = {
  // Black variants
  'black': 'black',
  'jet black': 'black',
  'charcoal': 'black',
  
  // White variants
  'white': 'white',
  'off white': 'white',
  'ivory': 'white',
  'cream': 'beige',
  
  // Grey variants
  'grey': 'grey',
  'gray': 'grey',
  'silver': 'grey',
  'charcoal grey': 'grey',
  
  // Beige variants
  'beige': 'beige',
  'khaki': 'beige',
  'tan': 'beige',
  'nude': 'beige',
  
  // Red variants
  'red': 'red',
  'maroon': 'red',
  'burgundy': 'red',
  'crimson': 'red',
  
  // Orange variants
  'orange': 'orange',
  'coral': 'orange',
  'peach': 'orange',
  
  // Yellow variants
  'yellow': 'yellow',
  'mustard': 'yellow',
  'gold': 'yellow',
  
  // Green variants
  'green': 'green',
  'olive': 'green',
  'emerald': 'green',
  'sage': 'green',
  'mint': 'green',
  
  // Blue variants
  'blue': 'blue',
  'light blue': 'blue',
  'sky blue': 'blue',
  'turquoise': 'blue',
  'teal': 'blue',
  
  // Purple variants
  'purple': 'purple',
  'violet': 'purple',
  'lavender': 'purple',
  'mauve': 'purple',
  
  // Pink variants
  'pink': 'pink',
  'rose': 'pink',
  'magenta': 'pink',
  
  // Brown variants
  'brown': 'brown',
  'chocolate': 'brown',
  'coffee': 'brown',
  'mocha': 'brown',
  
  // Navy variants
  'navy': 'navy',
  'navy blue': 'navy',
  'midnight blue': 'navy'
};

export function determineColorTag(color?: string | null, dominantColor?: string | null): string {
  // If no color information is available, return a default
  if (!color && !dominantColor) {
    return 'unknown';
  }

  // First try to match the text color name if available
  if (color) {
    const normalizedColor = color.toLowerCase().trim();
    
    // Direct match in our mapping
    if (COLOR_NAME_MAPPING[normalizedColor]) {
      return COLOR_NAME_MAPPING[normalizedColor];
    }
    
    // Try to find partial matches
    for (const [key, value] of Object.entries(COLOR_NAME_MAPPING)) {
      if (normalizedColor.includes(key)) {
        return value;
      }
    }
  }

  // If we have a dominant color hex value and no match was found from the text color,
  // find the closest matching predefined color
  if (dominantColor) {
    return findClosestColor(dominantColor);
  }

  // If we get here and we have a color string but no match was found,
  // we'll make a best effort to extract a color from the string
  if (color) {
    const words = color.toLowerCase().split(/[\s-]+/);
    for (const word of words) {
      if (COLOR_NAME_MAPPING[word]) {
        return COLOR_NAME_MAPPING[word];
      }
    }
  }

  // If all else fails
  return 'unknown';
}

export async function getColorInfo({
  rawColor,
  imageBuffer,
}: {
  rawColor?: string;
  imageBuffer?: Buffer | null;
}): Promise<{
  dominantColor: string;
  colorTag: string;
}> {
  let hex: string | null = null;

  // Try to get hex from raw color name first
  if (rawColor) {
    try {
      hex = colornames(rawColor.toLowerCase());
      log('Converted raw color to hex', { rawColor, hex });
    } catch (e) {
      log('Failed to convert raw color to hex', { rawColor, error: e });
      hex = null;
    }
  }

  // If no hex from raw color, try to extract from image
  if (!hex && imageBuffer) {
    try {
      const colors = await getColors(imageBuffer, 'image/jpeg');
      hex = colors?.[0]?.hex?.();
      log('Extracted color from image', { hex });
    } catch (e) {
      log('Image color extraction failed', { error: e });
    }
  }

  // Use fallback gray if no color could be determined
  const finalHex = hex || '#808080';
  const colorTag = nearest(finalHex).name;

  log('Final color info', { finalHex, colorTag });

  return {
    dominantColor: finalHex,
    colorTag,
  };
} 