import { prisma } from '@/lib/prisma';
import { determineColorTag } from '@/lib/color-utils';

async function updateColorTags() {
  try {
    // Get all wardrobe items
    const items = await prisma.wardrobe.findMany();
    console.log(`Found ${items.length} items to process`);

    // Update each item with a color tag
    let updated = 0;
    for (const item of items) {
      const colorTag = determineColorTag(item.color, item.dominantColor);
      
      await prisma.wardrobe.update({
        where: { id: item.id },
        data: { colorTag }
      });
      
      updated++;
      if (updated % 10 === 0) {
        console.log(`Processed ${updated}/${items.length} items`);
      }
    }

    console.log(`Successfully updated ${updated} items with color tags`);
  } catch (error) {
    console.error('Error updating color tags:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateColorTags(); 