import { UnifiedProductExtractor } from './unified-product-extractor';
import { CustomParsers } from './custom-parsers';
import { AIService } from './ai-service';
import { FallbackParser } from './fallback-parser';
import { GmailServiceTypes } from '@/types/gmail';

// Mock email for testing
const mockEmail: GmailServiceTypes.EmailMessage = {
  id: 'test-email-1',
  threadId: 'test-thread-1',
  labelIds: ['INBOX'],
  snippet: 'Test email snippet',
  historyId: '12345',
  internalDate: '1234567890',
  sizeEstimate: 1000,
  from: 'test@myntra.com',
  to: 'user@example.com',
  subject: 'Your Myntra order item has been shipped',
  date: new Date(),
  body: {
    html: `
      <div class="productListContainer">
        <div id="ItemProductName">Test Product Name</div>
        <div id="ItemProductBrandName">Test Brand</div>
        <div id="ItemSize">M</div>
        <div id="ItemQuantity">1</div>
        <img class="productImage" src="https://example.com/image.jpg" />
        <a href="https://myntra.com/product/123">View Product</a>
      </div>
    `,
    text: 'Test product: Test Product Name by Test Brand, Size: M, Quantity: 1'
  },
  attachments: []
};

export async function testUnifiedArchitecture() {
  console.log('🧪 Testing Unified Email Product Extraction Architecture...\n');

  try {
    // Initialize the unified extractor
    const extractor = new UnifiedProductExtractor(
      new AIService(),
      new CustomParsers(),
      new FallbackParser()
    );

    console.log('✅ Services initialized successfully');

    // Test custom parser strategy
    console.log('\n📧 Testing Custom Parser Strategy...');
    const customResults = await extractor.extractProductsFromEmail(
      mockEmail,
      'myntra',
      'custom'
    );
    console.log(`Found ${customResults.length} products with custom parser`);
    console.log('Products:', JSON.stringify(customResults, null, 2));

    // Test auto strategy
    console.log('\n🤖 Testing Auto Strategy...');
    const autoResults = await extractor.extractProductsFromEmail(
      mockEmail,
      'myntra',
      'auto'
    );
    console.log(`Found ${autoResults.length} products with auto strategy`);
    console.log('Products:', JSON.stringify(autoResults, null, 2));

    // Test with unknown retailer
    console.log('\n❓ Testing Unknown Retailer...');
    const unknownResults = await extractor.extractProductsFromEmail(
      mockEmail,
      'unknown',
      'auto'
    );
    console.log(`Found ${unknownResults.length} products with unknown retailer`);

    console.log('\n🎉 All tests completed successfully!');
    return {
      success: true,
      customResults,
      autoResults,
      unknownResults
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Export for use in other files
export { mockEmail }; 