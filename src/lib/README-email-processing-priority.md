# Email Processing Priority System

This document explains the updated email processing system that prioritizes HTML parsing over regex-based extraction, with PDF processing as a fallback method.

## Processing Hierarchy

The email processor now follows a 3-tier approach to information extraction:

1. **HTML Parsing (Primary Method)**
   - Uses DOM-based parsing via JSDOM for reliable extraction from structured HTML
   - More robust than regex for complex HTML structures
   - Better at handling nested elements and tables

2. **Regex-based Extraction (Fallback #1)**
   - Used when HTML parsing fails or produces incomplete results
   - Still effective for simple formats and plain-text emails
   - Leverages specific patterns tailored for Myntra emails

3. **PDF Processing (Fallback #2)**
   - Last resort when both HTML and regex methods fail
   - Extracts information from PDF attachments if available
   - Uses Mistral AI for content analysis and information extraction

## Implementation Details

The main processing function `processMyntraEmail` has been updated to implement this hierarchy:

```typescript
export function processMyntraEmail(email: EmailMessage): MyntraOrderInfo | null {
  // Check if this is a Myntra email
  if (!isMyntraEmail(email)) {
    return null;
  }
  
  // STEP 1: Try using HTML parsing (primary method)
  try {
    const htmlParseResult = extractMyntraInfoFromHtml(email);
    if (htmlParseResult && htmlParseResult.orderId) {
      return htmlParseResult;
    }
  } catch (error) {
    // Log error and continue to fallback
  }
  
  // STEP 2: Fall back to regex-based extraction
  try {
    // ... regex extraction logic ...
  } catch (error) {
    // Log error and continue to last fallback
  }
  
  // STEP 3: If both HTML and regex failed, check for PDF attachments
  return extractMyntraInfoFromPdf(email);
}
```

## Advantages

### Improved Extraction Accuracy

The HTML parser provides more reliable extraction for structured emails, especially for:
- Complex product details
- Nested tables
- Rich formatting

### Enhanced Redundancy

Having three independent methods ensures maximum information extraction capability:
- Each method serves as a backup for the others
- Different parsing approaches handle different email formats
- Combined approach handles a wider variety of email structures

### Flexible Data Extraction

The system extracts different types of data depending on what's available:
- Order details (ID, date, amount)
- Product information (name, price, quantity, size, color)
- Shipping information
- Customer details

## Usage Examples

### Processing a Standard HTML Email

For a standard Myntra HTML email:

```typescript
import { processMyntraEmail } from './email-processor';

// Process the email
const orderInfo = processMyntraEmail(email);

// Order information is extracted via HTML parsing
console.log(`Order ID: ${orderInfo.orderId}`);
console.log(`Products: ${orderInfo.items.length}`);
```

### Handling an Email with Attachments

For an email with PDF attachments and minimal HTML/text:

```typescript
// Process an email with PDF attachments
const orderInfo = processMyntraEmail(emailWithPdf);

// Order information extracted from PDF
console.log(`Order ID: ${orderInfo.orderId}`);
console.log(`Products: ${orderInfo.items.length}`);
```

## Testing

The updated system has been thoroughly tested with different email formats:

1. Emails with well-structured HTML
2. Emails with poor/minimal HTML structure
3. Plain-text emails without HTML
4. Emails with PDF attachments

The test script `test-email-processor-html-priority.ts` verifies the correct processing hierarchy is followed for each case.

## Future Enhancements

Potential improvements to the system:

1. **Additional Retailer Support**: Extend parsing for other retailers beyond Myntra
2. **AI-Enhanced Extraction**: Integrate more advanced AI for ambiguous content
3. **Image Processing**: Add capability to extract information from image attachments
4. **Learning System**: Implement feedback loop to improve extraction accuracy over time 