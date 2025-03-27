/**
 * Script to create a sample email processing job
 */
import { prisma } from './prisma';

async function createSampleJob() {
  console.log('🧪 Creating a sample email processing job');
  console.log('====================================\n');

  try {
    const newJob = await prisma.emailProcessingStatus.create({
      data: {
        userId: 'cm8dazc2b0007bwpo2xeaxi74', // Valid user ID from our database
        status: 'completed',
        retailer: 'Myntra',
        searchQuery: 'from:myntra.com OR subject:myntra',
        daysBack: 30,
        maxEmails: 50,
        onlyUnread: true,
        markAsRead: true,
        isAutomated: false,
        startedAt: new Date(Date.now() - 3600000), // 1 hour ago
        completedAt: new Date(),
        emailsFound: 15,
        emailsProcessed: 12,
        ordersCreated: 8,
        failedEmails: 4
      }
    });
    
    console.log('✅ Created sample job:', newJob);
    
    // Now verify the relationship by querying the user with their jobs
    const userWithJobs = await prisma.user.findUnique({
      where: { id: 'cm8dazc2b0007bwpo2xeaxi74' },
      select: {
        id: true,
        name: true,
        email: true,
        emailProcessingJobs: {
          select: {
            id: true,
            status: true,
            retailer: true,
            startedAt: true,
            completedAt: true,
            emailsProcessed: true,
            ordersCreated: true
          }
        }
      }
    });
    
    console.log('\n✅ User with jobs:');
    console.log(JSON.stringify(userWithJobs, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSampleJob()
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 