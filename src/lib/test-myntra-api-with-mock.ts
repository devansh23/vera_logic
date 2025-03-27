/**
 * Test script for the Myntra email processing logic
 * 
 * This script tests the core functionality of processing Myntra emails
 * without requiring an active session or Gmail connection.
 */

import * as EmailProcessor from './email-processor';
import { EmailMessage } from './gmail-service';
import { log } from './logger';

async function testMyntraProcessing() {
  console.log('🧪 Testing Myntra email processing');
  console.log('=================================\n');

  // Create a mock Myntra email
  const mockMyntraEmail: EmailMessage = createSampleMyntraEmail();

  console.log('📧 Created mock Myntra email');
  console.log(`- Subject: ${mockMyntraEmail.subject}`);
  console.log(`- From: ${mockMyntraEmail.from}`);
  console.log(`- Date: ${mockMyntraEmail.date?.toDateString()}`);
  
  // Test email identification
  console.log('\n1. Testing email identification');
  const isMyntra = EmailProcessor.isMyntraEmail(mockMyntraEmail);
  console.log(`- Is Myntra email: ${isMyntra ? '✅ Yes' : '❌ No'}`);
  
  const isOrderConfirmation = EmailProcessor.isMyntraOrderConfirmation(mockMyntraEmail);
  console.log(`- Is order confirmation: ${isOrderConfirmation ? '✅ Yes' : '❌ No'}`);
  
  const isShippingConfirmation = EmailProcessor.isMyntraShippingConfirmation(mockMyntraEmail);
  console.log(`- Is shipping confirmation: ${isShippingConfirmation ? '✅ Yes' : '❌ No'}`);
  
  const isDeliveryConfirmation = EmailProcessor.isMyntraDeliveryConfirmation(mockMyntraEmail);
  console.log(`- Is delivery confirmation: ${isDeliveryConfirmation ? '✅ Yes' : '❌ No'}`);
  
  // Test order extraction
  console.log('\n2. Testing order information extraction');
  
  // Debug each extraction step
  console.log('\nDEBUG: Individual extraction steps');
  const orderId = EmailProcessor.extractMyntraOrderId(mockMyntraEmail);
  console.log(`- Order ID: ${orderId || 'Not found'}`);
  
  const { amount, currency } = EmailProcessor.extractMyntraOrderAmount(mockMyntraEmail);
  console.log(`- Amount: ${amount || 'Not found'} ${currency || ''}`);
  
  const orderDate = EmailProcessor.extractMyntraOrderDate(mockMyntraEmail);
  console.log(`- Order Date: ${orderDate?.toDateString() || 'Not found'}`);
  
  const items = EmailProcessor.extractMyntraOrderItems(mockMyntraEmail);
  console.log(`- Items: ${items.length || 'None found'}`);
  
  const shippingAddress = EmailProcessor.extractMyntraShippingAddress(mockMyntraEmail);
  console.log(`- Shipping Address: ${shippingAddress ? 'Found' : 'Not found'}`);
  
  const { trackingNumber, trackingUrl } = EmailProcessor.extractMyntraTrackingInfo(mockMyntraEmail);
  console.log(`- Tracking: ${trackingNumber || 'No number'}, URL: ${trackingUrl || 'No URL'}`);
  
  const paymentMethod = EmailProcessor.extractMyntraPaymentMethod(mockMyntraEmail);
  console.log(`- Payment Method: ${paymentMethod || 'Not found'}`);
  
  console.log('\nNow testing full extraction:');
  const orderInfo = EmailProcessor.processMyntraEmail(mockMyntraEmail);
  
  if (orderInfo) {
    console.log('✅ Successfully extracted order information:');
    console.log(`- Order ID: ${orderInfo.orderId}`);
    console.log(`- Date: ${orderInfo.orderDate?.toDateString()}`);
    console.log(`- Status: ${orderInfo.orderStatus}`);
    console.log(`- Total: ${orderInfo.totalAmount} ${orderInfo.currency}`);
    console.log(`- Payment: ${orderInfo.paymentMethod}`);
    console.log(`- Items: ${orderInfo.items.length}`);
    
    // Print item details
    console.log('\nOrder items:');
    orderInfo.items.forEach((item, index) => {
      console.log(`\nItem ${index + 1}:`);
      console.log(`- Product: ${item.productName}`);
      console.log(`- Brand: ${item.brand || 'N/A'}`);
      console.log(`- Size: ${item.size || 'N/A'}`);
      console.log(`- Color: ${item.color || 'N/A'}`);
      console.log(`- Price: ${item.price || 'N/A'}`);
      console.log(`- Quantity: ${item.quantity || 1}`);
    });
    
    // Print shipping address
    if (orderInfo.shippingAddress) {
      console.log('\nShipping address:');
      console.log(orderInfo.shippingAddress);
    }
    
    // Print tracking information
    if (orderInfo.trackingNumber || orderInfo.trackingUrl) {
      console.log('\nTracking information:');
      if (orderInfo.trackingNumber) console.log(`- Tracking #: ${orderInfo.trackingNumber}`);
      if (orderInfo.trackingUrl) console.log(`- Tracking URL: ${orderInfo.trackingUrl}`);
    }
  } else {
    console.log('❌ Failed to extract order information');
  }
  
  console.log('\n🏁 Test completed');
}

/**
 * Create a sample Myntra email for testing
 */
function createSampleMyntraEmail(): EmailMessage {
  return {
    id: 'sample-email-id',
    threadId: 'sample-thread-id',
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

  <p>Order ID: MON1234567</p>
</div>
      `,
      text: `Thank you for shopping with Myntra!

Your order has been confirmed and is being processed. Here are your order details:

Order ID: MON1234567
Order Date: 01/12/2023
Payment Method: Credit Card

PRODUCT DETAILS:
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

Order ID: MON1234567`
    }
  };
}

// Run the test
testMyntraProcessing().catch(error => {
  console.error('Test execution failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}); 