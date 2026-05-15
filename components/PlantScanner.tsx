'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, X, ShieldAlert, Sparkles, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlantScannerProps {
  onScan: (image: string) => Promise<void>;
  onClose: () => void;
  isProcessing: boolean;
}

export function PlantScanner({ onScan, onClose, isProcessing }: PlantScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (err) {
      setError('Camera access denied. Please check site permissions.');
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        onScan(canvas.toDataURL('image/jpeg', 0.85));
        stopCamera();
      }
    }
  };

  useEffect(() => { return () => stopCamera(); }, [stopCamera]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F0A]/95 p-4"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl aspect-video bg-black rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl"
      >
        <motion.button 
          onClick={onClose} 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-6 right-6 z-30 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </motion.button>

        {isCameraActive ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-12 border-2 border-white/30 rounded-2xl pointer-events-none z-20">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
            </div>
            {isProcessing && (
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[2px] bg-green-400/50 shadow-[0_0_15px_rgba(74,222,128,0.5)] z-20"
              />
            )}
            <div className="absolute bottom-8 inset-x-0 flex justify-center z-30">
              <motion.button 
                onClick={captureImage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 bg-white rounded-full border-8 border-white/30 flex items-center justify-center transition-all"
              >
                <div className="w-14 h-14 bg-white rounded-full border border-black/10" />
              </motion.button>
            </div>
          </>
        ) : (
          <div className="flex-1 h-full flex flex-col items-center justify-center p-12 text-white space-y-8 bg-[#0A0F0A]">
            <div className="w-20 h-20 bg-[#2D4F1E] rounded-2xl flex items-center justify-center shadow-lg">
              <Camera className="w-10 h-10" />
            </div>
            <div className="text-center max-w-sm">
              <h2 className="text-2xl font-bold mb-2">Plant Identifier</h2>
              <p className="text-white/60 text-sm">Position your plant in the viewfinder for species identification and health analysis.</p>
            </div>
            <div className="flex gap-4 w-full max-w-md">
              <motion.button 
                onClick={startCamera} 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-white text-[#2D4F1E] py-4 rounded-xl font-bold hover:bg-green-50 transition-colors"
              >
                Open Camera
              </motion.button>
              <motion.label 
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 border border-white/20 py-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload Photo
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (re) => onScan(re.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
              </motion.label>
            </div>
          </div>
        )}
      </motion.div>
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}
