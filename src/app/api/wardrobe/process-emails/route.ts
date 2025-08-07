import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { EmailRetrievalService } from '@/lib/email-retrieval';
import { UnifiedProductExtractor, ExtractionStrategy } from '@/lib/unified-product-extractor';
import { CustomParsers } from '@/lib/custom-parsers';
import { AIService } from '@/lib/ai-service';
import { FallbackParser } from '@/lib/fallback-parser';
import { ProductProcessor } from '@/lib/product-processor';

export interface ProcessEmailsRequest {
  emails?: string[];
  retailer?: string;
  strategy?: ExtractionStrategy;
  addToWardrobe?: boolean;
  maxEmails?: number;
  onlyUnread?: boolean;
  daysBack?: number;
}

export interface ProcessEmailsResponse {
  success: boolean;
  message: string;
  processedEmails: number;
  totalProducts: number;
  products: any[];
  errors: string[];
  processingTime: number;
  duplicatesSkipped?: number;
  duplicateItems?: any[];
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: ProcessEmailsRequest = await request.json();
    const {
      emails = [],
      retailer,
      strategy = 'auto',
      addToWardrobe = false,
      maxEmails = 100,
      onlyUnread = false,
      daysBack = 1500
    } = body;

    log('Processing emails request', {
      userId: session.user.id,
      emailCount: emails.length,
      retailer,
      strategy,
      addToWardrobe,
      maxEmails,
      onlyUnread,
      daysBack
    });

    // Initialize services
    const emailService = new EmailRetrievalService();
    const extractor = new UnifiedProductExtractor(
      new AIService(),
      new CustomParsers(),
      new FallbackParser()
    );
    const processor = new ProductProcessor();

    const results: ProcessEmailsResponse = {
      success: false,
      message: '',
      processedEmails: 0,
      totalProducts: 0,
      products: [],
      errors: [],
      processingTime: 0
    };

    let emailMessages: any[] = [];

    // Step 1: Fetch emails
    if (emails.length > 0) {
      // Process specific emails
      log('Fetching specific emails', { emailIds: emails });
      
      for (const emailId of emails) {
        try {
          const email = await emailService.getEmailById(session.user.id, emailId);
          if (email) {
            emailMessages.push(email);
          } else {
            results.errors.push(`Email ${emailId} not found`);
          }
        } catch (error) {
          results.errors.push(`Failed to fetch email ${emailId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } else if (retailer) {
      // Fetch emails for retailer
      log('Fetching emails for retailer', { retailer, maxEmails });
      
      try {
        emailMessages = await emailService.fetchEmailsForRetailer(
          session.user.id,
          retailer,
          { maxResults: maxEmails, onlyUnread, daysBack }
        );
      } catch (error) {
        results.errors.push(`Failed to fetch emails for ${retailer}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      return NextResponse.json(
        { error: 'Either emails array or retailer must be provided' },
        { status: 400 }
      );
    }

    log('Emails fetched', { count: emailMessages.length });

    // Step 2: Extract products from emails
    for (const email of emailMessages) {
      try {
        const extractedProducts = await extractor.extractProductsFromEmail(
          email,
          retailer || 'unknown',
          strategy
        );

        if (extractedProducts.length > 0) {
          // Step 3: Process products
          const processedProducts = await processor.processExtractedProducts(
            extractedProducts,
            email.id,
            retailer || 'unknown'
          );

          results.products.push(...processedProducts);
          results.totalProducts += processedProducts.length;
        }

        results.processedEmails++;
      } catch (error) {
        results.errors.push(`Failed to process email ${email.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Step 4: Add to wardrobe if requested
    if (addToWardrobe && results.products.length > 0) {
      try {
        // Use the improved wardrobe integration with proper deduplication
        const { addItemsToWardrobe } = await import('@/lib/wardrobe-integration');
        
        const wardrobeResult = await addItemsToWardrobe(
          session.user.id,
          results.products
        );

        log('Products added to wardrobe', { 
          totalItems: wardrobeResult.totalItems,
          addedItems: wardrobeResult.addedItems,
          duplicatesSkipped: wardrobeResult.duplicatesSkipped
        });

        // Add deduplication info to response
        results.duplicatesSkipped = wardrobeResult.duplicatesSkipped;
        results.duplicateItems = wardrobeResult.duplicateItems;
      } catch (error) {
        results.errors.push(`Failed to add products to wardrobe: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Set response
    results.success = results.totalProducts > 0;
    results.message = results.success 
      ? `Successfully processed ${results.processedEmails} emails and found ${results.totalProducts} products`
      : 'No products found in the processed emails';
    results.processingTime = Date.now() - startTime;

    log('Email processing completed', {
      userId: session.user.id,
      processedEmails: results.processedEmails,
      totalProducts: results.totalProducts,
      processingTime: results.processingTime,
      errorCount: results.errors.length
    });

    return NextResponse.json(results);

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    log('Email processing failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime
    });

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process emails',
        processedEmails: 0,
        totalProducts: 0,
        products: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        processingTime
      },
      { status: 500 }
    );
  }
} 