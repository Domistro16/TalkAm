'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Square } from 'lucide-react';
import WebcamCapture from '@/components/WebcamCapture';
import TranslationOutput from '@/components/TranslationOutput';

export default function TranslatePage() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentSign, setCurrentSign] = useState('');
  const [sentence, setSentence] = useState('');
  const [confidence, setConfidence] = useState(0);

  // Simulated sign detection (replace with actual ML model)
  const handleFrame = useCallback((videoElement: HTMLVideoElement) => {
    // This is where you'd integrate your ML model
    // For now, we'll simulate detection

    // Simulate random sign detection for demo purposes
    const signs = ['Hello', 'Thank you', 'Yes', 'No', 'Please', 'Sorry', 'Help'];
    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    const randomConfidence = Math.floor(Math.random() * 40) + 60;

    // Only update occasionally to simulate real detection
    if (Math.random() > 0.95) {
      setCurrentSign(randomSign);
      setConfidence(randomConfidence);

      // Add to sentence if confidence is high enough
      if (randomConfidence > 75) {
        setSentence((prev) => (prev ? `${prev} ${randomSign.toLowerCase()}` : randomSign));
      }
    }
  }, []);

  const handleToggleTranslation = () => {
    setIsTranslating(!isTranslating);
    if (isTranslating) {
      // Reset when stopping
      setCurrentSign('');
      setConfidence(0);
    }
  };

  const handleClearSentence = () => {
    setSentence('');
    setCurrentSign('');
    setConfidence(0);
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

        {/* Info Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Note:</span> This is a demo interface.
            The sign detection is simulated. In production, this would connect to a
            machine learning model for accurate sign language recognition.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
