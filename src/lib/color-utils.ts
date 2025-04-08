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