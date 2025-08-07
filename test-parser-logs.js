const fetch = require('node-fetch');

async function testParserLogs() {
  try {
    console.log('🧪 Testing Email Parser Logs...\n');
    
    // Test the email processing API endpoint
    console.log('📧 Testing email processing API...');
    
    const testResponse = await fetch('http://localhost:3000/api/wardrobe/process-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        retailer: 'myntra',
        maxEmails: 5,
        onlyUnread: true,
        daysBack: 7,
        addToWardrobe: false // Just test extraction, don't add to wardrobe
      })
    });
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.log(`❌ API Error: ${testResponse.status} - ${errorText}`);
      return;
    }
    
    const result = await testResponse.json();
    
    console.log('✅ API Response:');
    console.log(`- Success: ${result.success}`);
    console.log(`- Message: ${result.message}`);
    console.log(`- Processed Emails: ${result.processedEmails}`);
    console.log(`- Total Products: ${result.totalProducts}`);
    console.log(`- Processing Time: ${result.processingTime}ms`);
    
    if (result.errors && result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    if (result.products && result.products.length > 0) {
      console.log('\n📦 Extracted Products:');
      result.products.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.brand || 'Unknown'} - ${product.name}`);
        console.log(`     Size: ${product.size || 'N/A'}, Price: ${product.price || 'N/A'}`);
        console.log(`     Retailer: ${product.retailer}, Email ID: ${product.emailId}`);
      });
    }
    
    console.log('\n🎉 Email processing test completed!');
    console.log('\n💡 Check the terminal/console logs for detailed parsing information.');
    console.log('   Look for logs like:');
    console.log('   - "Starting product extraction"');
    console.log('   - "Custom parser found X products"');
    console.log('   - "AI parser found X products"');
    console.log('   - "Generic parser found X products"');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

testParserLogs(); 