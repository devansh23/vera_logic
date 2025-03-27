import { testMistralApiConnection, extractProductInfoFromText } from './mistral-service';

/**
 * Simple test script for Mistral AI service connection
 */
async function testMistralService() {
  console.log('🔍 Testing Mistral AI Service');
  console.log('============================\n');
  
  // Test API connection
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
  
  // Sample product information to extract
  const sampleText = `
INVOICE
Store: Tech Gadgets Inc.
Invoice #: INV-12345
Date: 2023-05-15

Items:
1. MacBook Pro 14" M3 Pro
   SKU: MBP-14-M3P
   Quantity: 1
   Price: $1,999.00
   
2. Apple Magic Mouse
   SKU: MM-BLK
   Quantity: 2
   Price: $79.00 each
  `;
  
  // Test text extraction
  console.log('2. Testing product information extraction from text...');
  try {
    const productInfo = await extractProductInfoFromText(sampleText);
    console.log('✅ Successfully extracted product information:');
    console.log(JSON.stringify(productInfo, null, 2));
  } catch (error) {
    console.error('❌ Text extraction error:', error instanceof Error ? error.message : String(error));
  }
  
  console.log('\n🏁 Mistral AI simple test completed');
}

// Run the tests
testMistralService().catch(error => {
  console.error('❌ Test execution failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}); 