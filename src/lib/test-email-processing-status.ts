/**
 * Test script for the EmailProcessingStatus model
 */
import { prisma } from './prisma';

async function testEmailProcessingStatus() {
  console.log('🧪 Testing EmailProcessingStatus model');
  console.log('====================================\n');

  try {
    // 1. Create a test job
    console.log('1. Creating a test email processing job...');
    const newJob = await prisma.emailProcessingStatus.create({
      data: {
        userId: 'cm8dazc2b0007bwpo2xeaxi74', // Valid user ID from our database
        status: 'pending',
        retailer: 'Myntra',
        searchQuery: 'from:myntra.com OR subject:myntra',
        daysBack: 30,
        maxEmails: 50,
        onlyUnread: true,
        markAsRead: false,
        isAutomated: false
      }
    });
    
    console.log('✅ Created job:', newJob);
    
    // 2. Update the job status
    console.log('\n2. Updating job status to "processing"...');
    const updatedJob = await prisma.emailProcessingStatus.update({
      where: { id: newJob.id },
      data: { 
        status: 'processing',
        emailsFound: 10
      }
    });
    
    console.log('✅ Updated job:', updatedJob);
    
    // 3. Complete the job
    console.log('\n3. Completing the job...');
    const completedJob = await prisma.emailProcessingStatus.update({
      where: { id: newJob.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        emailsProcessed: 8,
        ordersCreated: 5,
        failedEmails: 2
      }
    });
    
    console.log('✅ Job completed:', completedJob);
    
    // 4. Fetch jobs for a user
    console.log('\n4. Fetching all jobs for the test user...');
    const userJobs = await prisma.emailProcessingStatus.findMany({
      where: { userId: 'cm8dazc2b0007bwpo2xeaxi74' },
      orderBy: { startedAt: 'desc' }
    });
    
    console.log(`✅ Found ${userJobs.length} jobs`);
    
    // 5. Clean up - delete the test job
    console.log('\n5. Cleaning up - deleting test job...');
    const deletedJob = await prisma.emailProcessingStatus.delete({
      where: { id: newJob.id }
    });
    
    console.log('✅ Deleted job:', deletedJob.id);
    
    console.log('\n🏁 All tests completed successfully!\n');
    
    // Verify model relationships by checking schema
    console.log('Verifying model relationships:');
    
    // Get users with their email processing jobs
    const userWithJobs = await prisma.user.findFirst({
      select: {
        id: true, 
        email: true,
        emailProcessingJobs: {
          select: {
            id: true,
            status: true,
            startedAt: true
          }
        }
      },
      where: {
        // This assumes you have at least one user in your database
        emailProcessingJobs: {
          some: {}
        }
      }
    });
    
    if (userWithJobs) {
      console.log('Found user with email processing jobs:', userWithJobs);
    } else {
      console.log('No users with email processing jobs found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
}

// Run the test
testEmailProcessingStatus()
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  }); 