import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const getMetaContent = (name: string) => {
      const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      return meta?.getAttribute('content') || '';
    };

    const title = document.title || getMetaContent('og:title');
    const description = getMetaContent('description') || getMetaContent('og:description');
    const image = getMetaContent('og:image');

    return NextResponse.json({
      title,
      description,
      image,
      url
    });
  } catch (error) {
    console.error('Error fetching link preview:', error);
    return NextResponse.json({ error: 'Failed to fetch link preview' }, { status: 500 });
  }
} 