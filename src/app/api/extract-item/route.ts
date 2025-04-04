import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import FormData from 'form-data';
import fetch from 'node-fetch';

const ROBOFLOW_API_KEY = process.env.NEXT_PUBLIC_ROBOFLOW_API_KEY;

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
    const formData = await request.formData();
    const image = formData.get('image');
    const itemName = formData.get('itemName');

    if (!ROBOFLOW_API_KEY) {
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

    if (!roboflowResponse.ok) {
      const errorText = await roboflowResponse.text();
      return NextResponse.json(
        { error: 'Error calling Roboflow API', details: errorText },
        { status: 500 }
      );
    }

    const predictions = await roboflowResponse.json() as RoboflowResponse;

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
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 