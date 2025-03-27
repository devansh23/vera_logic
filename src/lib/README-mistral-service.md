# Mistral AI Service

This module provides functionality to extract product information from PDF documents using the Mistral AI API.

## Features

- **PDF Text Extraction**: Extract text content from PDF documents
- **Structured Data Extraction**: Use Mistral AI to extract structured product information from text
- **Receipt/Invoice Analysis**: Extract order information from receipts and invoices
- **Error Handling**: Robust error handling for API connection and PDF parsing issues

## API

### Main Functions

- `extractProductInfoFromPdf(pdfBuffer: Buffer)`: Processes a PDF document and extracts product information
- `analyzeReceiptPdf(pdfBuffer: Buffer)`: Analyzes a receipt/invoice PDF to extract order details
- `extractProductInfoFromText(text: string)`: Extracts product information from text using Mistral AI
- `testMistralApiConnection()`: Tests connectivity to the Mistral AI API

### Helper Functions

- `extractTextFromPdf(pdfBuffer: Buffer)`: Extracts text content from a PDF document
- `savePdfToTempFile(pdfBuffer: Buffer)`: Saves a PDF to a temporary file
- `cleanupTempFile(filePath: string)`: Cleans up temporary files
- `getMistralClient()`: Gets/initializes the Mistral client singleton

## Testing

The service includes several test files:

- `test-mistral-api.ts`: Simple test for Mistral API connectivity
- `test-mistral-service.ts`: Tests for the Mistral service functionality
- `test-gmail-mistral-integration.ts`: Integration test showing how to use with Gmail service

## Configuration

The service requires the following environment variables:

- `MISTRAL_API_KEY`: Your Mistral API key

## Dependencies

- `@mistralai/mistralai`: Official Mistral AI client
- `pdfjs-dist`: PDF.js for PDF parsing
- `dotenv`: For loading environment variables

## Usage Example

```typescript
import { extractProductInfoFromPdf } from './mistral-service';

// Process a PDF attachment
async function processPdf(pdfBuffer: Buffer) {
  try {
    const products = await extractProductInfoFromPdf(pdfBuffer);
    console.log(`Extracted ${products.length} products:`);
    
    for (const product of products) {
      console.log(`- ${product.productName} (${product.quantity || 1}x) - ${product.price} ${product.currency || ''}`);
    }
  } catch (error) {
    console.error('Error processing PDF:', error);
  }
}
```

## Potential Improvements

- Add support for image-based PDFs using OCR
- Expand product categorization capabilities
- Implement caching for better performance
- Add support for batch processing of multiple PDFs 