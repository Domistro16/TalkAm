# TalkAm - Sign Language Translation App

TalkAm is a modern web application that uses AI-powered sign language translation to help bridge communication gaps. Built with Next.js 16, TypeScript, and Google Gemini AI.

## Features

- **Real-time Translation**: Live webcam-based ASL (American Sign Language) detection
- **AI-Powered**: Uses Google Gemini 1.5 Pro vision API for accurate sign recognition
- **Modern UI**: Clean, accessible design with smooth animations
- **Responsive**: Works seamlessly on desktop and mobile devices

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your Google Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your API key:** Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to generate a free API key.

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

```
talkam/
├── app/
│   ├── api/
│   │   └── translate/        # API route for sign language detection
│   ├── translate/            # Translation page with webcam
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── Hero.tsx             # Landing page hero section
│   ├── WebcamCapture.tsx    # Webcam component with camera access
│   └── TranslationOutput.tsx # Translation results display
├── lib/                     # Utility functions
└── hooks/                   # Custom React hooks
```

## API Endpoints

### POST /api/translate

Analyzes a video frame for ASL signs.

**Request:**
```json
{
  "image": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "sign": "hello",
  "confidence": 85,
  "is_transition": false
}
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Google Gemini AI** - Vision API for sign language detection
- **Lucide React** - Icon library

## Supported ASL Signs

Currently supports common ASL signs including:
- Greetings: hello, good morning, goodbye
- Politeness: thank you, please, sorry
- Basic conversation: yes, no, help, how are you
- Introductions: my name is, nice to meet you
- Family & relationships: family, friend, I love you
- Daily needs: eat, drink, water, bathroom, money, work

## Development

The app runs on [http://localhost:3000](http://localhost:3000) in development mode.

The page auto-updates as you edit files. API routes can be accessed at [http://localhost:3000/api/*](http://localhost:3000/api/*).

## Deployment

This app can be deployed to:
- **Vercel** (recommended): One-click deployment
- **Netlify**: Deploy with Next.js plugin
- **Docker**: Containerized deployment

Make sure to set the `GEMINI_API_KEY` environment variable in your deployment platform.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Gemini AI](https://ai.google.dev/)
- [ASL Resources](https://www.lifeprint.com/) - Learn American Sign Language
