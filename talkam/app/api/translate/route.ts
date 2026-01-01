import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are an ASL (American Sign Language) interpreter. Analyze the image and identify any ASL sign being performed. Respond with JSON only:
{
  "sign": "detected sign or null if none",
  "confidence": 0-100,
  "is_transition": boolean (true if hand is moving between signs)
}

Focus on common signs: hello, thank you, please, yes, no, help, sorry, good morning, how are you, my name is, nice to meet you, goodbye, I love you, family, friend, eat, drink, water, bathroom, money, work.`;

interface TranslationResponse {
  sign: string | null;
  confidence: number;
  is_transition: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: 'API key not configured',
          message: 'GEMINI_API_KEY environment variable is not set',
        },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { image } = body;

    // Validate the image data
    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Image data is required and must be a base64 encoded string',
        },
        { status: 400 }
      );
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    // Validate base64 format
    if (!/^[A-Za-z0-9+/=]+$/.test(base64Image)) {
      return NextResponse.json(
        {
          error: 'Invalid image format',
          message: 'Image must be a valid base64 encoded string',
        },
        { status: 400 }
      );
    }

    // Get the Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg',
      },
    };

    // Generate content with the image and prompt
    const result = await model.generateContent([
      SYSTEM_PROMPT,
      imagePart,
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let translationData: TranslationResponse;

    try {
      // Extract JSON from the response (remove markdown code blocks if present)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      translationData = JSON.parse(jsonMatch[0]);

      // Validate the response structure
      if (
        typeof translationData.confidence !== 'number' ||
        typeof translationData.is_transition !== 'boolean'
      ) {
        throw new Error('Invalid response structure from Gemini');
      }

      // Ensure confidence is within valid range
      translationData.confidence = Math.max(0, Math.min(100, translationData.confidence));

    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw response:', text);

      return NextResponse.json(
        {
          error: 'Invalid API response',
          message: 'Failed to parse the response from Gemini API',
          details: text,
        },
        { status: 500 }
      );
    }

    // Return the successful translation
    return NextResponse.json(translationData, { status: 200 });

  } catch (error) {
    console.error('Error in translate API:', error);

    // Handle specific error types
    if (error instanceof Error) {
      // Check for rate limiting
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
          },
          { status: 429 }
        );
      }

      // Check for authentication errors
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        return NextResponse.json(
          {
            error: 'Authentication failed',
            message: 'Invalid or expired API key',
          },
          { status: 401 }
        );
      }

      // Generic error
      return NextResponse.json(
        {
          error: 'Translation failed',
          message: error.message,
        },
        { status: 500 }
      );
    }

    // Unknown error type
    return NextResponse.json(
      {
        error: 'Unknown error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests',
    },
    { status: 405 }
  );
}
