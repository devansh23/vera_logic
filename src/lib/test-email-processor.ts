// Test file for verifying the email processor module
import * as EmailProcessor from './email-processor';
import { EmailMessage } from './gmail-service';

// Create a sample Myntra order confirmation email
const sampleMyntraEmail: EmailMessage = {
  id: 'sample-id-123',
  threadId: 'thread-123',
  labelIds: ['INBOX', 'UNREAD'],
  snippet: 'Your Myntra order is confirmed',
  historyId: 'hist-123',
  internalDate: '1617235748000', // Some timestamp
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

// Test email identification functions
console.log('Email Identification Tests:');
console.log('Is Myntra Email:', EmailProcessor.isMyntraEmail(sampleMyntraEmail));
console.log('Is Order Confirmation:', EmailProcessor.isMyntraOrderConfirmation(sampleMyntraEmail));
console.log('Is Shipping Confirmation:', EmailProcessor.isMyntraShippingConfirmation(sampleMyntraEmail));
console.log('Is Delivery Confirmation:', EmailProcessor.isMyntraDeliveryConfirmation(sampleMyntraEmail));

// Test extraction functions
console.log('\nExtraction Tests:');
console.log('Order ID:', EmailProcessor.extractMyntraOrderId(sampleMyntraEmail));
console.log('Order Amount:', EmailProcessor.extractMyntraOrderAmount(sampleMyntraEmail));
console.log('Order Date:', EmailProcessor.extractMyntraOrderDate(sampleMyntraEmail));
console.log('Shipping Address:', EmailProcessor.extractMyntraShippingAddress(sampleMyntraEmail));
console.log('Payment Method:', EmailProcessor.extractMyntraPaymentMethod(sampleMyntraEmail));

// Test order items extraction
const orderItems = EmailProcessor.extractMyntraOrderItems(sampleMyntraEmail);
console.log('\nOrder Items (count):', orderItems.length);
console.log('Order Items:', JSON.stringify(orderItems, null, 2));

// Test the main processing function
console.log('\nFull Processing Test:');
const orderInfo = EmailProcessor.processMyntraEmail(sampleMyntraEmail);
console.log('Processed Order Info:', JSON.stringify(orderInfo, null, 2));

// Test helper functions
console.log('\nHelper Function Tests:');
console.log('Extract Email:', EmailProcessor.testFunctions.extractEmailAddress('John Doe <john.doe@example.com>'));
console.log('Extract Name:', EmailProcessor.testFunctions.extractName('John Doe <john.doe@example.com>'));

// Export for potential use in other tests
export default {
  EmailProcessor,
  sampleMyntraEmail
}; 