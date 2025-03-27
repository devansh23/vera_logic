/**
 * Test script to verify Prisma connection
 */
import { prisma } from './prisma';

async function testPrismaConnection() {
  console.log('🧪 Testing Prisma connection');
  console.log('==========================\n');

  try {
    // Test connection by counting users
    const userCount = await prisma.user.count();
    console.log(`✅ Connected to database. Found ${userCount} users.`);
    
    // Test EmailProcessingStatus table
    const jobCount = await prisma.emailProcessingStatus.count();
    console.log(`✅ EmailProcessingStatus table exists. Found ${jobCount} jobs.`);
    
    if (jobCount > 0) {
      // Get a sample job
      const sampleJob = await prisma.emailProcessingStatus.findFirst();
      console.log(`✅ Sample job:`, sampleJob);
    }
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPrismaConnection()
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  }); 