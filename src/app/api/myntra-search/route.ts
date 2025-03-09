import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  let browser;
  try {
    console.log('Launching browser for search...');
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

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to Myntra search page
    const searchUrl = `https://www.myntra.com/${encodeURIComponent(query)}`;
    console.log('Navigating to search URL:', searchUrl);
    await page.goto(searchUrl, { waitUntil: 'networkidle0' });

    // Wait for search results
    await page.waitForSelector('.product-base', { timeout: 5000 });

    // Extract product data from search results
    const products = await page.evaluate(() => {
      const items = document.querySelectorAll('.product-base');
      return Array.from(items).slice(0, 5).map(item => {
        const anchor = item.querySelector('a');
        const nameEl = item.querySelector('.product-brand');
        const productNameEl = item.querySelector('.product-product');
        const priceEl = item.querySelector('.product-discountedPrice');
        const strikeEl = item.querySelector('.product-strike');
        const discountEl = item.querySelector('.product-discountPercentage');
        const imgEl = item.querySelector('img');

        return {
          url: anchor ? anchor.getAttribute('href')?.startsWith('/')
            ? `https://www.myntra.com${anchor.getAttribute('href')}`
            : `https://www.myntra.com/${anchor.getAttribute('href')}` : '',
          brand: nameEl ? nameEl.textContent : '',
          name: productNameEl ? productNameEl.textContent : '',
          price: priceEl ? priceEl.textContent : '',
          originalPrice: strikeEl ? strikeEl.textContent : '',
          discount: discountEl ? discountEl.textContent : '',
          image: imgEl ? imgEl.getAttribute('src') : ''
        };
      });
    });

    await browser.close();
    console.log('Browser closed');

    if (!products.length) {
      return NextResponse.json({ 
        error: 'No products found',
        message: 'Could not find any products matching your search'
      }, { status: 404 });
    }

    console.log('Found products:', products.length);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    if (browser) {
      await browser.close();
      console.log('Browser closed after error');
    }
    return NextResponse.json({ 
      error: 'Failed to search products',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 