'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, TrendingUp } from 'lucide-react';

interface TranslationOutputProps {
  currentSign: string;
  sentence: string | string[];
  confidence: number;
  onClear: () => void;
}

export default function TranslationOutput({
  currentSign,
  sentence,
  confidence,
  onClear,
}: TranslationOutputProps) {
  // Convert sentence to string if it's an array
  const sentenceText = Array.isArray(sentence) ? sentence.join(' ') : sentence;
  const sentenceArray = Array.isArray(sentence) ? sentence : sentence.split(' ').filter(Boolean);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Translation</h2>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Clear translation"
        >
          <Trash2 size={18} />
          <span className="font-medium">Clear</span>
        </button>
      </div>

      {/* Current Detected Sign */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Current Sign
        </label>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSign}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="min-h-[80px] flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800"
          >
            {currentSign ? (
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-emerald-600 dark:text-emerald-400"
              >
                {currentSign}
              </motion.p>
            ) : (
              <p className="text-lg text-gray-400 dark:text-gray-500 italic">Waiting for sign...</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Confidence Meter */}
      {currentSign && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <TrendingUp size={16} />
              Confidence
            </label>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {Math.round(confidence)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                confidence >= 80
                  ? 'bg-green-500 dark:bg-green-400'
                  : confidence >= 50
                  ? 'bg-yellow-500 dark:bg-yellow-400'
                  : 'bg-red-500 dark:bg-red-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {/* Accumulated Sentence */}
      <div className="flex-1 flex flex-col">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Accumulated Sentence
        </label>
        <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-700 overflow-y-auto min-h-[150px]">
          {sentenceText ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap"
            >
              {sentenceText}
            </motion.p>
          ) : (
            <p className="text-lg text-gray-400 dark:text-gray-500 italic">
              Your translated sentence will appear here...
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Words Translated</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {sentenceArray.length}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Characters</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {sentenceText.length}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
