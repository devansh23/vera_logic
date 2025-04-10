import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Types for the request
interface VirtualTryonRequest {
  userImage: File;
  clothingImage: File;
}

// Helper function to convert File to base64 with proper MIME type
async function fileToGenerativePart(file: File) {
  const buffer = await file.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(buffer).toString('base64'),
      mimeType: file.type || 'image/jpeg'
    }
  };
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Log API key presence (but not the actual key)
    console.log('GEMINI_API_KEY is present:', !!apiKey);

    // Get form data
    const formData = await request.formData();
    const userImage = formData.get('userImage') as File | null;
    const clothingImage = formData.get('clothingImage') as File | null;

    // Validate required fields
    if (!userImage || !clothingImage) {
      return NextResponse.json(
        { error: 'Both userImage and clothingImage are required' },
        { status: 400 }
      );
    }

    // Convert images to base64 with proper MIME types
    const [userImagePart, clothingImagePart] = await Promise.all([
      fileToGenerativePart(userImage),
      fileToGenerativePart(clothingImage)
    ]);

    // Initialize Gemini
    console.log('Initializing Gemini...');
    const ai = new GoogleGenAI({ apiKey });
    console.log('Gemini initialized');

    // Generate content
    console.log('Generating content...');
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: [
        { text: "This is a full-body photo of a person. This is a photo of an outfit. Please generate a realistic image of the person wearing this outfit. Maintain the person's body shape, faceial features, face,  pose, hairstyle, skin tone, and background context. Ensure the clothing fits naturally over their body without distortion. Blend the textures and shadows realistically for a natural appearance. Only return the new image of the person wearing the outfit — no borders, labels, or captions." },
        userImagePart,
        clothingImagePart
      ],
      config: {
        responseModalities: ["Text", "Image"]
      }
    });

    // Log full response structure
    console.log('Full response structure:', JSON.stringify(response, null, 2));

    // Process the response parts
    let generatedImage: string | null = null;
    let textResponse: string | null = null;

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          textResponse = part.text;
          console.log('Text response received:', textResponse);
        } else if (part.inlineData?.data) {
          generatedImage = part.inlineData.data;
        }
      }
    }

    // Check for successful generation
    if (!generatedImage) {
      throw new Error(`Failed to generate image: ${textResponse || 'No image data in response'}`);
    }

    // Convert the generated image to a buffer
    const imageBuffer = Buffer.from(generatedImage, 'base64');

    // Return the image
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="virtual-tryon.png"'
      }
    });

  } catch (error) {
    console.error('Error in virtual try-on:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate virtual try-on image' },
      { status: 500 }
    );
  }
} 