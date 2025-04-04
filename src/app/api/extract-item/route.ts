import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Debug: Log environment variable status
const ROBOFLOW_API_KEY = process.env.NEXT_PUBLIC_ROBOFLOW_API_KEY;
console.log('ROBOFLOW_API_KEY status:', {
  isDefined: typeof ROBOFLOW_API_KEY !== 'undefined',
  isEmpty: ROBOFLOW_API_KEY === '',
  length: ROBOFLOW_API_KEY?.length,
  value: ROBOFLOW_API_KEY // Safe to log as it's public
});

interface RoboflowPrediction {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RoboflowResponse {
  predictions: RoboflowPrediction[];
}

const labelMap: Record<string, string[]> = {
  trousers: ['pants'],
  hoodie: ['jacket', 'sweater'],
  sweatshirt: ['jacket', 'sweater'],
  shirt: ['shirt'],
  tshirt: ['tshirt'],
  jacket: ['jacket'],
  dress: ['short-dress', 'midi-dress', 'long-dress'],
  skirt: ['short-skirt', 'midi-skirt', 'long-skirt'],
};

export async function POST(request: NextRequest) {
  try {
    // Log content type for debugging
    console.log('Content-Type:', request.headers.get('content-type'));
    
    const formData = await request.formData();
    console.log('Form data entries:', Array.from(formData.entries()));
    
    const image = formData.get('image');
    const itemName = formData.get('itemName');

    console.log('Received image:', image ? 'yes' : 'no', typeof image);
    console.log('Received itemName:', itemName);

    if (!ROBOFLOW_API_KEY) {
      console.error('ROBOFLOW_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error - API key not found' },
        { status: 500 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: 'Missing required field: image' },
        { status: 400 }
      );
    }

    if (!itemName) {
      return NextResponse.json(
        { error: 'Missing required field: itemName' },
        { status: 400 }
      );
    }

    if (!(image instanceof Blob)) {
      return NextResponse.json(
        { error: 'Image must be a file' },
        { status: 400 }
      );
    }

    // Convert File/Blob to Buffer
    const imageBuffer = Buffer.from(await image.arrayBuffer());

    // Create form data for Roboflow
    const form = new FormData();
    form.append('file', imageBuffer, {
      filename: 'image.jpg',
      contentType: image.type,
    });

    // Call Roboflow API with form data
    const roboflowUrl = `https://detect.roboflow.com/main-fashion-idals/1?api_key=${ROBOFLOW_API_KEY}`;
    
    const roboflowResponse = await fetch(
      roboflowUrl,
      {
        method: 'POST',
        body: form,
        headers: {
          ...form.getHeaders()
        }
      }
    );

    // Log the response for debugging
    const responseText = await roboflowResponse.text();
    console.log('Roboflow Response:', responseText);

    if (!roboflowResponse.ok) {
      console.error('Roboflow API error:', responseText);
      return NextResponse.json(
        { error: 'Error calling Roboflow API', details: responseText },
        { status: 500 }
      );
    }

    let predictions;
    try {
      predictions = JSON.parse(responseText) as RoboflowResponse;
    } catch (e) {
      console.error('Error parsing Roboflow response:', e);
      return NextResponse.json(
        { error: 'Invalid response from Roboflow API' },
        { status: 500 }
      );
    }

    if (!predictions.predictions || predictions.predictions.length === 0) {
      return NextResponse.json(
        { error: 'No items detected' },
        { status: 404 }
      );
    }

    // Get valid classes for the item name
    const validClasses = labelMap[itemName.toString().toLowerCase()];
    if (!validClasses) {
      return NextResponse.json(
        { error: 'Invalid item name' },
        { status: 400 }
      );
    }

    // Find the best matching prediction
    const bestMatch = predictions.predictions
      .filter((pred) => validClasses.includes(pred.class))
      .sort((a, b) => b.confidence - a.confidence)[0];

    if (!bestMatch) {
      return NextResponse.json(
        { error: 'No matching item found' },
        { status: 404 }
      );
    }

    // Extract bounding box coordinates
    const { x, y, width, height } = bestMatch;
    
    // Crop the image using sharp
    const croppedImageBuffer = await sharp(imageBuffer)
      .extract({
        left: Math.round(x - width / 2),
        top: Math.round(y - height / 2),
        width: Math.round(width),
        height: Math.round(height),
      })
      .png()
      .toBuffer();

    // Return the cropped image
    return new NextResponse(croppedImageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 