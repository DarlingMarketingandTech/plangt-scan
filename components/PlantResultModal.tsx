'use client';

import React from 'react';
import { Leaf, Droplets, Sun, Info, Plus, X, AlertCircle, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface ScanResult {
  commonName: string;
  scientificName: string;
  nativeStatus?: string;
  description: string;
  careTips: string;
  wateringIntervalDays?: number;
  isDiagnosis?: boolean;
  status?: string;
  pestAlert?: string;
  recommendations?: string;
}

export function PlantResultModal({ result, onClose, onSave, isSaving, photoUrl }: {
  result: ScanResult | null;
  onClose: () => void;
  onSave: (res: any) => void;
  isSaving: boolean;
  photoUrl: string;
}) {
  if (!result) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2E1A]/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh]"
      >
        <div className="md:w-1/2 relative bg-[#0A0F0A]">
          <img src={photoUrl} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E1A] via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <span className={`inline-block px-3 py-1 ${result.status === 'critical' ? 'bg-red-500' : 'bg-[#4A7C44]'} text-[10px] font-bold rounded-full mb-3 uppercase tracking-widest`}>
              {result.isDiagnosis ? `Diagnosis: ${result.status}` : 'Identification Successful'}
            </span>
            <h2 className="text-4xl font-bold leading-tight">{result.commonName}</h2>
            <p className="text-white/80 italic font-medium">{result.scientificName}</p>
          </div>
        </div>

        <div className="md:w-1/2 p-8 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-[#8A9B8A] uppercase tracking-widest">Analysis Results</h3>
            <motion.button 
              onClick={onClose} 
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-[#F7F9F5] rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#8A9B8A]" />
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8 pr-2">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-[#2D4F1E] font-bold">
                {result.isDiagnosis ? <HeartPulse className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                <p className="text-xs uppercase tracking-wider">{result.isDiagnosis ? 'Findings' : 'Summary'}</p>
              </div>
              <div className="text-sm leading-relaxed text-[#5C6B5C] bg-[#F7F9F5] p-5 rounded-2xl border border-[#D1D9CD]">
                <ReactMarkdown>{result.isDiagnosis ? result.description : result.description}</ReactMarkdown>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-[#2D4F1E] font-bold">
                {result.isDiagnosis ? <ShieldCheck className="w-4 h-4" /> : <Droplets className="w-4 h-4" />}
                <p className="text-xs uppercase tracking-wider">{result.isDiagnosis ? 'Treatment' : 'Care Profile'}</p>
              </div>
              <div className="text-sm leading-relaxed text-[#5C6B5C] border-l-2 border-[#D1D9CD] pl-5 py-1">
                <ReactMarkdown>{result.isDiagnosis ? result.careTips : result.careTips}</ReactMarkdown>
              </div>
            </section>

            {!result.isDiagnosis && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F7F9F5] rounded-2xl border border-[#D1D9CD]">
                  <p className="text-[10px] uppercase font-bold text-[#8A9B8A] mb-1">Watering</p>
                  <p className="text-sm font-bold text-[#2D4F1E]">Every {result.wateringIntervalDays} days</p>
                </div>
                <div className="p-4 bg-[#F7F9F5] rounded-2xl border border-[#D1D9CD]">
                  <p className="text-[10px] uppercase font-bold text-[#8A9B8A] mb-1">Type</p>
                  <p className="text-sm font-bold text-[#2D4F1E]">{result.nativeStatus}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-[#F0F4EF] flex gap-4">
            {!result.isDiagnosis && (
              <motion.button 
                onClick={() => onSave(result)}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-[#2D4F1E] text-white py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add to Garden
              </motion.button>
            )}
            <motion.button 
              onClick={onClose} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-4 rounded-2xl font-bold border transition-all ${result.isDiagnosis ? 'bg-[#2D4F1E] text-white border-transparent' : 'border-[#D1D9CD] text-[#5C6B5C] hover:bg-[#F7F9F5]'}`}
            >
              {result.isDiagnosis ? 'Acknowledge' : 'Cancel'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
