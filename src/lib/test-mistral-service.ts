import * as fs from 'fs';
import * as path from 'path';
import { 
  testMistralApiConnection,
  extractTextFromPdf,
  extractProductInfoFromText,
  analyzeReceiptPdf
} from './mistral-service';
import { log } from './logger';

/**
 * Test script for Mistral AI PDF processing
 */
async function runMistralTests() {
  console.log('🔍 Testing Mistral AI Service');
  console.log('============================\n');
  
  // Step 1: Test API connection
  console.log('1. Testing Mistral API connection...');
  try {
    const connectionTest = await testMistralApiConnection();
    if (connectionTest.success) {
      console.log('✅ Connection successful:', connectionTest.message);
    } else {
      console.error('❌ Connection failed:', connectionTest.message);
      return;
    }
  } catch (error) {
    console.error('❌ Connection test error:', error instanceof Error ? error.message : String(error));
    return;
  }
  
  console.log('\n');
  
  // Create a sample PDF with mock data for testing
  const sampleText = `
INVOICE
Store: Tech Gadgets Inc.
Invoice #: INV-12345
Date: 2023-05-15

Bill To:
John Smith
123 Main Street
San Francisco, CA 94105

Items:
1. MacBook Pro 14" M3 Pro
   SKU: MBP-14-M3P
   Quantity: 1
   Price: $1,999.00
   
2. Apple Magic Mouse
   SKU: MM-BLK
   Quantity: 2
   Price: $79.00 each
   
3. USB-C Hub Adapter
   Brand: Anker
   Color: Silver
   SKU: ANK-USBCHUB
   Quantity: 1
   Price: $45.99

Subtotal: $2,202.99
Tax (8.5%): $187.25
Total: $2,390.24

Payment Method: Credit Card (VISA ****1234)
  `;
  
  // Step 2: Test text extraction from mock data
  console.log('2. Testing product information extraction from text...');
  try {
    const productInfo = await extractProductInfoFromText(sampleText);
    console.log('✅ Successfully extracted product information:');
    console.log(JSON.stringify(productInfo, null, 2));
    
    if (productInfo.length === 0) {
      console.warn('⚠️ No products were extracted from the sample text');
    } else {
      console.log(`Found ${productInfo.length} products`);
    }
  } catch (error) {
    console.error('❌ Text extraction error:', error instanceof Error ? error.message : String(error));
  }
  
  console.log('\n');
  
  // Step 3: Test receipt analysis with mock data
  console.log('3. Testing receipt analysis...');
  try {
    const receiptInfo = await analyzeReceiptPdf(Buffer.from(sampleText));
    console.log('✅ Successfully analyzed receipt:');
    console.log(JSON.stringify({
      retailer: receiptInfo.retailer,
      orderNumber: receiptInfo.orderNumber,
      orderDate: receiptInfo.orderDate,
      totalAmount: receiptInfo.totalAmount,
      currency: receiptInfo.currency,
      productCount: receiptInfo.products.length
    }, null, 2));
  } catch (error) {
    console.error('❌ Receipt analysis error:', error instanceof Error ? error.message : String(error));
  }
  
  console.log('\n');
  
  // Step 4: Log test completion
  console.log('🏁 Mistral AI service tests completed');
}

// Run the tests
runMistralTests().catch(error => {
  console.error('❌ Test execution failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}); 