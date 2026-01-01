'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Square } from 'lucide-react';
import WebcamCapture from '@/components/WebcamCapture';
import TranslationOutput from '@/components/TranslationOutput';
import { videoFrameToBase64 } from '@/lib/imageUtils';

export default function TranslatePage() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentSign, setCurrentSign] = useState('');
  const [sentence, setSentence] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const lastSignRef = useRef<string>('');
  const lastProcessTimeRef = useRef<number>(0);

  // Real sign detection using Gemini API
  const handleFrame = useCallback(async (videoElement: HTMLVideoElement) => {
    // Throttle API calls to once per second
    const now = Date.now();
    if (now - lastProcessTimeRef.current < 1000 || isProcessing) {
      return;
    }

    lastProcessTimeRef.current = now;
    setIsProcessing(true);
    setError('');

    try {
      // Convert video frame to base64
      const base64Image = videoFrameToBase64(videoElement, 0.7);

      // Call the API
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Translation failed');
      }

      const data = await response.json();

      // Update state based on API response
      if (data.sign && !data.is_transition) {
        setCurrentSign(data.sign);
        setConfidence(data.confidence);

        // Add to sentence if confidence is high enough and it's a new sign
        if (data.confidence > 70 && data.sign !== lastSignRef.current) {
          lastSignRef.current = data.sign;
          setSentence((prev) => (prev ? `${prev} ${data.sign.toLowerCase()}` : data.sign));
        }
      } else if (data.is_transition) {
        // During transition, keep showing last sign but don't update sentence
        setConfidence(0);
      } else {
        // No sign detected
        setCurrentSign('');
        setConfidence(0);
        lastSignRef.current = '';
      }
    } catch (err) {
      console.error('Error translating frame:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to translate sign. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const handleToggleTranslation = () => {
    setIsTranslating(!isTranslating);
    if (isTranslating) {
      // Reset when stopping
      setCurrentSign('');
      setConfidence(0);
      setError('');
      lastSignRef.current = '';
    }
  };

  const handleClearSentence = () => {
    setSentence('');
    setCurrentSign('');
    setConfidence(0);
    setError('');
    lastSignRef.current = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Live Translation
          </h1>
          <p className="text-lg text-gray-600">
            Real-time sign language translation using your webcam
          </p>
        </motion.div>

        {/* Translation Interface */}
        <div className="grid lg:grid-cols-[60%_40%] gap-6">
          {/* Video Feed - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="aspect-video w-full">
              <WebcamCapture
                isActive={isTranslating}
                onFrame={handleFrame}
              />
            </div>

            {/* Processing Indicator */}
            {isTranslating && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                {isProcessing ? (
                  <>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Analyzing frame...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span>Waiting for next frame</span>
                  </>
                )}
              </div>
            )}

            {/* Control Button */}
            <button
              onClick={handleToggleTranslation}
              className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl ${
                isTranslating
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isTranslating ? (
                <>
                  <Square size={24} />
                  Stop Translation
                </>
              ) : (
                <>
                  <Play size={24} />
                  Start Translation
                </>
              )}
            </button>
          </motion.div>

          {/* Translation Output - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full"
          >
            <TranslationOutput
              currentSign={currentSign}
              sentence={sentence}
              confidence={confidence}
              onClear={handleClearSentence}
            />
          </motion.div>
        </div>

        {/* Error Notice */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <p className="text-sm text-red-800">
              <span className="font-semibold">Error:</span> {error}
            </p>
          </motion.div>
        )}

        {/* Info Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Note:</span> AI-powered sign language detection using Google Gemini.
            Make sure to configure your GEMINI_API_KEY in .env.local for real-time translation.
            The system analyzes frames once per second to detect ASL signs.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
