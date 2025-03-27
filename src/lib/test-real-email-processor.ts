import { processMyntraEmail, extractMyntraOrderId, extractMyntraTrackingInfo } from './email-processor';
import { EmailMessage } from './gmail-service';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Test the email processor with different mock scenarios
 */
async function testEmailProcessor() {
  console.log("Starting email processor test...");
  
  // Test with a mock email that has good HTML structure
  await testWithGoodHtml();
  
  // Test with a mock email that has minimal HTML
  await testWithMinimalHtml();
  
  // Test with a mock email that has only text content
  await testWithTextOnly();
  
  console.log("\n🎉 All tests completed!");
}

/**
 * Test with a mock email that has well-structured HTML
 */
async function testWithGoodHtml() {
  console.log("\n=== Testing with well-structured HTML ===");
  
  const mockEmail: EmailMessage = {
    id: "good-html-id",
    threadId: "mock-thread",
    labelIds: [],
    snippet: "Thank you for shopping at Myntra. Your Myntra order MON7654321 has been confirmed.",
    historyId: "",
    internalDate: "",
    sizeEstimate: 0,
    from: "orders@myntra.com",
    to: "customer@example.com",
    subject: "Your Myntra Order MON7654321 has been confirmed",
    date: new Date(),
    body: {
      text: "Order Confirmation. Your order no. MON7654321 has been confirmed. Items: Blue Cotton T-Shirt (M) - Rs. 899, Black Slim Fit Jeans (32) - Rs. 1299. Order total: Rs. 2198",
      html: `
        <div>
          <h1>Order Confirmation</h1>
          <p>Your order no. <strong>MON7654321</strong> has been confirmed.</p>
          <table>
            <tr><th>Item</th><th>Price</th><th>Qty</th></tr>
            <tr>
              <td>Blue Cotton T-Shirt (M)</td>
              <td>Rs. 899</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Black Slim Fit Jeans (32)</td>
              <td>Rs. 1299</td>
              <td>1</td>
            </tr>
          </table>
          <p>Order total: Rs. 2198</p>
          <p>Track your order: <a href="https://www.myntra.com/track/MON7654321">Click here</a></p>
        </div>
      `,
    },
    attachments: [],
  };
  
  // Process with html-first approach
  console.time("Good HTML extraction time");
  const result = processMyntraEmail(mockEmail);
  console.timeEnd("Good HTML extraction time");
  
  if (result) {
    console.log("\n✅ Extraction successful using HTML parsing!");
    console.log(`Order ID: ${result.orderId}`);
    console.log(`Items: ${result.items ? result.items.length : 0}`);
    
    if (result.items && result.items.length > 0) {
      console.log("\nItem details:");
      result.items.forEach((item, index) => {
        console.log(`- Item ${index + 1}: ${item.productName} (${item.price})`);
      });
    }
  } else {
    console.log("❌ Failed to extract order information from the mock email");
  }
}

/**
 * Test with a mock email that has minimal HTML structure
 */
async function testWithMinimalHtml() {
  console.log("\n=== Testing with minimal HTML ===");
  
  const mockEmail: EmailMessage = {
    id: "minimal-html-id",
    threadId: "mock-thread",
    labelIds: [],
    snippet: "Thank you for shopping at Myntra. Your order MON7654321 has been confirmed.",
    historyId: "",
    internalDate: "",
    sizeEstimate: 0,
    from: "orders@myntra.com",
    to: "customer@example.com",
    subject: "Your Myntra Order MON7654321 has been confirmed",
    date: new Date(),
    body: {
      text: "Order Confirmation. Your order no. MON7654321 has been confirmed. Items: Blue Cotton T-Shirt (M) - Rs. 899. Order total: Rs. 899",
      html: `
        <div>
          <p>Order Confirmation</p>
          <p>Order ID: MON7654321</p>
          <p>Items: Blue Cotton T-Shirt (M) - Rs. 899</p>
          <p>Total: Rs. 899</p>
        </div>
      `,
    },
    attachments: [],
  };
  
  // Process with html-first approach
  console.time("Minimal HTML extraction time");
  const result = processMyntraEmail(mockEmail);
  console.timeEnd("Minimal HTML extraction time");
  
  if (result) {
    console.log("\n✅ Extraction successful!");
    console.log(`Order ID: ${result.orderId}`);
    console.log(`Items: ${result.items ? result.items.length : 0}`);
    
    // Show the extraction method based on the item count
    // If HTML parsing worked well, we should have items extracted
    // If it fell back to regex, we might not have detailed items
    if (result.items && result.items.length > 0) {
      console.log("Likely used HTML parsing or successful regex extraction");
    } else {
      console.log("Likely used regex for order ID only");
    }
    
    if (result.items && result.items.length > 0) {
      console.log("\nItem details:");
      result.items.forEach((item, index) => {
        console.log(`- Item ${index + 1}: ${item.productName || 'Unknown'} (${item.price || 'N/A'})`);
      });
    }
  } else {
    console.log("❌ Failed to extract order information from the mock email");
  }
}

/**
 * Test with a mock email that has only text content
 */
async function testWithTextOnly() {
  console.log("\n=== Testing with text-only content ===");
  
  const mockEmail: EmailMessage = {
    id: "text-only-id",
    threadId: "mock-thread",
    labelIds: [],
    snippet: "Thank you for shopping at Myntra. Your order MON7654321 has been confirmed.",
    historyId: "",
    internalDate: "",
    sizeEstimate: 0,
    from: "orders@myntra.com",
    to: "customer@example.com",
    subject: "Your Myntra Order MON7654321 has been confirmed",
    date: new Date(),
    body: {
      text: "Order Confirmation. Your order no. MON7654321 has been confirmed. Items: Blue Cotton T-Shirt (M) - Rs. 899, Black Slim Fit Jeans (32) - Rs. 1299. Order total: Rs. 2198",
      html: '', // No HTML content
    },
    attachments: [],
  };
  
  // Process with html-first approach
  console.time("Text-only extraction time");
  const result = processMyntraEmail(mockEmail);
  console.timeEnd("Text-only extraction time");
  
  if (result) {
    console.log("\n✅ Extraction successful using regex fallback!");
    console.log(`Order ID: ${result.orderId}`);
    console.log(`Items: ${result.items ? result.items.length : 0}`);
    
    if (result.items && result.items.length > 0) {
      console.log("\nItem details:");
      result.items.forEach((item, index) => {
        console.log(`- Item ${index + 1}: ${item.productName || 'Unknown'} (${item.price || 'N/A'})`);
      });
    }
  } else {
    console.log("❌ Failed to extract order information from the mock email");
  }
}

// Run the test
testEmailProcessor().catch(console.error); 