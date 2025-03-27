/**
 * Diagnostic script for the email processor
 * 
 * This script helps diagnose issues with the email processor,
 * particularly the OrderID extraction functionality.
 */

import * as EmailProcessor from './email-processor';
import { EmailMessage } from './gmail-service';

// Create a mock email with various formats of order IDs for testing
function createSampleEmail(subjectTemplate: string, bodyTemplate: string, orderId: string): EmailMessage {
  const subject = subjectTemplate.replace('{{orderId}}', orderId);
  const body = bodyTemplate.replace(/\{\{orderId\}\}/g, orderId);
  
  return {
    id: `test-email-${Date.now()}`,
    threadId: 'test-thread',
    labelIds: ['INBOX', 'UNREAD'],
    snippet: `Test email for ${orderId}`,
    historyId: Date.now().toString(),
    internalDate: Date.now().toString(),
    sizeEstimate: 1000,
    from: 'Myntra <orders@myntra.com>',
    to: 'test@example.com',
    subject: subject,
    date: new Date(),
    body: {
      html: body,
      text: `Your Myntra order ${orderId} has been confirmed.`
    }
  };
}

// Log the details of the HTML email content
function logHtmlContent(email: EmailMessage) {
  console.log(`\n===== HTML CONTENT ANALYSIS =====`);
  console.log(`Subject: ${email.subject || 'No subject'}`);
  console.log(`HTML available: ${email.body?.html ? 'Yes' : 'No'}`);
  
  if (email.body?.html) {
    const html = email.body.html;
    // Log key HTML sections
    console.log(`\nHTML Content Length: ${html.length} characters`);
    console.log(`Contains "Order ID": ${html.includes('Order ID')}`);
    console.log(`Contains "order": ${html.includes('order')}`);
    
    // Extract and log sections with potential order ID information
    const orderIdRegex = /Order\s*ID[:\s]*([A-Z0-9]+)/i;
    const match = html.match(orderIdRegex);
    if (match) {
      console.log(`\nFound Order ID pattern match: "${match[0]}"`);
      console.log(`Extracted value: "${match[1]}"`);
    } else {
      console.log(`\nNo standard Order ID pattern found in HTML`);
    }
    
    // Look for table data that might contain order ID
    const tableDataRegex = /<td[^>]*>(.*?Order\s*ID.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>/is;
    const tableMatch = html.match(tableDataRegex);
    if (tableMatch) {
      console.log(`\nFound Order ID in table structure:`);
      console.log(`Header: "${tableMatch[1].trim()}"`);
      console.log(`Value: "${tableMatch[2].trim()}"`);
    }
  }
  
  console.log(`\nText Content: "${email.body?.text || 'No text content'}"`);
}

// Test the extraction functions on an email
function testExtraction(email: EmailMessage) {
  console.log(`\n===== EXTRACTION TEST =====`);
  
  // Test if it's recognized as a Myntra email
  const isMyntraEmail = EmailProcessor.isMyntraEmail(email);
  console.log(`Is Myntra Email: ${isMyntraEmail}`);
  
  // Test order type identification
  const isOrderConfirmation = EmailProcessor.isMyntraOrderConfirmation(email);
  console.log(`Is Order Confirmation: ${isOrderConfirmation}`);
  
  // Test extraction functions
  const orderId = EmailProcessor.extractMyntraOrderId(email);
  console.log(`Extracted Order ID: ${orderId || 'FAILED'}`);
  
  // Test with different regex patterns
  console.log(`\n===== REGEX PATTERN TESTS =====`);
  const regexPatterns = [
    { name: 'Standard Pattern', regex: /Order\s*ID[:\s]*([A-Z0-9]+)/i },
    { name: 'Subject Pattern', regex: /Order\s+([A-Z0-9]+)/i },
    { name: 'MON Pattern', regex: /(MON\d+)/i },
    { name: 'Generic ID Pattern', regex: /\b([A-Z0-9]{8,})\b/i },
  ];
  
  for (const pattern of regexPatterns) {
    const subjectMatch = email.subject?.match(pattern.regex) || null;
    console.log(`${pattern.name} - Subject: ${subjectMatch ? subjectMatch[1] : 'No match'}`);
    
    const textMatch = email.body?.text?.match(pattern.regex) || null;
    console.log(`${pattern.name} - Text: ${textMatch ? textMatch[1] : 'No match'}`);
    
    if (email.body?.html) {
      const htmlMatch = email.body.html.match(pattern.regex);
      console.log(`${pattern.name} - HTML: ${htmlMatch ? htmlMatch[1] : 'No match'}`);
    }
  }
}

// Run diagnostic tests with various email formats
function runDiagnosticTests() {
  console.log('🔍 STARTING EMAIL PROCESSOR DIAGNOSTICS');
  console.log('=====================================\n');
  
  // Test with standard format
  const standardEmail = createSampleEmail(
    'Your Myntra Order {{orderId}} is Confirmed',
    `
    <div>
      <h2>Order Confirmation</h2>
      <table>
        <tr>
          <td><strong>Order ID:</strong></td>
          <td>{{orderId}}</td>
        </tr>
      </table>
    </div>
    `,
    'MON1234567'
  );
  
  console.log('TEST 1: STANDARD FORMAT EMAIL');
  logHtmlContent(standardEmail);
  testExtraction(standardEmail);
  
  // Test with different order ID format
  const alternateFormatEmail = createSampleEmail(
    'Order {{orderId}} has been confirmed - Myntra',
    `
    <div>
      <p>Your order {{orderId}} has been confirmed.</p>
    </div>
    `,
    'MON7654321'
  );
  
  console.log('\n\nTEST 2: ALTERNATE FORMAT EMAIL');
  logHtmlContent(alternateFormatEmail);
  testExtraction(alternateFormatEmail);
  
  // Test with the format from our mock email test
  const mockTestEmail = {
    id: 'mock-email-id',
    threadId: 'mock-thread-id',
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
      </div>
      `,
      text: 'Your Myntra order MON1234567 has been confirmed.'
    }
  };
  
  console.log('\n\nTEST 3: MOCK TEST EMAIL FORMAT');
  logHtmlContent(mockTestEmail);
  testExtraction(mockTestEmail);
  
  console.log('\n\n🏁 DIAGNOSTICS COMPLETE');
}

// Run the diagnostics
runDiagnosticTests(); 