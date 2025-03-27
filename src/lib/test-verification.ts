/**
 * Verification Script for Myntra Email Processing
 * 
 * This script runs a series of checks to verify that all components
 * of the Myntra email processing flow are working correctly.
 */

console.log('🔍 Starting Verification Checks');
console.log('==============================\n');

// 1. Import check
console.log('1. Checking imports...');
try {
  const GmailService = require('./gmail-service');
  const EmailProcessor = require('./email-processor');
  console.log('✅ Gmail Service imported successfully');
  console.log('✅ Email Processor imported successfully');
  
  console.log('\nExported functions from Gmail Service:');
  console.log(Object.keys(GmailService).join(', '));
  
  console.log('\nExported functions from Email Processor:');
  console.log(Object.keys(EmailProcessor).join(', '));
} catch (error) {
  console.error('❌ Import check failed:', error);
  process.exit(1);
}

// 2. API Route check
console.log('\n2. Checking API routes...');
const fs = require('fs');
const path = require('path');

const apiRoutePaths = [
  'src/app/api/gmail/process-myntra-emails/route.ts',
  'src/app/api/auth/gmail/status/route.ts',
  'src/app/api/auth/gmail/callback/route.ts',
];

let allRoutesExist = true;
for (const routePath of apiRoutePaths) {
  try {
    if (fs.existsSync(routePath)) {
      console.log(`✅ Found API route: ${routePath}`);
    } else {
      console.log(`❌ Missing API route: ${routePath}`);
      allRoutesExist = false;
    }
  } catch (error) {
    console.error(`❌ Error checking route ${routePath}:`, error);
    allRoutesExist = false;
  }
}

if (!allRoutesExist) {
  console.error('❌ Some API routes are missing');
} else {
  console.log('✅ All required API routes exist');
}

// 3. Component check
console.log('\n3. Checking UI components...');
const componentPaths = [
  'src/app/settings/process-myntra-emails.tsx',
  'src/app/settings/gmail-connect.tsx',
];

let allComponentsExist = true;
for (const componentPath of componentPaths) {
  try {
    if (fs.existsSync(componentPath)) {
      console.log(`✅ Found component: ${componentPath}`);
    } else {
      console.log(`❌ Missing component: ${componentPath}`);
      allComponentsExist = false;
    }
  } catch (error) {
    console.error(`❌ Error checking component ${componentPath}:`, error);
    allComponentsExist = false;
  }
}

if (!allComponentsExist) {
  console.error('❌ Some UI components are missing');
} else {
  console.log('✅ All required UI components exist');
}

// 4. Environment variables check
console.log('\n4. Checking environment variables...');
const requiredEnvVars = [
  'GMAIL_CLIENT_ID',
  'GMAIL_CLIENT_SECRET',
  'GMAIL_REDIRECT_URI',
];

let allEnvVarsExist = true;
for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    console.log(`✅ Found environment variable: ${envVar}`);
  } else {
    console.log(`❌ Missing environment variable: ${envVar}`);
    allEnvVarsExist = false;
  }
}

if (!allEnvVarsExist) {
  console.error('❌ Some environment variables are missing');
} else {
  console.log('✅ All required environment variables exist');
}

// 5. Mock email processing test
console.log('\n5. Running mock email processing test...');

// Create a mock email for testing
const createMockEmail = () => ({
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
    text: 'Your Myntra order MON1234567 has been confirmed.'
  }
});

try {
  const EmailProcessor = require('./email-processor');
  const mockEmail = createMockEmail();
  
  console.log('\n⚙️ Testing email identification:');
  const isMyntraEmail = EmailProcessor.isMyntraEmail(mockEmail);
  console.log(`Is Myntra email: ${isMyntraEmail}`);
  
  const isOrderConfirmation = EmailProcessor.isMyntraOrderConfirmation(mockEmail);
  console.log(`Is order confirmation: ${isOrderConfirmation}`);
  
  console.log('\n⚙️ Testing order information extraction:');
  const orderId = EmailProcessor.extractMyntraOrderId(mockEmail);
  console.log(`Order ID: ${orderId}`);
  
  const orderDate = EmailProcessor.extractMyntraOrderDate(mockEmail);
  console.log(`Order Date: ${orderDate ? orderDate.toDateString() : 'Not found'}`);
  
  const orderInfo = EmailProcessor.processMyntraEmail(mockEmail);
  if (orderInfo) {
    console.log('\n📦 Extracted order information:');
    console.log(JSON.stringify(orderInfo, null, 2));
    console.log('✅ Email processing test passed');
  } else {
    console.log('❌ Failed to extract order information');
  }
} catch (error) {
  console.error('❌ Email processing test failed:', error);
}

// 6. Summary
console.log('\n6. Verification Summary');
console.log('---------------------');
if (allRoutesExist && allComponentsExist && allEnvVarsExist) {
  console.log('✅ All checks passed!');
  console.log('The Myntra email processing system appears to be correctly set up.');
  console.log('\nTo test the full flow:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Go to the Settings page');
  console.log('3. Connect your Gmail account');
  console.log('4. Use the "Process Myntra Emails" button to fetch and process emails');
} else {
  console.log('❌ Some checks failed. Please address the issues mentioned above.');
}

console.log('\n🏁 Verification complete!'); 