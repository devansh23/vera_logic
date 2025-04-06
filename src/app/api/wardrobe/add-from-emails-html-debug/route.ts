import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { getEmailById } from '@/lib/gmail-service';
import { Mistral } from '@mistralai/mistralai';
import { createHMPrompt, createMyntraPrompt } from '@/lib/email-extraction-prompts';
import { ExtractedItem } from '@/types/email-extraction';
import { extractZaraProductsFromHtml } from '@/lib/email-content-parser';

/**
 * Debug version of the add-from-emails-html endpoint that doesn't automatically process images
 * This allows the debug UI to control when cropping happens
 */
export async function POST(req: NextRequest) {
  try {
    // Check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { emailId, retailer } = body;

    if (!emailId) {
      return NextResponse.json({ error: 'Email ID is required' }, { status: 400 });
    }

    if (!retailer) {
      return NextResponse.json({ error: 'Retailer is required' }, { status: 400 });
    }

    // Validate retailer
    const normalizedRetailer = retailer.trim().toLowerCase();
    if (!['h&m', 'myntra', 'zara'].includes(normalizedRetailer)) {
      return NextResponse.json(
        { error: 'Invalid retailer. Supported retailers: H&M, Myntra, Zara' },
        { status: 400 }
      );
    }

    // Fetch the email HTML content
    log('Fetching email content via Gmail API (debug mode)', { emailId, retailer });
    const email = await getEmailById(session.user.id, emailId);
    
    if (!email) {
      return NextResponse.json({ error: 'Failed to fetch email content' }, { status: 500 });
    }
    
    if (!email.body?.html) {
      return NextResponse.json({ error: 'No HTML content found in email' }, { status: 400 });
    }

    // Process the HTML content to extract items WITHOUT processing images
    log('Processing HTML content with AI (debug mode)', { emailId });
    
    try {
      const items = await extractItemsFromHtml(
        email.body.html, 
        normalizedRetailer
      );
      
      if (items.length > 0) {
        log('Items extracted in debug mode', { count: items.length, emailId });
        
        return NextResponse.json({
          success: true,
          message: `${items.length} items found in email`,
          totalItemsFound: items.length,
          items: items
        });
      } else {
        return NextResponse.json({
          success: false,
          message: '0 items detected in the email',
          totalItemsFound: 0,
          items: []
        });
      }
    } catch (error) {
      log('Error processing HTML content in debug mode', { error, emailId });
      return NextResponse.json({
        error: 'Failed to process email HTML content',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }
  } catch (error) {
    log('Error in add-from-emails-html-debug API', { error });
    return NextResponse.json({
      error: 'Failed to extract items from email HTML in debug mode',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

/**
 * Extracts items from HTML content - copied from original endpoint but without image processing
 */
async function extractItemsFromHtml(
  htmlContent: string, 
  retailer: string
): Promise<ExtractedItem[]> {
  log('Extracting items from HTML content (debug mode)', { contentLength: htmlContent.length, retailer });
  
  try {
    // Use specialized Zara parser for Zara emails
    if (retailer.toLowerCase() === 'zara') {
      log('Using specialized Zara parser (debug mode)');
      const extractedProducts = extractZaraProductsFromHtml(htmlContent);
      
      return extractedProducts.map(product => ({
        brand: 'Zara',
        name: product.name,
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        discount: product.discount || '',
        size: product.size || '',
        color: product.color || '',
        image: product.images?.[0] || '',
        productLink: product.productLink || '',
        myntraLink: '',
        sourceRetailer: retailer,
        reference: product.reference
      }));
    }

    // For other retailers, use Mistral AI
    // Extract text content from HTML
    const textContent = extractTextFromHtml(htmlContent);
    log('Extracted text content (debug mode)', { textLength: textContent.length });
    
    // Initialize Mistral client
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error('Mistral API key not found');
    }
    
    const client = new Mistral({ apiKey });
    
    // Create retailer-specific prompt
    const isHM = retailer.toLowerCase().includes('h&m');
    const prompt = isHM 
      ? createHMPrompt()
      : createMyntraPrompt();
    
    // Process with AI
    log('Sending content to Mistral AI (debug mode)');
    
    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "text",
              text: textContent
            }
          ]
        }
      ],
      temperature: 0.1,
      maxTokens: 2000
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('No content received from AI');
    }

    const content = response.choices[0].message.content;
    if (typeof content !== 'string') {
      throw new Error('Unexpected content format received from AI');
    }

    // Clean up the response to ensure valid JSON
    let jsonStr = content;
    
    // Remove any markdown code block markers
    jsonStr = jsonStr.replace(/```json\n?|\n?```/g, '').trim();
    
    // Log the raw AI response for debugging
    log('Raw AI response (debug mode)', { responsePreview: jsonStr.substring(0, 500) + '...' });
    
    // Attempt to find a valid JSON array in the response
    const matches = jsonStr.match(/\[[\s\S]*\]/);
    if (!matches) {
      log('Failed to find JSON array in response (debug mode)', { response: jsonStr });
      throw new Error('No valid JSON array found in response');
    }
    
    let extractedItems;
    try {
      extractedItems = JSON.parse(matches[0]);
    } catch (parseError) {
      log('JSON Parse Error (debug mode)', { parseError, jsonStr });
      throw new Error('Failed to parse JSON response from AI');
    }

    if (!Array.isArray(extractedItems)) {
      throw new Error('Parsed result is not an array');
    }

    // Map the extracted items and decode HTML entities in URLs but don't process images
    return extractedItems.map((item: any) => {
      // Decode HTML entities in imageUrl
      let imageUrl = item.imageUrl || '';
      if (imageUrl) {
        imageUrl = decodeHtmlEntities(imageUrl);
      }
      
      const mappedItem: ExtractedItem = {
        brand: isHM ? "H&M" : (item.brand || 'Unknown Brand'),
        name: item.name || 'Unknown Product',
        price: item.price || '',
        originalPrice: item.originalPrice || '',
        discount: item.discount || '',
        size: item.size || '',
        color: item.color || '',
        image: imageUrl, // Use decoded imageUrl without processing
        productLink: decodeHtmlEntities(item.productLink || ''),
        myntraLink: item.productLink && item.productLink.includes('myntra.com') 
          ? decodeHtmlEntities(item.productLink) 
          : '',
        sourceRetailer: retailer
      };

      return mappedItem;
    });
  } catch (error) {
    log('Error in HTML extraction (debug mode)', { error });
    throw error;
  }
}

