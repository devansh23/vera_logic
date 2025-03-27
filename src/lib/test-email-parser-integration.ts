/**
 * Integration test for email-content-parser.ts with email-processor.ts
 * 
 * Demonstrates how the HTML parsing utilities can enhance and improve
 * the existing email processing functionality.
 */

import * as EmailProcessor from './email-processor';
import * as EmailContentParser from './email-content-parser';
import { EmailMessage } from './gmail-service';

// Create a sample Myntra email
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
  
  <p>Track your order here: <a href="https://www.myntra.com/tracking/MON1234567">Track Order</a></p>
  
  <p>Thank you,<br>The Myntra Team</p>
</div>
      `,
      text: `
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
      `
    }
  };
}

/**
 * Compare results from the regular email processor and the HTML parser
 */
function compareResults() {
  console.log('=== Email Parser Integration Test ===\n');
  
  // Create a sample email
  const email = createSampleMyntraEmail();
  
  console.log('Testing email processing on sample Myntra email...\n');
  
  // Process using the original Email Processor
  console.log('--- Original Email Processor Results ---');
  const originalResult = EmailProcessor.processMyntraEmail(email);
  
  console.log(`Order ID: ${originalResult?.orderId || 'Not found'}`);
  console.log(`Order Date: ${originalResult?.orderDate?.toDateString() || 'Not found'}`);
  console.log(`Total Amount: ${originalResult?.totalAmount || 'Not found'} ${originalResult?.currency || ''}`);
  console.log(`Items: ${originalResult?.items.length || 0}`);
  
  if (originalResult?.items.length) {
    console.log('\nOrder Items:');
    originalResult.items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.productName} (${item.price || 'No price'} ${originalResult?.currency || ''})`);
      if (item.size) console.log(`     Size: ${item.size}`);
      if (item.color) console.log(`     Color: ${item.color}`);
      if (item.quantity) console.log(`     Quantity: ${item.quantity}`);
    });
  }
  
  console.log(`Shipping Address: ${originalResult?.shippingAddress || 'Not found'}`);
  console.log(`Tracking URL: ${originalResult?.trackingUrl || 'Not found'}`);
  
  // Process using the new HTML content parser
  console.log('\n--- New HTML Content Parser Results ---');
  const newResult = EmailContentParser.parseMyntraEmail(email);
  
  console.log(`Order ID: ${newResult?.orderId || 'Not found'}`);
  console.log(`Order Date: ${newResult?.orderDate?.toDateString() || 'Not found'}`);
  console.log(`Total Amount: ${newResult?.totalAmount || 'Not found'}`);
  console.log(`Items: ${newResult?.products.length || 0}`);
  
  if (newResult?.products.length) {
    console.log('\nOrder Items:');
    newResult.products.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.productName} (${item.price || 'No price'} INR)`);
      if (item.size) console.log(`     Size: ${item.size}`);
      if (item.color) console.log(`     Color: ${item.color}`);
      if (item.quantity) console.log(`     Quantity: ${item.quantity}`);
    });
  }
  
  console.log(`Tracking URL: ${newResult?.trackingUrl || 'Not found'}`);
  
  // Extract additional information using HTML parser
  console.log('\n--- Additional Information From HTML Parser ---');
  const extraInfo = EmailContentParser.extractInfoFromEmailHtml(email);
  
  console.log(`Detected Retailer: ${extraInfo.retailer}`);
  console.log(`Number of Images: ${extraInfo.images.length}`);
  console.log(`Number of Links: ${extraInfo.links.length}`);
  console.log(`Number of Tables: ${extraInfo.tables.length}`);
  
  // Show how to enhance the original processor with HTML parsing
  console.log('\n=== Enhanced Integration Example ===');
  // First use the original processor to get basic information
  const enhancedResult = EmailProcessor.processMyntraEmail(email);
  
  // Then enhance with HTML parsing data
  if (enhancedResult) {
    // Add better product information
    const htmlProducts = EmailContentParser.extractMyntraProductsFromHtml(email);
    if (htmlProducts.length > 0 && htmlProducts.length >= enhancedResult.items.length) {
      console.log('Enhanced product information with HTML parsing data');
      
      // Merge product information
      for (let i = 0; i < enhancedResult.items.length; i++) {
        if (i < htmlProducts.length) {
          // Keep original product name but add missing details
          if (!enhancedResult.items[i].brand && htmlProducts[i].brand) {
            enhancedResult.items[i].brand = htmlProducts[i].brand;
          }
          
          if (!enhancedResult.items[i].size && htmlProducts[i].size) {
            enhancedResult.items[i].size = htmlProducts[i].size;
          }
          
          if (!enhancedResult.items[i].color && htmlProducts[i].color) {
            enhancedResult.items[i].color = htmlProducts[i].color;
          }
          
          if (!enhancedResult.items[i].imageUrl && htmlProducts[i].imageUrl) {
            enhancedResult.items[i].imageUrl = htmlProducts[i].imageUrl;
          }
        }
      }
    }
    
    // Add tracking URL if missing
    if (!enhancedResult.trackingUrl) {
      const links = EmailContentParser.extractLinks(email.body?.html || '');
      for (const link of links) {
        if (
          link.text.toLowerCase().includes('track') ||
          link.href.toLowerCase().includes('track')
        ) {
          enhancedResult.trackingUrl = link.href;
          console.log('Added tracking URL from HTML link extraction');
          break;
        }
      }
    }
    
    console.log('\nEnhanced Result:');
    console.log(`Order ID: ${enhancedResult.orderId}`);
    console.log(`Order Date: ${enhancedResult.orderDate?.toDateString() || 'Not found'}`);
    console.log(`Total Amount: ${enhancedResult.totalAmount || 'Not found'} ${enhancedResult.currency || ''}`);
    console.log(`Items: ${enhancedResult.items.length}`);
    
    console.log('\nEnhanced Order Items:');
    enhancedResult.items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.productName} (${item.price || 'No price'} ${enhancedResult.currency || ''})`);
      if (item.brand) console.log(`     Brand: ${item.brand}`);
      if (item.size) console.log(`     Size: ${item.size}`);
      if (item.color) console.log(`     Color: ${item.color}`);
      if (item.quantity) console.log(`     Quantity: ${item.quantity}`);
      if (item.imageUrl) console.log(`     Image URL: ${item.imageUrl}`);
    });
    
    console.log(`Shipping Address: ${enhancedResult.shippingAddress || 'Not found'}`);
    console.log(`Tracking URL: ${enhancedResult.trackingUrl || 'Not found'}`);
  }
  
  console.log('\n=== Integration Test Completed ===');
}

// Run the comparison
compareResults(); 