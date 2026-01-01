import { useState, useRef, useCallback } from 'react';
import { videoFrameToBase64 } from '@/lib/imageUtils';

interface UseSignTranslationOptions {
  captureInterval?: number; // milliseconds between captures
  confidenceThreshold?: number; // minimum confidence to add to sentence
}

interface SignTranslationState {
  currentSign: string;
  sentence: string[];
  confidence: number;
  isLoading: boolean;
  error: string;
}

interface UseSignTranslationReturn extends SignTranslationState {
  startCapture: (videoElement: HTMLVideoElement) => void;
  stopCapture: () => void;
  clearSentence: () => void;
}

export function useSignTranslation(
  options: UseSignTranslationOptions = {}
): UseSignTranslationReturn {
  const {
    captureInterval = 2000, // 2 seconds by default
    confidenceThreshold = 60,
  } = options;

  // State
  const [currentSign, setCurrentSign] = useState<string>('');
  const [sentence, setSentence] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastSignRef = useRef<string>('');
  const isProcessingRef = useRef<boolean>(false);

  // Capture and process a single frame
  const processFrame = useCallback(async () => {
    if (!videoRef.current || isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;
    setIsLoading(true);
    setError('');

    try {
      // Convert video frame to base64
      const base64Image = videoFrameToBase64(videoRef.current, 0.7);

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

        // Add to sentence if:
        // 1. Confidence is above threshold
        // 2. Sign is different from the last one
        if (
          data.confidence >= confidenceThreshold &&
          data.sign !== lastSignRef.current
        ) {
          lastSignRef.current = data.sign;
          setSentence((prev) => [...prev, data.sign]);
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
      setIsLoading(false);
      isProcessingRef.current = false;
    }
  }, [confidenceThreshold]);

  // Start capturing frames
  const startCapture = useCallback(
    (videoElement: HTMLVideoElement) => {
      // Store video element reference
      videoRef.current = videoElement;

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Start new interval
      intervalRef.current = setInterval(() => {
        processFrame();
      }, captureInterval);

      // Process first frame immediately
      processFrame();
    },
    [processFrame, captureInterval]
  );

  // Stop capturing frames
  const stopCapture = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    videoRef.current = null;
    isProcessingRef.current = false;

    // Reset state
    setCurrentSign('');
    setConfidence(0);
    setIsLoading(false);
    setError('');
    lastSignRef.current = '';
  }, []);

  // Clear the accumulated sentence
  const clearSentence = useCallback(() => {
    setSentence([]);
    setCurrentSign('');
    setConfidence(0);
    setError('');
    lastSignRef.current = '';
  }, []);

  return {
    currentSign,
    sentence,
    confidence,
    isLoading,
    error,
    startCapture,
    stopCapture,
    clearSentence,
  };
}
