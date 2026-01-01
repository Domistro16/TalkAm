'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import WebcamCapture from '@/components/WebcamCapture';
import TranslationOutput from '@/components/TranslationOutput';
import { useSignTranslation } from '@/hooks/useSignTranslation';
import { Header } from '@/components/Header';

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

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error('Translation Error', {
        description: error,
        duration: 5000,
      });
    }
  }, [error]);

  const handleVideoReady = (videoElement: HTMLVideoElement) => {
    // Start capturing when video is ready and translation is active
    if (isTranslating) {
      startCapture(videoElement);
      toast.success('Camera Ready', {
        description: 'Translation will begin shortly',
      });
    }
  };

  const handleToggleTranslation = () => {
    if (isTranslating) {
      // Stop translation
      stopCapture();
      setIsTranslating(false);
      toast.info('Translation Stopped', {
        description: 'Click Start Translation to resume',
      });
    } else {
      // Start translation
      setIsTranslating(true);
      toast.info('Starting Translation', {
        description: 'Please allow camera access',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950">
      <Header showHomeLink />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Live Translation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Real-time sign language translation using your webcam
          </p>
        </motion.div>

        {/* Translation Interface */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Video Feed - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            {/* Video Container with visual feedback */}
            <div className="relative aspect-video w-full">
              <AnimatePresence mode="wait">
                {isTranslating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 rounded-lg border-4 border-emerald-500 dark:border-emerald-400 pointer-events-none z-10"
                  >
                    <div className="absolute -top-3 left-4 bg-emerald-500 dark:bg-emerald-400 text-white dark:text-gray-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-white dark:bg-gray-900 rounded-full"
                      />
                      Active
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <WebcamCapture
                isActive={isTranslating}
                onVideoReady={handleVideoReady}
              />
            </div>

            {/* Processing Indicator */}
            <AnimatePresence>
              {isTranslating && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Analyzing frame...
                      </span>
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Waiting for next frame (every 2 seconds)
                      </span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Control Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleToggleTranslation}
              className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isTranslating
                  ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-500'
              }`}
              aria-label={isTranslating ? 'Stop translation' : 'Start translation'}
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
            </motion.button>
          </motion.div>

          {/* Translation Output - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <TranslationOutput
              currentSign={currentSign}
              sentence={sentence}
              confidence={confidence}
              onClear={clearSentence}
            />
          </motion.div>
        </div>

        {/* Info Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold">Note:</span> AI-powered sign language detection using Google Gemini 2.5 Pro.
            Make sure to configure your GEMINI_API_KEY in .env.local for real-time translation.
            The system analyzes frames every 2 seconds to detect ASL signs with 60%+ confidence threshold.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
