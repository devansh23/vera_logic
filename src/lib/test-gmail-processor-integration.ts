// Test file for demonstrating Gmail service and Email processor integration
import * as GmailService from './gmail-service';
import * as EmailProcessor from './email-processor';
import { log } from './logger';

// Mock function to simulate fetching emails and processing them
async function processRecentMyntraEmails(userId: string): Promise<void> {
  try {
    console.log(`Starting to process Myntra emails for user: ${userId}`);
    
    // Step 1: Initialize the Gmail client
    console.log('Step 1: Initializing Gmail client...');
    // Note: This would throw an error in testing since we don't have real credentials
    // const gmail = await GmailService.initializeGmailClient(userId);
    console.log('Gmail client would be initialized with real credentials');
    
    // Step 2: Fetch recent Myntra emails
    console.log('\nStep 2: Fetching recent Myntra emails...');
    // In a real implementation, we would use:
    // const response = await GmailService.listEmails(userId, {
    //   q: 'from:myntra.com OR subject:myntra',
    //   maxResults: 10
    // });
    console.log('Would fetch emails with query: from:myntra.com OR subject:myntra');
    
    // For testing, we'll use a mock response with our sample email
    console.log('Using mock data for testing');
    const mockEmails = [createSampleMyntraEmail()];
    console.log(`Found ${mockEmails.length} Myntra emails`);
    
    // Step 3: Process each email
    console.log('\nStep 3: Processing emails...');
    
    const processedOrders = [];
    
    for (const email of mockEmails) {
      console.log(`\nProcessing email: "${email.subject}"`);
      
      // Check if this is a Myntra email
      if (EmailProcessor.isMyntraEmail(email)) {
        console.log('✓ Email identified as a Myntra email');
        
        // Determine email type
        let emailType = 'Unknown';
        if (EmailProcessor.isMyntraOrderConfirmation(email)) {
          emailType = 'Order Confirmation';
        } else if (EmailProcessor.isMyntraShippingConfirmation(email)) {
          emailType = 'Shipping Confirmation';
        } else if (EmailProcessor.isMyntraDeliveryConfirmation(email)) {
          emailType = 'Delivery Confirmation';
        }
        console.log(`✓ Email type: ${emailType}`);
        
        // Process the email to extract order info
        const orderInfo = EmailProcessor.processMyntraEmail(email);
        
        if (orderInfo) {
          console.log('✓ Successfully extracted order information:');
          console.log(`  - Order ID: ${orderInfo.orderId}`);
          console.log(`  - Date: ${orderInfo.orderDate}`);
          console.log(`  - Status: ${orderInfo.orderStatus}`);
          console.log(`  - Amount: ${orderInfo.totalAmount} ${orderInfo.currency}`);
          console.log(`  - Items: ${orderInfo.items.length}`);
          console.log(`  - Payment: ${orderInfo.paymentMethod}`);
          
          // In a real application, we would save this order info to the database
          console.log('  - Would save order info to database');
          
          processedOrders.push(orderInfo);
          
          // Mark the email as read
          console.log('  - Would mark email as read');
          // In a real implementation:
          // await GmailService.markEmailAsRead(userId, email.id);
        } else {
          console.log('✗ Failed to extract order information');
        }
      } else {
        console.log('✗ Not a Myntra email, skipping');
      }
    }
    
    console.log(`\nProcessing complete. Processed ${processedOrders.length} orders.`);
    
  } catch (error) {
    console.error('Error processing Myntra emails:', error);
  }
}

// Helper function to create a sample Myntra order email
function createSampleMyntraEmail(): GmailService.EmailMessage {
  return {
    id: 'sample-id-123',
    threadId: 'thread-123',
    labelIds: ['INBOX', 'UNREAD'],
    snippet: 'Your Myntra order is confirmed',
    historyId: 'hist-123',
    internalDate: '1617235748000',
    sizeEstimate: 24680,
    from: 'Myntra <orders@myntra.com>',
    to: 'John Doe <john.doe@example.com>',
    subject: 'Your Myntra Order #MON1234567 is confirmed',
    date: new Date('2023-12-01T10:30:00Z'),
    body: {
      text: `
Dear John Doe,

Thank you for shopping with Myntra!

Your order has been confirmed and is being processed. Here are your order details:

Order ID: MON1234567
Order Date: 01/12/2023
Payment Method: Credit Card

PRODUCT DETAILS:
-----------------------
1. Nike Sports Shoes - Black
   Size: UK 9
   Color: Black
   Quantity: 1
   Price: Rs. 4,999.00

2. Levi's Men's Denim Jacket
   Size: XL
   Color: Blue
   Quantity: 1
   Price: Rs. 3,599.00

-----------------------
Subtotal: Rs. 8,598.00
Shipping: Rs. 0.00 (Free)
Discount: Rs. 1,000.00
Total: Rs. 7,598.00

SHIPPING ADDRESS:
John Doe
123 Main Street, Apartment 4B
Bangalore, Karnataka
560001
India

Your order will be shipped soon. You will receive an email with tracking information once your order ships.

For any questions, please contact our customer support at support@myntra.com.

Thank you,
The Myntra Team
      `,
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
    <tr>
      <td>
        <strong>Levi's Men's Denim Jacket</strong><br>
        Size: XL<br>
        Color: Blue
      </td>
      <td>1</td>
      <td>Rs. 3,599.00</td>
    </tr>
  </table>
  
  <table>
    <tr>
      <td>Subtotal:</td>
      <td>Rs. 8,598.00</td>
    </tr>
    <tr>
      <td>Shipping:</td>
      <td>Rs. 0.00 (Free)</td>
    </tr>
    <tr>
      <td>Discount:</td>
      <td>Rs. 1,000.00</td>
    </tr>
    <tr>
      <td><strong>Total:</strong></td>
      <td><strong>Rs. 7,598.00</strong></td>
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
  
  <p>Your order will be shipped soon. You will receive an email with tracking information once your order ships.</p>
  
  <p>For any questions, please contact our customer support at <a href="mailto:support@myntra.com">support@myntra.com</a>.</p>
  
  <p>Thank you,<br>The Myntra Team</p>
</div>
      `
    }
  };
}

// Run the test
const userId = 'test-user-id-123';
processRecentMyntraEmails(userId)
  .then(() => console.log('Test completed'))
  .catch(error => console.error('Test failed:', error));

// Export for potential use in other tests
export default {
  processRecentMyntraEmails,
  createSampleMyntraEmail
}; 