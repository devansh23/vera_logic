/**
 * Mock test for the Myntra email processing API route
 * 
 * This script simulates the functionality of the API route without
 * actually making HTTP requests or accessing the database.
 */

import * as EmailProcessor from './email-processor';
import { EmailMessage } from './gmail-service';
import { log } from './logger';

interface ProcessRequestOptions {
  max?: number;
  onlyUnread?: boolean;
  markAsRead?: boolean;
  daysBack?: number;
}

// Simulate the route handler
async function simulateProcessMyntraEmailsRoute(options: ProcessRequestOptions = {}) {
  console.log('🧪 Simulating Myntra emails API route');
  console.log('====================================\n');
  
  const { max = 10, onlyUnread = true, markAsRead = true, daysBack = 30 } = options;
  
  console.log('📋 Request parameters:');
  console.log(`- Max emails: ${max}`);
  console.log(`- Only unread: ${onlyUnread}`);
  console.log(`- Mark as read: ${markAsRead}`);
  console.log(`- Days back: ${daysBack}`);
  
  console.log('\n1. Authenticating user...');
  console.log('✅ User authenticated');
  
  console.log('\n2. Checking Gmail connection...');
  console.log('✅ Gmail connected');
  
  console.log('\n3. Fetching emails...');
  // Create mock emails
  const mockEmails = createMockEmails(3);
  console.log(`✅ Found ${mockEmails.length} emails`);
  
  console.log('\n4. Filtering for Myntra emails...');
  const myntraEmails = mockEmails.filter(EmailProcessor.isMyntraEmail);
  console.log(`✅ Found ${myntraEmails.length} Myntra emails`);
  
  console.log('\n5. Processing emails...');
  const processedOrders = [];
  let successCount = 0;
  let failureCount = 0;
  
  for (const email of myntraEmails) {
    console.log(`\nProcessing email ${email.id}:`);
    console.log(`- Subject: ${email.subject}`);
    
    // Check if this is a Myntra email we can process
    if (EmailProcessor.isMyntraOrderConfirmation(email)) {
      console.log('✅ Identified as Myntra order confirmation');
      
      // Extract order information
      const orderInfo = EmailProcessor.processMyntraEmail(email);
      
      if (orderInfo) {
        successCount++;
        console.log('✅ Successfully extracted order information:');
        console.log(`- Order ID: ${orderInfo.orderId}`);
        console.log(`- Date: ${orderInfo.orderDate?.toDateString()}`);
        console.log(`- Status: ${orderInfo.orderStatus}`);
        console.log(`- Items: ${orderInfo.items.length}`);
        
        // Add to processed orders
        processedOrders.push({
          id: `order-${processedOrders.length + 1}`,
          orderId: orderInfo.orderId,
          orderDate: orderInfo.orderDate,
          totalAmount: orderInfo.totalAmount,
          currency: orderInfo.currency,
          retailer: 'Myntra',
          items: orderInfo.items,
          status: orderInfo.orderStatus || 'Unknown',
          emailId: email.id,
          emailDate: email.date,
          processed: true
        });
        
        if (markAsRead) {
          console.log('✅ Marked email as read');
        }
      } else {
        failureCount++;
        console.log('❌ Failed to extract order information');
        
        processedOrders.push({
          id: `order-${processedOrders.length + 1}`,
          orderId: '',
          retailer: 'Myntra',
          items: [],
          status: 'Unknown',
          emailId: email.id,
          emailDate: email.date,
          processed: false,
          error: 'Failed to extract order information'
        });
      }
    } else {
      console.log('❌ Not a Myntra order confirmation, skipping');
    }
  }
  
  console.log('\n6. Generating response...');
  const response = {
    success: true,
    message: `Processed ${processedOrders.length} Myntra emails`,
    stats: {
      totalEmails: mockEmails.length,
      myntraEmails: myntraEmails.length,
      processedOrders: processedOrders.length,
      successfullyProcessed: successCount,
      failedToProcess: failureCount
    },
    orders: processedOrders
  };
  
  console.log('\n📊 Results:');
  console.log(JSON.stringify(response, null, 2));
  
  console.log('\n🏁 Simulation completed');
  return response;
}

// Create mock emails for testing
function createMockEmails(count: number): EmailMessage[] {
  const emails: EmailMessage[] = [];
  
  // Add Myntra order confirmation email
  emails.push({
    id: 'myntra-order-1',
    threadId: 'thread-1',
    labelIds: ['INBOX', 'UNREAD'],
    snippet: 'Your Myntra order has been confirmed',
    historyId: '12345',
    internalDate: Date.now().toString(),
    sizeEstimate: 5000,
    from: 'Myntra <order-update@myntra.com>',
    to: 'customer@example.com',
    subject: 'Your Myntra Order MON1234567 is Confirmed',
    date: new Date(),
    body: {
      html: `
<div>
  <h2>Thank you for shopping with Myntra!</h2>
  <p>Your order has been confirmed and is being processed. Here are your order details:</p>
  
  <table>
    <tr>
      <td><strong>Order ID:</strong></td>
      <td>MON1234567</td>
    </tr>
    <tr>
      <td><strong>Order Date:</strong></td>
      <td>01/12/2023</td>
    </tr>
    <tr>
      <td><strong>Payment Method:</strong></td>
      <td>Credit Card</td>
    </tr>
  </table>
  
  <h3>PRODUCT DETAILS:</h3>
  <table>
    <tr>
      <th>Product</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
    <tr>
      <td>
        <strong>Nike Sports Shoes - Black</strong><br>
        Size: UK 9<br>
        Color: Black
      </td>
      <td>1</td>
      <td>Rs. 4,999.00</td>
    </tr>
  </table>
  
  <h3>SHIPPING ADDRESS:</h3>
  <p>
    John Doe<br>
    123 Main Street, Apartment 4B<br>
    Bangalore, Karnataka<br>
    560001<br>
    India
  </p>
</div>
      `,
      text: `Order ID: MON1234567`
    }
  });
  
  // Add shipping confirmation email
  if (count >= 2) {
    emails.push({
      id: 'myntra-shipping-1',
      threadId: 'thread-2',
      labelIds: ['INBOX'],
      snippet: 'Your Myntra order has been shipped',
      historyId: '12346',
      internalDate: Date.now().toString(),
      sizeEstimate: 4500,
      from: 'Myntra <shipping-update@myntra.com>',
      to: 'customer@example.com',
      subject: 'Your Myntra Order MON7654321 has been Shipped',
      date: new Date(),
      body: {
        text: `Your order has been shipped! Order ID: MON7654321`
      }
    });
  }
  
  // Add non-Myntra email
  if (count >= 3) {
    emails.push({
      id: 'non-myntra-1',
      threadId: 'thread-3',
      labelIds: ['INBOX'],
      snippet: 'Meeting tomorrow',
      historyId: '12347',
      internalDate: Date.now().toString(),
      sizeEstimate: 2000,
      from: 'colleague@company.com',
      to: 'customer@example.com',
      subject: 'Team Meeting Tomorrow',
      date: new Date(),
      body: {
        text: 'Hi, just a reminder about our team meeting tomorrow at 10am.'
      }
    });
  }
  
  return emails;
}

// Run the simulation
simulateProcessMyntraEmailsRoute({
  max: 5,
  onlyUnread: true,
  markAsRead: true,
  daysBack: 30
}).catch(error => {
  console.error('Error in simulation:', error);
  process.exit(1);
}); 