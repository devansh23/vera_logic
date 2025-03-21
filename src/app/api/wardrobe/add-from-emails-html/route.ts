import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { log } from '@/lib/logger';
import { getEmailById } from '@/lib/gmail-service';
import { Mistral } from '@mistralai/mistralai';
import { createHMPrompt, createMyntraPrompt } from '@/lib/email-extraction-prompts';
import { addItemsToWardrobe } from '@/lib/wardrobe-integration';
import { ExtractedItem } from '@/lib/email-screenshot-extractor';

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
    if (!['h&m', 'myntra'].includes(normalizedRetailer)) {
      return NextResponse.json(
        { error: 'Invalid retailer. Supported retailers: H&M, Myntra' },
        { status: 400 }
      );
    }

    // Fetch the email HTML content
    log('Fetching email content via Gmail API', { emailId, retailer: normalizedRetailer });
    const email = await getEmailById(session.user.id, emailId);
    
    if (!email) {
      return NextResponse.json({ error: 'Failed to fetch email content' }, { status: 500 });
    }
    
    if (!email.body?.html) {
      return NextResponse.json({ error: 'No HTML content found in email' }, { status: 400 });
    }

    // Process the HTML content to extract items
    log('Processing HTML content with AI', { emailId });
    
    try {
      const items = await extractItemsFromHtml(
        email.body.html, 
        normalizedRetailer
      );
      
      // Add items to the user's wardrobe
      if (items.length > 0) {
        log('Adding items to wardrobe', { count: items.length, emailId });
        
        // Convert ExtractedItem to ExtractedWardrobeItem
        const wardrobeItems = items.map(item => ({
          brand: item.brand,
          name: item.name,
          price: item.price || '',
          originalPrice: item.originalPrice || '',
          discount: item.discount || '',
          size: item.size || '',
          color: item.color || '',
          imageUrl: item.image,
          productLink: item.productLink || '',
          emailId,
          retailer: normalizedRetailer
        }));
        
        const result = await addItemsToWardrobe(
          session.user.id,
          wardrobeItems
        );
        
        return NextResponse.json({
          success: true,
          message: `${result.addedItems} items added to wardrobe`,
          totalItemsFound: items.length,
          itemsAdded: result.addedItems,
          items: result.addedWardrobeItems
        });
      } else {
        return NextResponse.json({
          success: false,
          message: '0 items detected in the email',
          totalItemsFound: 0,
          itemsAdded: 0,
          items: []
        });
      }
    } catch (error) {
      log('Error processing HTML content', { error, emailId });
      return NextResponse.json({
        error: 'Failed to process email HTML content',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }
  } catch (error) {
    log('Error in add-from-emails-html API', { error });
    return NextResponse.json({
      error: 'Failed to extract items from email HTML',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

/**
 * Extract items directly from email HTML content using AI
 */
export async function extractItemsFromHtml(
  htmlContent: string, 
  retailer: string
): Promise<ExtractedItem[]> {
  log('Extracting items from HTML content', { contentLength: htmlContent.length, retailer });
  
  try {
    // Extract text content from HTML
    const textContent = extractTextFromHtml(htmlContent);
    log('Extracted text content', { textLength: textContent.length });
    
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
    log('Sending content to Mistral AI');
    
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
    log('Raw AI response', { responsePreview: jsonStr.substring(0, 500) + '...' });
    
    // Attempt to find a valid JSON array in the response
    const matches = jsonStr.match(/\[[\s\S]*\]/);
    if (!matches) {
      log('Failed to find JSON array in response', { response: jsonStr });
      throw new Error('No valid JSON array found in response');
    }
    
    let extractedItems;
    try {
      extractedItems = JSON.parse(matches[0]);
    } catch (parseError) {
      log('JSON Parse Error', { parseError, jsonStr });
      throw new Error('Failed to parse JSON response from AI');
    }

    if (!Array.isArray(extractedItems)) {
      throw new Error('Parsed result is not an array');
    }

    // Map the extracted items and decode HTML entities in URLs
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
        image: imageUrl, // Use decoded imageUrl
        productLink: decodeHtmlEntities(item.productLink || ''),
        myntraLink: item.productLink && item.productLink.includes('myntra.com') 
          ? decodeHtmlEntities(item.productLink) 
          : '',
        sourceRetailer: retailer
      };

      return mappedItem;
    });
  } catch (error) {
    log('Error in HTML extraction', { error });
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
    
    // Try to extract image URLs from anchor tags pointing to product images
    const aTagRegex = /<a[^>]+href=["']([^"']+\.(?:jpg|jpeg|png|gif|webp)[^"']*)["'][^>]*>/gi;
    while ((match = aTagRegex.exec(html)) !== null) {
      if (match[1] && (match[1].includes('product') || match[1].includes('myntra') || 
                       match[1].includes('hm.com'))) {
        // Decode HTML entities in linked image URLs
        const decodedUrl = decodeHtmlEntities(match[1]);
        images.push(`LINKED_IMAGE_URL: ${decodedUrl}`);
      }
    }
    
    // Convert HTML to text
    let text = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove style tags and their content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags and their content
      .replace(/<[^>]+>/g, '\n') // Replace tags with newlines
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace ampersands
      .replace(/&lt;/g, '<') // Replace less than
      .replace(/&gt;/g, '>') // Replace greater than
      .replace(/&quot;/g, '"') // Replace quotes
      .replace(/&#39;/g, "'") // Replace apostrophes
      .replace(/\n{2,}/g, '\n\n') // Replace multiple newlines with just two
      .trim();
    
    // Append extracted image URLs to the text
    if (images.length > 0) {
      text += '\n\n--- EXTRACTED IMAGE URLS ---\n';
      text += images.join('\n');
    }
    
    log('Extracted text from HTML', { 
      textLength: text.length, 
      imageCount: images.length 
    });
    
    return text;
  } catch (error) {
    log('Error extracting text from HTML', { error });
    return html; // Return the original HTML if extraction fails
  }
} 