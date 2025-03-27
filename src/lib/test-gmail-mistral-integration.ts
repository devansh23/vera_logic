import { 
  initializeGmailClient, 
  listEmails,
  getEmailById, 
  getAttachment, 
  markEmailAsRead 
} from './gmail-service';
import { 
  extractProductInfoFromPdf, 
  analyzeReceiptPdf, 
  ExtractedProductInfo 
} from './mistral-service';
import { log } from './logger';

/**
 * Integration test for Gmail and Mistral AI services
 */
async function processEmailAttachments() {
  console.log('📧 Testing Gmail + Mistral AI Integration');
  console.log('======================================\n');
  
  // Step 1: Initialize Gmail client
  console.log('1. Initializing Gmail client...');
  try {
    // Note: In a real implementation, you'd use the authenticated client
    // This is a simulation for testing purposes
    console.log('✅ Gmail client initialized (simulated)');
  } catch (error) {
    console.error('❌ Gmail client initialization error:', 
      error instanceof Error ? error.message : String(error));
    return;
  }
  
  console.log('\n');
  
  // Step 2: Simulate fetching emails with PDF attachments
  console.log('2. Fetching emails with PDF attachments...');
  // In a real implementation, you'd query for emails with pdf attachments
  // Something like: await listMessages(gmailClient, 'has:attachment filename:pdf');
  
  // Create a simulated email with PDF attachment for testing
  const mockEmails = [
    {
      id: 'email123',
      threadId: 'thread123',
      labelIds: ['INBOX'],
      snippet: 'Your invoice from Tech Gadgets Inc.',
      payload: {
        headers: [
          { name: 'From', value: 'billing@techgadgets.com' },
          { name: 'Subject', value: 'Your invoice INV-12345' },
          { name: 'Date', value: 'Mon, 15 May 2023 14:30:00 +0000' }
        ],
        parts: [
          {
            mimeType: 'text/plain',
            body: { data: Buffer.from('Please find attached your invoice.').toString('base64') }
          },
          {
            mimeType: 'application/pdf',
            filename: 'invoice.pdf',
            body: { attachmentId: 'attachment123' }
          }
        ]
      }
    }
  ];
  
  console.log(`✅ Found ${mockEmails.length} email(s) with PDF attachments`);
  
  // Mock invoice PDF content
  const invoicePdfContent = `
INVOICE
Store: Tech Gadgets Inc.
Invoice #: INV-12345
Date: 2023-05-15

Bill To:
Jane Doe
456 Oak Avenue
San Francisco, CA 94105

Items:
1. iPhone 14 Pro Max
   SKU: IP14PM-256-BLK
   Color: Black
   Storage: 256GB
   Quantity: 1
   Price: $1,099.00
   
2. AppleCare+ for iPhone
   SKU: AC-IP-2YR
   Duration: 2 Years
   Quantity: 1
   Price: $199.00

3. iPhone 14 Pro Case
   Brand: Apple
   SKU: IP14PC-BLK
   Color: Black
   Quantity: 1
   Price: $49.00

Subtotal: $1,347.00
Tax (8.5%): $114.50
Total: $1,461.50

Payment Method: Credit Card (VISA ****5678)
  `;
  
  // Process each email
  console.log('\n3. Processing emails and analyzing attachments...');
  const processedOrders: Array<{
    emailId: string;
    receiptInfo: {
      retailer: string;
      orderNumber: string;
      orderDate: Date | null;
      totalAmount: number | null;
      currency: string | null;
    };
    products: ExtractedProductInfo[];
  }> = [];
  
  for (const email of mockEmails) {
    console.log(`\nProcessing email: ${email.payload.headers.find(h => h.name === 'Subject')?.value}`);
    
    // Find PDF attachments
    const pdfAttachments = email.payload.parts.filter(part => 
      part.mimeType === 'application/pdf' && part.filename && part.body?.attachmentId
    );
    
    console.log(`Found ${pdfAttachments.length} PDF attachment(s)`);
    
    for (const attachment of pdfAttachments) {
      console.log(`Processing attachment: ${attachment.filename}`);
      
      // In a real implementation, you'd fetch the attachment data:
      // const attachmentData = await getAttachment(gmailClient, email.id, attachment.body.attachmentId);
      
      // Simulate PDF processing with our mock data
      try {
        // Analyze the receipt/invoice
        const receiptInfo = await analyzeReceiptPdf(Buffer.from(invoicePdfContent));
        
        console.log('✅ Successfully analyzed receipt/invoice:');
        console.log(`   Retailer: ${receiptInfo.retailer}`);
        console.log(`   Order #: ${receiptInfo.orderNumber}`);
        console.log(`   Date: ${receiptInfo.orderDate?.toDateString() || 'Unknown'}`);
        console.log(`   Amount: ${receiptInfo.totalAmount} ${receiptInfo.currency || ''}`);
        console.log(`   Products: ${receiptInfo.products.length}`);
        
        // Extract detailed product information
        console.log('\nExtracting product details...');
        const products = await extractProductInfoFromPdf(Buffer.from(invoicePdfContent));
        
        console.log(`✅ Extracted ${products.length} products:`);
        for (const product of products) {
          console.log(`   - ${product.productName} (${product.quantity || 1}x) - ${product.price} ${product.currency || ''}`);
        }
        
        // In a real implementation, you'd save this data to your database
        // and mark the email as processed
        processedOrders.push({
          emailId: email.id,
          receiptInfo: {
            retailer: receiptInfo.retailer,
            orderNumber: receiptInfo.orderNumber,
            orderDate: receiptInfo.orderDate,
            totalAmount: receiptInfo.totalAmount,
            currency: receiptInfo.currency
          },
          products
        });
        
        // Mark email as read (simulated in this test)
        console.log('\n✅ Processing complete. Email would be marked as read.');
        // In real implementation: await markMessageAsRead(gmailClient, email.id);
      } catch (error) {
        console.error('❌ Error processing attachment:', 
          error instanceof Error ? error.message : String(error));
      }
    }
  }
  
  console.log('\n');
  console.log('4. Processing summary:');
  console.log(`   Total emails processed: ${mockEmails.length}`);
  console.log(`   Orders extracted: ${processedOrders.length}`);
  console.log(`   Total products found: ${processedOrders.reduce((sum, order) => sum + order.products.length, 0)}`);
  
  console.log('\n🏁 Gmail + Mistral AI integration test completed');
}

// Run the integration test
processEmailAttachments().catch(error => {
  console.error('❌ Integration test failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}); 