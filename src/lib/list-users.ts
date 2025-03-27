/**
 * Utility script to list users in the database
 */
import { prisma } from './prisma';

async function listUsers() {
  console.log('📋 Listing users in the database');
  console.log('==============================\n');

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        gmailConnected: true,
        _count: {
          select: {
            orders: true,
            wardrobe: true,
            EmailProcessingHistory: true
          }
        }
      }
    });
    
    if (users.length === 0) {
      console.log('No users found in the database');
    } else {
      console.log(`Found ${users.length} users:`);
      users.forEach((user: any, index: number) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`- ID: ${user.id}`);
        console.log(`- Name: ${user.name || 'N/A'}`);
        console.log(`- Email: ${user.email || 'N/A'}`);
        console.log(`- Gmail Connected: ${user.gmailConnected ? 'Yes' : 'No'}`);
        console.log(`- Orders: ${user._count.orders}`);
        console.log(`- Wardrobe Items: ${user._count.wardrobe}`);
        console.log(`- Email Processing History: ${user._count.EmailProcessingHistory}`);
      });
    }
    
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
listUsers()
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 