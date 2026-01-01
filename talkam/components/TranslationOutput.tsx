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
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Translation</h2>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Clear translation"
        >
          <Trash2 size={18} />
          <span className="font-medium">Clear</span>
        </button>
      </div>

      {/* Current Detected Sign */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Current Sign
        </label>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSign}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-[80px] flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6"
          >
            {currentSign ? (
              <p className="text-4xl font-bold text-emerald-600">{currentSign}</p>
            ) : (
              <p className="text-lg text-gray-400">Waiting for sign...</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Confidence Meter */}
      {currentSign && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp size={16} />
              Confidence
            </label>
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(confidence)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                confidence >= 80
                  ? 'bg-green-500'
                  : confidence >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Accumulated Sentence */}
      <div className="flex-1 flex flex-col">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Accumulated Sentence
        </label>
        <div className="flex-1 bg-gray-50 rounded-lg p-6 border-2 border-gray-200 overflow-y-auto">
          {sentenceText ? (
            <p className="text-xl text-gray-900 leading-relaxed whitespace-pre-wrap">
              {sentenceText}
            </p>
          ) : (
            <p className="text-lg text-gray-400 italic">
              Your translated sentence will appear here...
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Words Translated</p>
            <p className="text-2xl font-bold text-emerald-600">
              {sentenceArray.length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Characters</p>
            <p className="text-2xl font-bold text-blue-600">
              {sentenceText.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
