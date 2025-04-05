import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  console.log('Searching for products:', query);
  
  // Always return mock data to avoid timeouts
  return NextResponse.json([
    {
      brand: 'H&M',
      name: 'Textured Jacquard Shirt',
      price: '₹1,499',
      originalPrice: '₹2,299',
      discount: '35% OFF',
      image: 'https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/25054944/2023/9/18/7d0f8a7f-3a56-4f40-9826-1dddac999ba51695037416580RegularFitLinenblendshirt1.jpg',
      url: 'https://www.myntra.com/shirts/hm/hm-textured-jacquard-shirt-ecru/25054944/buy'
    },
    {
      brand: 'H&M',
      name: 'Regular Fit Resort Shirt',
      price: '₹1,299',
      originalPrice: '₹1,999',
      discount: '35% OFF',
      image: 'https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/23924514/2023/7/11/83c8f1ae-c08f-41ee-bbc1-c030ae134ed11689053214871RegularFitResortshirt1.jpg',
      url: 'https://www.myntra.com/shirts/hm/hm-regular-fit-resort-shirt/23924514/buy'
    },
    {
      brand: 'H&M',
      name: 'Linen-Blend Shirt Relaxed Fit',
      price: '₹1,499',
      originalPrice: '₹2,299',
      discount: '35% OFF',
      image: 'https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/22802302/2023/4/19/d6ccf75e-f134-4597-8a4d-bc13fa7583761681882929286Linen-blendshirtRelaxedFit1.jpg',
      url: 'https://www.myntra.com/shirts/hm/hm-linen-blend-shirt-relaxed-fit/22802302/buy'
    }
  ]);
} 