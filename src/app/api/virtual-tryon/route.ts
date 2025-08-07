import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
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
    const ai = new GoogleGenerativeAI(apiKey);
    console.log('Gemini initialized');

    // Get a model to generate content
    console.log('Getting model...');
    const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
    console.log('Model retrieved');

    // Prepare the request content
    const textPart = `Analyze this virtual try-on of clothing items and provide feedback on:
1. Fit and sizing
2. Style compatibility
3. Color coordination
4. Overall look assessment
5. Suggestions for improvement

Please be constructive and helpful in your feedback.`;

    const imageParts = [userImagePart, ...clothingImageParts];

    console.log('Sending request to Gemini...');
    const response = await model.generateContent([textPart, ...imageParts]);
    console.log('Response received from Gemini');

    const result = response.response;
    const feedback = result.text();

    // Log full response structure
    console.log('Full Gemini response:', JSON.stringify(response, null, 2));

    return NextResponse.json({
      success: true,
      feedback: feedback,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in virtual try-on:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 