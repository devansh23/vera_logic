/**
 * Test file for email-content-parser.ts
 * 
 * Verifies the functionality of HTML parsing utilities by running tests
 * against sample email HTML content.
 */

import * as EmailContentParser from './email-content-parser';
import { EmailMessage } from './gmail-service';
import { MyntraOrderItem } from './email-processor';

// Sample HTML email content for testing
const sampleHtml = `
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

// Sample with different structure for testing HTML variations
const alternativeHtml = `
<div>
  <div class="header">
    <img src="https://myntra.com/logo.png" alt="Myntra Logo">
    <h1>Order Confirmation</h1>
  </div>
  
  <div class="order-details">
    <div class="order-id">Order #: MON7654321</div>
    <div class="order-date">Placed on: 02/12/2023</div>
    <div class="payment">Paid via: UPI</div>
  </div>
  
  <div class="products">
    <div class="product-item">
      <img src="https://myntra.com/images/tshirt1.jpg" class="product-image">
      <div class="product-info">
        <div class="product-name">Roadster Men's Green T-Shirt</div>
        <div class="product-size">Size: M</div>
        <div class="product-color">Color: Green</div>
        <div class="product-price">₹699</div>
        <div class="product-quantity">Qty: 2</div>
      </div>
    </div>
    
    <div class="product-item">
      <img src="https://myntra.com/images/jeans1.jpg" class="product-image">
      <div class="product-info">
        <div class="product-name">Jack & Jones Blue Jeans</div>
        <div class="product-size">Size: 32</div>
        <div class="product-color">Color: Blue</div>
        <div class="product-price">₹1,899</div>
        <div class="product-quantity">Qty: 1</div>
      </div>
    </div>
  </div>
  
  <div class="summary">
    <div class="subtotal">Subtotal: ₹3,297</div>
    <div class="shipping">Shipping: FREE</div>
    <div class="discount">Discount: ₹300</div>
    <div class="total">Total: ₹2,997</div>
  </div>
  
  <div class="shipping-address">
    <h3>Shipping to:</h3>
    <p>
      Jane Smith<br>
      456 Park Avenue<br>
      Mumbai, Maharashtra<br>
      400001
    </p>
  </div>
  
  <div class="footer">
    <a href="https://myntra.com/orders/MON7654321/track">Track your shipment</a>
    <p>Need help? <a href="https://myntra.com/help">Visit our help center</a></p>
  </div>
</div>
`;

// Create sample email message object for testing
const createSampleEmail = (html: string, subject: string = 'Your Myntra Order MON1234567 is Confirmed'): EmailMessage => {
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
    subject,
    date: new Date(),
    body: {
      html,
      text: 'This is a plain text version of the email'
    }
  };
};

// Test function to run all tests
async function runTests() {
  console.log('=== Email Content Parser Tests ===\n');
  
  // Test basic HTML parsing
  console.log('1. Testing HTML parsing:');
  const doc = EmailContentParser.parseHtml(sampleHtml);
  console.log(`  Document parsed: ${doc !== null ? 'Success' : 'Failed'}`);
  
  // Test table extraction
  console.log('\n2. Testing table extraction:');
  const tables = EmailContentParser.extractTables(sampleHtml);
  console.log(`  Tables found: ${tables.length}`);
  console.log(`  First table headers: ${tables[0].headers.join(', ')}`);
  console.log(`  First table rows: ${tables[0].rows.length}`);
  
  // Test product extraction from tables
  console.log('\n3. Testing product extraction from tables:');
  const tableProducts = EmailContentParser.extractProductsFromTables(sampleHtml);
  console.log(`  Products found: ${tableProducts.length}`);
  if (tableProducts.length > 0) {
    console.log(`  First product: ${tableProducts[0].name}`);
    console.log(`  First product price: ${tableProducts[0].price}`);
  }
  
  // Test link extraction
  console.log('\n4. Testing link extraction:');
  const links = EmailContentParser.extractLinks(sampleHtml);
  console.log(`  Links found: ${links.length}`);
  links.forEach((link, index) => {
    console.log(`  Link ${index + 1}: ${link.text} (${link.href})`);
  });
  
  // Test image extraction
  console.log('\n5. Testing image extraction:');
  const images = EmailContentParser.extractImages(alternativeHtml);
  console.log(`  Images found: ${images.length}`);
  images.forEach((image, index) => {
    console.log(`  Image ${index + 1}: ${image.src} (${image.alt || 'no alt text'})`);
  });
  
  // Test order info extraction
  console.log('\n6. Testing order info extraction:');
  const orderInfo = EmailContentParser.extractOrderInfoFromHtml(sampleHtml);
  console.log(`  Order ID: ${orderInfo.orderId || 'Not found'}`);
  console.log(`  Order Date: ${orderInfo.orderDate || 'Not found'}`);
  console.log(`  Total Amount: ${orderInfo.totalAmount || 'Not found'}`);
  
  // Test Myntra product extraction
  console.log('\n7. Testing Myntra product extraction:');
  const email = createSampleEmail(sampleHtml);
  const myntraProducts = EmailContentParser.extractMyntraProductsFromHtml(email);
  console.log(`  Myntra products found: ${myntraProducts.length}`);
  myntraProducts.forEach((product, index) => {
    console.log(`  Product ${index + 1}: ${product.productName} (${product.price} INR)`);
  });
  
  // Test alternative HTML structure
  console.log('\n8. Testing alternative HTML structure:');
  const alternativeEmail = createSampleEmail(alternativeHtml, 'Your Myntra Order MON7654321 is Confirmed');
  const alternativeProducts = EmailContentParser.extractProductsFromHtml(alternativeHtml);
  console.log(`  Products found: ${alternativeProducts.length}`);
  alternativeProducts.forEach((product, index) => {
    console.log(`  Product ${index + 1}: ${product.name} (${product.price})`);
  });
  
  // Test complete email parsing
  console.log('\n9. Testing complete email parsing:');
  const parsedMyntraEmail = EmailContentParser.parseMyntraEmail(email);
  console.log(`  Order ID: ${parsedMyntraEmail?.orderId || 'Not found'}`);
  console.log(`  Order Date: ${parsedMyntraEmail?.orderDate?.toDateString() || 'Not found'}`);
  console.log(`  Total Amount: ${parsedMyntraEmail?.totalAmount || 'Not found'}`);
  console.log(`  Products Count: ${parsedMyntraEmail?.products.length || 0}`);
  console.log(`  Tracking URL: ${parsedMyntraEmail?.trackingUrl || 'Not found'}`);
  
  // Test comprehensive email info extraction
  console.log('\n10. Testing comprehensive email info extraction:');
  const emailInfo = EmailContentParser.extractInfoFromEmailHtml(email);
  console.log(`  Detected Retailer: ${emailInfo.retailer}`);
  console.log(`  Order Information: ${Object.keys(emailInfo.orderInfo).join(', ')}`);
  console.log(`  Products: ${emailInfo.products.length}`);
  console.log(`  Links: ${emailInfo.links.length}`);
  console.log(`  Images: ${emailInfo.images.length}`);
  console.log(`  Tables: ${emailInfo.tables.length}`);
  
  console.log('\n=== All Tests Completed ===');
}

// Run the tests
runTests().catch(console.error); 