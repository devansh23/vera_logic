/**
 * Test script for the process-myntra-emails API route
 * 
 * This script simulates a POST request to the API endpoint with various parameters
 * to verify its functionality.
 */

import fetch from 'node-fetch';
import { log } from './logger';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testProcessMyntraEmails() {
  console.log('🧪 Testing process-myntra-emails API route');
  console.log('==========================================');

  // URL for the API endpoint (adjust if needed)
  const apiUrl = 'http://localhost:3000/api/gmail/process-myntra-emails';
  
  // Test parameters
  const testParams = {
    max: 5,             // Process up to 5 emails
    onlyUnread: true,   // Only process unread emails
    markAsRead: false,  // Don't mark emails as read (for testing)
    daysBack: 30        // Look back 30 days
  };

  console.log('Test parameters:', testParams);
  
  try {
    // Make the request
    console.log(`\nSending POST request to ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testParams),
    });

    // Get the response status
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    // Get the response body
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ API call succeeded');
      console.log('Message:', data.message);
      
      if (data.stats) {
        console.log('\nStats:');
        console.log(`- Total emails found: ${data.stats.totalEmails}`);
        console.log(`- Myntra emails: ${data.stats.myntraEmails}`);
        console.log(`- Processed orders: ${data.stats.processedOrders}`);
        console.log(`- Successfully processed: ${data.stats.successfullyProcessed}`);
        console.log(`- Failed to process: ${data.stats.failedToProcess}`);
      }
      
      if (data.orders && data.orders.length > 0) {
        console.log('\nProcessed orders:');
        data.orders.forEach((order: any, index: number) => {
          console.log(`\nOrder ${index + 1}:`);
          console.log(`- Order ID: ${order.orderId || 'Not extracted'}`);
          console.log(`- Retailer: ${order.retailer}`);
          console.log(`- Status: ${order.status}`);
          console.log(`- Amount: ${order.totalAmount || 'Not extracted'} ${order.currency || ''}`);
          console.log(`- Items: ${order.items?.length || 0}`);
          console.log(`- Processed: ${order.processed ? 'Yes' : 'No'}`);
          if (order.error) {
            console.log(`- Error: ${order.error}`);
          }
        });
      } else {
        console.log('\nNo orders processed');
      }
    } else {
      console.log('\n❌ API call failed');
      console.log('Error:', data.error);
      console.log('Details:', data.details || 'No details provided');
    }
  } catch (error) {
    console.error('\n❌ Error calling API:', error instanceof Error ? error.message : String(error));
  }
  
  console.log('\n🏁 Test completed');
}

// Run the test
testProcessMyntraEmails().catch(error => {
  console.error('Test execution failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}); 