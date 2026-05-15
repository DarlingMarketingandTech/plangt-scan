'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, X, RefreshCw, Upload, AlertTriangle, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlantScannerProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export function PlantScanner({ onCapture, onClose }: PlantScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please check permissions or upload a photo instead.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        onCapture(imageData);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F0A]/98 p-4 md:p-12"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full h-full max-w-5xl bg-black rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(45,79,30,0.3)] flex flex-col md:flex-row"
      >
        <motion.button 
          onClick={onClose} 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-8 right-8 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white backdrop-blur-xl border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </motion.button>

        <div className="flex-1 relative bg-[#050505] min-h-[300px]">
          {isCameraActive ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[80%] h-[70%] border border-white/20 rounded-[2rem] relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-xl" />
                  
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-x-0 h-0.5 bg-green-500/30 blur-sm shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  />
                </div>
              </div>
              <div className="absolute bottom-10 inset-x-0 flex justify-center z-30">
                <motion.button 
                  onClick={captureImage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-24 h-24 bg-white rounded-full p-2 shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
                >
                  <div className="w-full h-full rounded-full border-4 border-black/10 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#2D4F1E] rounded-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </motion.button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
              <Sprout className="w-16 h-16 text-[#2D4F1E] mb-8 animate-pulse" />
              <div className="space-y-4 max-w-sm">
                <h3 className="text-3xl font-light font-serif text-white tracking-tight">Lens Initialized</h3>
                <p className="text-white/40 text-sm leading-relaxed">System ready for species triangulation and biometric analysis. Please grant camera access.</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-[400px] bg-[#0A0A0A] p-12 flex flex-col justify-between border-l border-white/5 relative z-10">
          <div className="space-y-12">
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-green-500 uppercase tracking-[0.3em]">Protocol</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] text-white">01</div>
                  <p className="text-xs text-white/60 leading-relaxed">Position identifying features (leaves, petals) within the focus frame.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] text-white">02</div>
                  <p className="text-xs text-white/60 leading-relaxed">Ensure stable natural lighting for maximum classification confidence.</p>
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl text-red-500 text-xs leading-relaxed"
              >
                <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-widest text-[9px]">
                  <AlertTriangle className="w-3 h-3" /> System Fault
                </div>
                {error}
              </motion.div>
            )}
          </div>

          <div className="space-y-4 mt-12">
            <motion.button 
              onClick={startCamera} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-[#2D4F1E] py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-xl"
            >
              <RefreshCw className="w-4 h-4" />
              Activate Optical System
            </motion.button>
            <motion.label 
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full border border-white/10 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 cursor-pointer transition-colors text-white mt-2"
            >
              <Upload className="w-4 h-4 text-green-500" />
              Import Visual Data
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (prev) => {
                    if (prev.target?.result) onCapture(prev.target.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }} />
            </motion.label>
          </div>
        </div>
      </motion.div>
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}
