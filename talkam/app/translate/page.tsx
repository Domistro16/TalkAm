'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, Upload, Sparkles } from 'lucide-react';

export default function TranslatePage() {
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Sign Language Translation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you&apos;d like to translate sign language
          </p>
        </motion.div>

        {/* Translation Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Live Camera Option */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-emerald-500 cursor-pointer group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-6 group-hover:scale-110 transition-transform">
                <Video size={40} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Live Camera</h3>
              <p className="text-gray-600 mb-6">
                Use your webcam for real-time sign language translation
              </p>
              <button className="w-full px-6 py-3 bg-emerald-500 text-white font-semibold rounded-full hover:bg-emerald-600 transition-colors">
                Start Camera
              </button>
            </div>
          </motion.div>

          {/* Upload Video Option */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-emerald-500 cursor-pointer group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-6 group-hover:scale-110 transition-transform">
                <Upload size={40} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Upload Video</h3>
              <p className="text-gray-600 mb-6">
                Upload a video file for sign language translation
              </p>
              <button className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-colors">
                Choose File
              </button>
            </div>
          </motion.div>
        </div>

        {/* Features Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Sparkles size={24} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  AI-Powered Translation
                </h4>
                <p className="text-gray-600">
                  Our advanced AI model provides accurate real-time translation of sign language gestures
                  into text. Support for multiple sign languages coming soon.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
