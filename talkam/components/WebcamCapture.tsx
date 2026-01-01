'use client';

import { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

interface WebcamCaptureProps {
  isActive: boolean;
  onFrame?: (videoElement: HTMLVideoElement) => void;
}

export default function WebcamCapture({ isActive, onFrame }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const startCamera = async () => {
    setIsLoading(true);
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera permission denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No camera found. Please connect a camera and try again.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError('Camera is already in use by another application.');
        } else {
          setError('Unable to access camera. Please check your browser settings.');
        }
      }
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasPermission(null);
  };

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  // Frame capture for processing
  useEffect(() => {
    if (!isActive || !onFrame || !videoRef.current) return;

    const intervalId = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        onFrame(videoRef.current);
      }
    }, 100); // Capture frame every 100ms

    return () => clearInterval(intervalId);
  }, [isActive, onFrame]);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${!isActive || error ? 'hidden' : ''}`}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
          <Camera size={48} className="animate-pulse mb-4" />
          <p className="text-lg">Accessing camera...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-6">
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <p className="text-lg font-semibold mb-2">Camera Error</p>
          <p className="text-sm text-gray-300 text-center max-w-md">{error}</p>
          <button
            onClick={startCamera}
            className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Inactive State */}
      {!isActive && !error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
          <CameraOff size={48} className="mb-4 text-gray-500" />
          <p className="text-lg text-gray-400">Camera is off</p>
          <p className="text-sm text-gray-500 mt-2">Click &quot;Start Translation&quot; to begin</p>
        </div>
      )}

      {/* Status Indicator */}
      {isActive && !error && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE
        </div>
      )}
    </div>
  );
}
