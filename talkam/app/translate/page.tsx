'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Square } from 'lucide-react';
import WebcamCapture from '@/components/WebcamCapture';
import TranslationOutput from '@/components/TranslationOutput';
import { useSignTranslation } from '@/hooks/useSignTranslation';

export default function TranslatePage() {
  const [isTranslating, setIsTranslating] = useState(false);

  // Use the custom hook for sign translation
  const {
    currentSign,
    sentence,
    confidence,
    isLoading,
    error,
    startCapture,
    stopCapture,
    clearSentence,
  } = useSignTranslation({
    captureInterval: 2000, // Capture every 2 seconds
    confidenceThreshold: 60, // Only add signs with 60%+ confidence
  });

  const handleVideoReady = (videoElement: HTMLVideoElement) => {
    // Start capturing when video is ready and translation is active
    if (isTranslating) {
      startCapture(videoElement);
    }
  };

  const handleToggleTranslation = () => {
    if (isTranslating) {
      // Stop translation
      stopCapture();
      setIsTranslating(false);
    } else {
      // Start translation
      setIsTranslating(true);
      // Note: startCapture will be called when video is ready via handleVideoReady
    }
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
                onVideoReady={handleVideoReady}
              />
            </div>

            {/* Processing Indicator */}
            {isTranslating && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                {isLoading ? (
                  <>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Analyzing frame...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span>Waiting for next frame (every 2 seconds)</span>
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
              onClear={clearSentence}
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
            The system analyzes frames every 2 seconds to detect ASL signs with 60%+ confidence threshold.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