/**
 * Decode HTML entities in a string
 */
function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x3D;/g, '=')
    .replace(/&#x3B;/g, ';');
}

/**
 * Extract readable text from HTML content while preserving image URLs
 */
function extractTextFromHtml(html: string): string {
  try {
    // First, let's extract all image URLs for reference
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    const images: string[] = [];
    let match;
    
    while ((match = imgRegex.exec(html)) !== null) {
      if (match[1]) {
        // Skip tiny images, spacers, and icons (often smaller than 100 characters in URL)
        if (match[1].length > 100 || match[1].includes('product') || 
            match[1].includes('myntra') || match[1].includes('hm.com')) {
          // Decode HTML entities in image URLs
          const decodedUrl = decodeHtmlEntities(match[1]);
          images.push(`IMAGE_URL: ${decodedUrl}`);
        }
      }
    }
    
    // Also extract background images
    const bgRegex = /background-image\s*:\s*url\s*\(\s*['"]?([^'")]+)/g;
    while ((match = bgRegex.exec(html)) !== null) {
      if (match[1] && (match[1].length > 100 || match[1].includes('product') || 
                      match[1].includes('myntra') || match[1].includes('hm.com'))) {
        // Decode HTML entities in background image URLs
        const decodedUrl = decodeHtmlEntities(match[1]);
        images.push(`BACKGROUND_IMAGE_URL: ${decodedUrl}`);
      }
    }
    
    // Remove HTML tags but preserve the content
    let textContent = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
    textContent = textContent.replace(/<[^>]+>/g, ' ');
    
    // Fix spacing issues
    textContent = textContent.replace(/\s+/g, ' ');
    
    // Decode HTML entities
    textContent = decodeHtmlEntities(textContent);
    
    // Append the extracted image URLs to the text content
    if (images.length > 0) {
      textContent += '\n\nIMAGES:\n' + images.join('\n');
    }
    
    return textContent;
  } catch (error) {
    log('Error extracting text from HTML (debug mode)', { error });
    // Return a portion of the HTML if text extraction fails
    return html.substring(0, 10000);
  }
} 