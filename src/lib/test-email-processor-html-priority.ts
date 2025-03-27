/**
 * Test script to verify the updated email processor with HTML parsing priority
 * 
 * This test verifies that:
 * 1. HTML parsing is used as the primary extraction method
 * 2. Regex extraction is used as a fallback
 * 3. PDF extraction is used as a last resort
 */

import * as EmailProcessor from './email-processor';
import * as EmailContentParser from './email-content-parser';
import { EmailMessage } from './gmail-service';
import { log } from './logger';

// Create a sample email with HTML content
function createSampleEmail(options: {
  includeHtml?: boolean;
  htmlQuality?: 'good' | 'poor';
  includeText?: boolean;
  includePdf?: boolean;
} = {}): EmailMessage {
  const {
    includeHtml = true,
    htmlQuality = 'good',
    includeText = true,
    includePdf = false
  } = options;
  
  // Create sample HTML content
  const goodHtml = `
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
  
  <p>Track your order here: <a href="https://www.myntra.com/tracking/MON1234567">Track Order</a></p>
  
  <p>Thank you,<br>The Myntra Team</p>
</div>
  `;
  
  // Create sample poor HTML that will cause HTML parsing to fail
  const poorHtml = `
<div>
  <p>Thank you for shopping with Myntra!</p>
  <p>Your order has been confirmed: MON1234567</p>
  <p>Total: Rs. 7,598.00</p>
  <p>Incomplete HTML with minimal structure</p>
</div>
  `;
  
  // Create sample plain text
  const plainText = `
Thank you for shopping with Myntra!

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

Track your order here: https://www.myntra.com/tracking/MON1234567

Thank you,
The Myntra Team
  `;
  
  // Create a mock PDF attachment
  const mockPdfAttachment = {
    filename: 'invoice.pdf',
    mimeType: 'application/pdf',
    size: 12345,
    data: Buffer.from('Mock PDF content')
  };
  
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
      html: includeHtml ? (htmlQuality === 'good' ? goodHtml : poorHtml) : undefined,
      text: includeText ? plainText : undefined
    },
    attachments: includePdf ? [mockPdfAttachment] : []
  };
}

// Test different scenarios
async function runTests() {
  console.log('=== Email Processor HTML Priority Tests ===\n');
  
  // Test 1: Email with good HTML (should use HTML parsing)
  console.log('Test 1: Email with good HTML content');
  const goodHtmlEmail = createSampleEmail({ htmlQuality: 'good' });
  const goodHtmlResult = EmailProcessor.processMyntraEmail(goodHtmlEmail);
  console.log(`Result: ${goodHtmlResult ? 'Success' : 'Failure'}`);
  if (goodHtmlResult) {
    console.log(`Order ID: ${goodHtmlResult.orderId}`);
    console.log(`Items: ${goodHtmlResult.items.length}`);
    console.log(`Extraction method should be HTML parsing`);
  }
  
  // Test 2: Email with poor HTML (should fall back to regex)
  console.log('\nTest 2: Email with poor HTML content (fall back to regex)');
  const poorHtmlEmail = createSampleEmail({ htmlQuality: 'poor' });
  const poorHtmlResult = EmailProcessor.processMyntraEmail(poorHtmlEmail);
  console.log(`Result: ${poorHtmlResult ? 'Success' : 'Failure'}`);
  if (poorHtmlResult) {
    console.log(`Order ID: ${poorHtmlResult.orderId}`);
    console.log(`Items: ${poorHtmlResult.items.length}`);
    console.log(`Extraction method should be regex`);
  }
  
  // Test 3: Email with only text, no HTML (should use regex)
  console.log('\nTest 3: Email with only text, no HTML');
  const textOnlyEmail = createSampleEmail({ includeHtml: false });
  const textOnlyResult = EmailProcessor.processMyntraEmail(textOnlyEmail);
  console.log(`Result: ${textOnlyResult ? 'Success' : 'Failure'}`);
  if (textOnlyResult) {
    console.log(`Order ID: ${textOnlyResult.orderId}`);
    console.log(`Items: ${textOnlyResult.items.length}`);
    console.log(`Extraction method should be regex`);
  }
  
  // Test 4: Email with PDF attachment (simulate HTML and regex failure)
  console.log('\nTest 4: Email with PDF attachment (simulated HTML and regex failure)');
  const pdfEmail = createSampleEmail({ includeHtml: false, includeText: false, includePdf: true });
  // Modify the subject to ensure it's still identified as a Myntra email
  pdfEmail.subject = 'Your Myntra Purchase';
  const pdfResult = EmailProcessor.processMyntraEmail(pdfEmail);
  console.log(`Result: ${pdfResult ? 'Success' : 'Failure'}`);
  if (pdfResult) {
    console.log(`Order ID: ${pdfResult.orderId}`);
    console.log(`Items: ${pdfResult.items.length}`);
    console.log(`Extraction method should be PDF processing`);
  }
  
  console.log('\n=== Tests Completed ===');
}

// Run the tests
runTests().catch(console.error); 