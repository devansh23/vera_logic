import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

    // Get form data
    const formData = await request.formData();
    const userImage = formData.get('userImage') as File | null;
    
    // Get all clothing images
    const clothingImages: File[] = [];
    let i = 0;
    while (formData.has(`clothingImage${i}`)) {
      const image = formData.get(`clothingImage${i}`) as File;
      if (image) {
        clothingImages.push(image);
      }
      i++;
    }

    // Validate required fields
    if (!userImage || clothingImages.length === 0) {
      return NextResponse.json(
        { error: 'User image and at least one clothing image are required' },
        { status: 400 }
      );
    }

    // Convert images to base64 with proper MIME types
    const userImagePart = await fileToGenerativePart(userImage);
    const clothingImageParts = await Promise.all(
      clothingImages.map(fileToGenerativePart)
    );

    // Initialize Gemini
    console.log('Initializing Gemini...');
    const ai = new GoogleGenAI({ apiKey });
    console.log('Gemini initialized');

    // Prepare the prompt
    const prompt = `Generate a realistic image of the person in the first image wearing all the clothing items shown in the subsequent images. 
    The clothing items should be properly fitted and positioned on the person's body.
    Maintain the person's pose and background while accurately applying the clothing items.
    Ensure the final image looks natural and realistic.`;

    // Generate content
    console.log('Generating content...');
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: [
        { text: prompt },
        userImagePart,
        ...clothingImageParts
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
          console.log('Image data received');
        }
      }
    }

    if (!generatedImage) {
      console.error('No image generated in response');
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

    // Return the generated image
    return NextResponse.json({ 
      image: generatedImage,
      text: textResponse 
    });
  } catch (error) {
    console.error('Error in virtual try-on:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 