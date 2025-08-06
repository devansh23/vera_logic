# Unified Email Product Extraction Architecture

This document describes the new unified architecture that replaces the redundant email processing system.

## Architecture Overview

The unified architecture consists of 7 main layers that work together to provide robust email product extraction.

## Key Benefits

1. **Eliminates Redundancy** - Single extraction pipeline instead of 3+ overlapping systems
2. **Performance Optimized** - Fast custom parsers with AI fallback only when needed
3. **Robust Error Handling** - Multiple fallback strategies ensure high success rates
4. **Easy Maintenance** - Clear separation of concerns and modular design
5. **Consistent Results** - Unified data models throughout the system

## File Structure

```
src/lib/
├── unified-product-extractor.ts    # Main orchestration layer
├── custom-parsers.ts               # Retailer-specific parsers
├── ai-service.ts                   # AI-powered extraction
├── fallback-parser.ts              # Generic HTML parsing
├── product-processor.ts            # Product processing & enhancement
├── email-retrieval.ts              # Gmail API interactions
└── test-unified-architecture.ts    # Test suite

src/app/api/wardrobe/
└── process-emails/
    └── route.ts                    # Unified API endpoint
```

## Usage

### API Endpoint
```typescript
POST /api/wardrobe/process-emails
{
  "emails": ["emailId1", "emailId2"],
  "retailer": "myntra",
  "strategy": "auto",
  "addToWardrobe": false
}
```

### Direct Usage
```typescript
const extractor = new UnifiedProductExtractor(
  new AIService(),
  new CustomParsers(),
  new FallbackParser()
);

const products = await extractor.extractProductsFromEmail(
  email,
  'myntra',
  'auto'
);
```

## Extraction Strategies

1. **Custom** - Uses retailer-specific parsers (fastest, most accurate)
2. **AI** - Uses Mistral AI for intelligent extraction
3. **Generic** - Uses fallback HTML parsing
4. **Auto** - Automatically chooses the best strategy

## Adding New Retailers

1. Create a custom parser extending BaseParser
2. Add to CustomParsers registry
3. Add search query to EmailRetrievalService

The system is designed to be easily extensible and maintainable. 