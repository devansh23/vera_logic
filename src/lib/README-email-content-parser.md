# Email Content Parser

The `email-content-parser.ts` utility provides robust HTML parsing capabilities for extracting structured information from email content. This module complements the existing email processing functionality by using DOM-based parsing rather than relying solely on regex patterns.

## Features

- **DOM-based Parsing:** Uses JSDOM to parse HTML content for more reliable extraction
- **Table Extraction:** Parses tables in emails to extract structured data
- **Product Information Extraction:** Specialized functions for detecting and extracting product details
- **Link and Image Extraction:** Extracts links and images from emails with context
- **Retailer Detection:** Identifies the retailer based on email content
- **Multiple HTML Structures:** Handles different HTML structures and layouts found in emails

## Key Functions

### Basic Parsing

- `parseHtml(html: string)`: Parses HTML content into a DOM for further processing
- `cleanText(text: string)`: Removes excess whitespace and normalizes text
- `extractTables(html: string)`: Extracts all tables from HTML content with headers and data
- `extractLinks(html: string)`: Extracts all links with their text, URL, and context
- `extractImages(html: string)`: Extracts all images with their attributes, skipping spacer/tracking images

### Product Extraction

- `extractProductsFromTables(html: string)`: Extracts products from HTML tables
- `extractProductsFromHtml(html: string)`: Extracts products from various HTML structures
- `extractMyntraProductsFromHtml(email: EmailMessage)`: Specialized function for Myntra product extraction

### Order Information

- `extractOrderInfoFromHtml(html: string)`: Extracts order information like order ID, date, and amount
- `parseMyntraEmail(email: EmailMessage)`: Parses a Myntra email for complete order information
- `extractInfoFromEmailHtml(email: EmailMessage)`: All-in-one function to extract all information from an email

## Usage Examples

### Basic Extraction

```typescript
import * as EmailContentParser from './email-content-parser';
import { EmailMessage } from './gmail-service';

// Parse an email
const emailHtml = email.body?.html || '';
const doc = EmailContentParser.parseHtml(emailHtml);

// Extract tables
const tables = EmailContentParser.extractTables(emailHtml);
console.log(`Found ${tables.length} tables`);

// Extract links
const links = EmailContentParser.extractLinks(emailHtml);
console.log(`Found ${links.length} links`);
```

### Product Extraction

```typescript
// Extract products from an email
const products = EmailContentParser.extractProductsFromHtml(emailHtml);
console.log(`Found ${products.length} products`);

// For Myntra emails specifically
const myntraProducts = EmailContentParser.extractMyntraProductsFromHtml(email);
```

### Complete Parsing

```typescript
// Parse a Myntra email
const parsedEmail = EmailContentParser.parseMyntraEmail(email);
if (parsedEmail) {
  console.log(`Order ID: ${parsedEmail.orderId}`);
  console.log(`Products: ${parsedEmail.products.length}`);
}

// Extract all information from any email
const allInfo = EmailContentParser.extractInfoFromEmailHtml(email);
console.log(`Detected retailer: ${allInfo.retailer}`);
console.log(`Products: ${allInfo.products.length}`);
```

## Integration with Email Processor

The HTML parser can enhance the existing email processor in several ways:

1. **Enhanced Information Extraction:** Extract more details from structured HTML that may be difficult with regex
2. **Fallback Mechanism:** Use as a fallback when regex-based extraction fails
3. **Retailer Detection:** Better identify the source of emails

Example integration:

```typescript
import * as EmailProcessor from './email-processor';
import * as EmailContentParser from './email-content-parser';

// Process email with existing processor
const orderInfo = EmailProcessor.processMyntraEmail(email);

// Enhance with HTML parsing data if needed
if (orderInfo) {
  // Add more product details
  const htmlProducts = EmailContentParser.extractMyntraProductsFromHtml(email);
  // Merge information
  // ...
  
  // Add tracking URL if missing
  if (!orderInfo.trackingUrl) {
    const links = EmailContentParser.extractLinks(email.body?.html || '');
    // Find tracking link
    // ...
  }
}
```

## Test Files

- `test-email-content-parser.ts`: Tests individual functions of the parser
- `test-email-parser-integration.ts`: Demonstrates integration with the existing email processor

## Extension

The HTML parser is designed to be extended for different retailers. To add support for a new retailer:

1. Add retailer detection to `extractInfoFromEmailHtml`
2. Create specialized functions for the retailer's email format
3. Update integration with the email processor

## Dependencies

- `jsdom`: For HTML parsing and DOM manipulation
- Internal types and utilities from the project 