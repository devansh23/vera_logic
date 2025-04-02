const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking database records...');
  
  // Check if the specific IDs exist in the wardrobe
  const specificIds = ['cm900rjzb01rvbwfgo4fpr0ti', 'cm900rjyv01r1bwfgazbopj26'];
  for (const id of specificIds) {
    const item = await prisma.wardrobe.findUnique({ where: { id } });
    console.log(`Wardrobe item with ID ${id}: ${item ? 'EXISTS' : 'DOES NOT EXIST'}`);
  }
  
  // Get a count of all wardrobe items
  const totalCount = await prisma.wardrobe.count();
  console.log(`Total wardrobe items: ${totalCount}`);
  
  // Get some sample wardrobe items to see actual IDs
  const sampleItems = await prisma.wardrobe.findMany({ take: 5 });
  console.log('Sample wardrobe item IDs:');
  sampleItems.forEach(item => console.log(`- ${item.id}`));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect()); 