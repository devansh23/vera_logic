import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  if (!url.includes('myntra.com')) {
    return NextResponse.json({ error: 'Invalid Myntra URL' }, { status: 400 });
  }

  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });

    console.log('Creating new page...');
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Enable JavaScript console logging
    page.on('console', msg => console.log('Browser console:', msg.text()));

    console.log('Navigating to URL:', url);
    await page.goto(url, { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000 
    });

    // Wait for product data to be available
    await page.waitForSelector('script#pdpData, .pdp-name', { timeout: 5000 });

    console.log('Extracting product data...');
    const productData = await page.evaluate(() => {
      // First try the pdpData script
      const script = document.querySelector('script#pdpData');
      if (script?.textContent) {
        try {
          const jsonStr = script.textContent.match(/\{.*\}/s)?.[0];
          if (jsonStr) {
            const data = JSON.parse(jsonStr);
            return {
              brand: data.brand?.name || '',
              name: data.name || '',
              price: data.price?.discounted || '',
              originalPrice: data.price?.mrp || '',
              discount: data.price?.discount ? `${data.price.discount}%` : '',
              sizes: data.sizes?.map((s: any) => s.label) || [],
              colors: data.colors || [],
              images: data.media?.albums?.[0]?.images?.map((img: any) => img.src) || [],
              description: data.productDescriptors?.description?.value || ''
            };
          }
        } catch (error) {
          console.error('Error parsing pdpData:', error);
        }
      }

      // Fallback to scraping the DOM directly
      console.log('Falling back to DOM scraping...');
      const productName = document.querySelector('.pdp-name')?.textContent;
      const brandName = document.querySelector('.pdp-title .brand-name')?.textContent;
      const price = document.querySelector('.pdp-price strong')?.textContent;
      
      // Get the main product image - try multiple selectors
      let imageUrl = '';
      const imageSelectors = [
        '.image-grid-imageContainer img',
        '.image-grid-image',
        '.image-grid-container img',
        '.pdp-image img',
        'picture.pdp-image source',
        '.common-image img'
      ];

      for (const selector of imageSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          // Try different attribute names for the image URL
          imageUrl = element.getAttribute('src') || 
                    element.getAttribute('data-src') || 
                    element.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0] || 
                    '';
          if (imageUrl) break;
        }
      }

      // If still no image found, try to get it from any meta tags
      if (!imageUrl) {
        const metaImage = document.querySelector('meta[property="og:image"]');
        if (metaImage) {
          imageUrl = metaImage.getAttribute('content') || '';
        }
      }
      
      if (productName || brandName || price) {
        return {
          brand: brandName || '',
          name: productName || '',
          price: price || '',
          originalPrice: document.querySelector('.pdp-mrp')?.textContent || '',
          discount: document.querySelector('.pdp-discount')?.textContent || '',
          sizes: Array.from(document.querySelectorAll('.size-buttons-size-button')).map(el => el.textContent || ''),
          description: document.querySelector('.pdp-product-description-content')?.textContent || '',
          image: imageUrl
        };
      }
      
      return null;
    });

    await browser.close();
    console.log('Browser closed');

    if (!productData) {
      console.error('Failed to extract product data');
      return NextResponse.json({ 
        error: 'Failed to extract product data',
        message: 'Could not find product information on the page'
      }, { status: 500 });
    }

    console.log('Successfully extracted product data:', productData);
    return NextResponse.json(productData);
  } catch (error) {
    console.error('Error fetching product:', error);
    if (browser) {
      await browser.close();
      console.log('Browser closed after error');
    }
    return NextResponse.json({ 
      error: 'Failed to fetch product details',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 