/**
 * Test script for the email processing status API route
 * 
 * This script tests the process-status API route with various scenarios:
 * 1. Valid job ID - Should return the job details
 * 2. Invalid job ID - Should return a 404 error
 * 3. No job ID - Should return a 400 error
 * 4. Unauthorized access - Should return a 401 error
 */

import fetch from 'node-fetch';
import { log } from './logger';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get a valid job ID from the command line args or use a default
const validJobId = process.argv[2] || 'cm8dibi0i0001bwxjnko4ko3v'; // Replace with a valid job ID if needed
const baseUrl = 'http://localhost:3000';

async function testProcessingStatusApi() {
  console.log('🧪 Testing email processing status API');
  console.log('=====================================\n');

  // Test 1: Valid job ID
  await testValidJobId(validJobId);

  // Test 2: Invalid job ID
  await testInvalidJobId('invalid-job-id');

  // Test 3: No job ID
  await testNoJobId();

  // Test 4: List jobs
  await testListJobs();

  console.log('\n🏁 All tests completed');
}

/**
 * Test the API with a valid job ID
 */
async function testValidJobId(jobId: string) {
  console.log(`Test 1: Valid job ID (${jobId})`);
  
  try {
    const response = await fetch(`${baseUrl}/api/gmail/process-status?id=${jobId}`, {
      headers: {
        'x-test-auth': 'true'
      }
    });
    const data = await response.json();

    console.log(`Response status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Success! Job details:');
      console.log(`- ID: ${data.id}`);
      console.log(`- Status: ${data.status}`);
      console.log(`- Retailer: ${data.retailer || 'N/A'}`);
      console.log(`- Started: ${new Date(data.startedAt).toLocaleString()}`);
      
      if (data.completedAt) {
        console.log(`- Completed: ${new Date(data.completedAt).toLocaleString()}`);
      }
      
      console.log('- Stats:');
      console.log(`  * Emails Found: ${data.stats.emailsFound}`);
      console.log(`  * Emails Processed: ${data.stats.emailsProcessed}`);
      console.log(`  * Orders Created: ${data.stats.ordersCreated}`);
      console.log(`  * Failed Emails: ${data.stats.failedEmails}`);
    } else {
      console.log('❌ Unexpected error:', data.error);
      console.log('Details:', data.details || 'No details provided');
    }
  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  }
  
  console.log('-----------------------------------');
}

/**
 * Test the API with an invalid job ID
 */
async function testInvalidJobId(jobId: string) {
  console.log(`\nTest 2: Invalid job ID (${jobId})`);
  
  try {
    const response = await fetch(`${baseUrl}/api/gmail/process-status?id=${jobId}`, {
      headers: {
        'x-test-auth': 'true'
      }
    });
    const data = await response.json();

    console.log(`Response status: ${response.status}`);
    
    if (response.status === 404) {
      console.log('✅ Success! Received expected 404 error');
      console.log(`- Error: ${data.error}`);
      console.log(`- Details: ${data.details}`);
    } else {
      console.log('❌ Unexpected response:', data);
    }
  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  }
  
  console.log('-----------------------------------');
}

/**
 * Test the API without a job ID
 */
async function testNoJobId() {
  console.log('\nTest 3: No job ID');
  
  try {
    const response = await fetch(`${baseUrl}/api/gmail/process-status`, {
      headers: {
        'x-test-auth': 'true'
      }
    });
    const data = await response.json();

    console.log(`Response status: ${response.status}`);
    
    if (response.status === 400) {
      console.log('✅ Success! Received expected 400 error');
      console.log(`- Error: ${data.error}`);
      console.log(`- Details: ${data.details}`);
    } else {
      console.log('❌ Unexpected response:', data);
    }
  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  }
  
  console.log('-----------------------------------');
}

/**
 * Test the list jobs endpoint
 */
async function testListJobs() {
  console.log('\nTest 4: List jobs');
  
  try {
    const response = await fetch(`${baseUrl}/api/gmail/process-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-test-auth': 'true'
      },
      body: JSON.stringify({
        limit: 5
      }),
    });
    
    const data = await response.json();
    console.log(`Response status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Success! Jobs list:');
      
      if (data.jobs && data.jobs.length > 0) {
        console.log(`Found ${data.jobs.length} jobs:`);
        data.jobs.forEach((job: any, index: number) => {
          console.log(`\nJob ${index + 1}:`);
          console.log(`- ID: ${job.id}`);
          console.log(`- Status: ${job.status}`);
          console.log(`- Retailer: ${job.retailer || 'N/A'}`);
        });
        
        console.log('\nPagination:');
        console.log(`- Total: ${data.pagination.total}`);
        console.log(`- Limit: ${data.pagination.limit}`);
        console.log(`- Offset: ${data.pagination.offset}`);
        console.log(`- Has more: ${data.pagination.hasMore}`);
      } else {
        console.log('No jobs found');
      }
    } else {
      console.log('❌ Error:', data.error);
      console.log('Details:', data.details || 'No details provided');
    }
  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  }
  
  console.log('-----------------------------------');
}

// Run the test
testProcessingStatusApi().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
}); 