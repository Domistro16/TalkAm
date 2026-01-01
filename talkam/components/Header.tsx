'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HandMetal, Home } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  showHomeLink?: boolean;
}

export function Header({ showHomeLink = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg p-1"
          aria-label="TalkAm Home"
        >
          <motion.div
            whileHover={{ rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
          >
            <HandMetal className="w-6 h-6" />
          </motion.div>
          <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            TalkAm
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          {showHomeLink && (
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Home</span>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
