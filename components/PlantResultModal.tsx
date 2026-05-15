'use client';

import React from 'react';
import { X, Plus, Info, Leaf, Sparkles, HeartPulse, Droplets, FileText, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalysisResult {
  commonName?: string;
  scientificName?: string;
  nativeStatus?: string;
  description?: string;
  careTips?: string;
  careDetails?: {
    light?: string;
    soil?: string;
    watering?: string;
    temperature?: string;
    maintenance?: string;
  };
  wateringIntervalDays?: number;
  isHealthy?: boolean;
  diagnosis?: string;
  treatment?: string;
  urgency?: string;
  isDiagnosis?: boolean;
  notes?: string;
  confidence?: number;
}

interface PlantResultModalProps {
  result: AnalysisResult | null;
  photoUrl: string;
  onSave: (result: AnalysisResult) => void;
  onClose: () => void;
  isSaving: boolean;
}

export function PlantResultModal({ result, photoUrl, onSave, onClose, isSaving }: PlantResultModalProps) {
  const [notes, setNotes] = React.useState('');
  if (!result) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2E1A]/95 backdrop-blur-md p-4 md:p-12 overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-6xl rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.3)] flex flex-col md:flex-row h-full max-h-[90vh]"
      >
        <div className="md:w-[45%] relative bg-[#0A0F0A] group shrink-0">
          <img src={photoUrl} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F0A] via-transparent to-transparent opacity-60" />
          
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl font-light font-serif mb-4 leading-tight tracking-tight">
                {result.commonName || (result.isHealthy ? 'Specimen Healthy' : 'Anomaly Detected')}
              </h2>
              <div className="flex items-center gap-4">
                <p className="text-white/60 italic font-serif text-lg">
                  {result.scientificName || (result.isDiagnosis ? 'Pathological Report' : 'Identification Protocol')}
                </p>
                <div className="h-0.5 w-8 bg-green-500/40" />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 p-12 md:p-16 flex flex-col overflow-hidden bg-[#FBFBFA]">
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold text-[#8A9B8A] uppercase tracking-[0.3em]">Classification Report</h3>
              {result.confidence !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1 bg-[#F0F4EF] rounded-full overflow-hidden shrink-0">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      className="h-full bg-green-500"
                    />
                  </div>
                  <span className="text-[9px] font-bold text-[#8A9B8A] uppercase tracking-widest">
                    {(result.confidence * 100).toFixed(0)}% Confidence
                  </span>
                </div>
              )}
            </div>
            <motion.button 
              onClick={onClose} 
              whileHover={{ rotate: 90, scale: 1.1, backgroundColor: '#F0F4EF' }}
              whileTap={{ scale: 0.9 }}
              className="p-3 hover:bg-[#F7F9F5] rounded-full transition-all border border-transparent hover:border-[#D1D9CD]/30 outline-none"
            >
              <X className="w-5 h-5 text-[#8A9B8A]" />
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-12 pr-6 custom-scrollbar">
            {!result.isDiagnosis ? (
              <>
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-[#2D4F1E]">
                    <Info className="w-4 h-4 opacity-40" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Morphology</h4>
                  </div>
                  <div className="bg-white p-8 rounded-[3rem] border border-[#D1D9CD]/30 shadow-sm space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-[#F0F4EF]">
                      <span className="text-[#8A9B8A] text-[10px] uppercase font-bold tracking-widest">Habitat Status</span>
                      <span className="px-3 py-1 bg-[#2D4F1E] text-white rounded-full text-[9px] font-bold uppercase tracking-widest">{result.nativeStatus}</span>
                    </div>
                    <p className="text-sm text-[#5C6B5C] leading-relaxed font-serif italic text-lg opacity-80">"{result.description}"</p>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-[#2D4F1E]">
                    <Leaf className="w-4 h-4 opacity-40" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Stewardship</h4>
                  </div>
                  <div className="bg-white border border-[#D1D9CD]/30 p-8 rounded-[3rem] shadow-sm space-y-6">
                    <p className="text-sm text-[#5C6B5C] leading-relaxed opacity-80">{result.careTips}</p>
                    
                    {result.careDetails && (
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#F0F4EF]">
                        {Object.entries(result.careDetails).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <h5 className="text-[8px] font-bold text-[#8A9B8A] uppercase tracking-widest">{key}</h5>
                            <p className="text-[10px] text-[#2D4F1E] font-medium leading-tight">{value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-[#2D4F1E]">
                    <FileText className="w-4 h-4 opacity-40" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Garden Manifesto</h4>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Log your observations, seeding location, or seasonal thoughts..."
                    className="w-full p-8 bg-white border border-[#D1D9CD]/30 rounded-[3rem] text-sm text-[#5C6B5C] focus:outline-none focus:ring-2 focus:ring-[#2D4F1E]/5 min-h-[160px] resize-none shadow-inner"
                  />
                </section>
              </>
            ) : (
              <section className="space-y-10">
                <div className={`p-10 rounded-[3.5rem] border ${result.isHealthy ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                  <div className="flex items-center gap-5 mb-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${result.isHealthy ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'}`}>
                      <HeartPulse className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold font-serif ${result.isHealthy ? 'text-green-800' : 'text-red-800'}`}>
                        {result.isHealthy ? 'Vitality Optimal' : 'Critical Intervention'}
                      </h4>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Systemic Health Status</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[#5C6B5C] bg-white/50 p-6 rounded-[2rem] border border-white/50">{result.diagnosis}</p>
                </div>

                <div className="bg-white p-10 rounded-[3.5rem] border border-[#D1D9CD]/30 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 text-[#2D4F1E]">
                    <Sparkles className="w-4 h-4 opacity-40" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Corrective Protocol</h4>
                  </div>
                  <p className="text-lg text-[#2D4F1E] leading-relaxed font-serif italic mb-2">"{result.treatment}"</p>
                </div>
              </section>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-[#F0F4EF] flex gap-6">
            {!result.isDiagnosis && (
              <motion.button 
                onClick={() => onSave({ ...result, notes })}
                disabled={isSaving}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-[2] bg-[#2D4F1E] text-white py-5 rounded-full font-bold shadow-[0_15px_30px_rgba(45,79,30,0.3)] hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
              >
                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                Integrate into Garden
              </motion.button>
            )}
            <motion.button 
              onClick={onClose} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-5 rounded-full font-bold border transition-all text-xs uppercase tracking-widest ${result.isDiagnosis ? 'bg-[#2D4F1E] text-white border-transparent shadow-xl' : 'border-[#D1D9CD] text-[#8A9B8A] hover:bg-[#F7F9F5] hover:text-[#2D4F1E]'}`}
            >
              {result.isDiagnosis ? 'Protocol Acknowledged' : 'Dismiss'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
