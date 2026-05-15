'use client';

import React, { useState } from 'react';
import { diseases, DiseaseInfo } from '@/lib/data-diseases';
import { Search, AlertTriangle, Bug, Droplets, Info, ChevronRight, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function DiseaseGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null);

  const filteredDiseases = diseases.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fungal': return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'pest': return <Bug className="w-4 h-4 text-orange-500" />;
      case 'bacterial': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-[2.5rem] border border-[#D1D9CD] shadow-sm">
      {/* Header */}
      <div className="p-8 border-b border-[#F0F4EF] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#2D4F1E] tracking-tight">Plant Health Guide</h2>
          <p className="text-[#8A9B8A] text-sm font-medium">Identify and treat common garden ailments organically.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9B8A]" />
          <input 
            type="text" 
            placeholder="Search symptoms or diseases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#F7F9F5] rounded-2xl border border-[#D1D9CD] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F1E]/20 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDiseases.map((disease) => (
            <motion.button
              key={disease.id}
              layoutId={disease.id}
              onClick={() => setSelectedDisease(disease)}
              whileHover={{ y: -4, borderColor: '#2D4F1E/30' }}
              className="flex flex-col text-left bg-white rounded-3xl border border-[#D1D9CD] p-6 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-[#F7F9F5] rounded-xl group-hover:bg-[#4A7C44]/10 transition-colors">
                  {getTypeIcon(disease.type)}
                </div>
                <span className="text-[10px] font-bold text-[#8A9B8A] uppercase tracking-widest">{disease.type}</span>
              </div>
              
              <h3 className="text-lg font-bold text-[#2D4F1E] mb-2">{disease.name}</h3>
              <p className="text-xs text-[#5C6B5C] line-clamp-2 mb-4 leading-relaxed">
                {disease.symptoms[0]} and more...
              </p>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#F0F4EF]">
                <span className="text-[10px] font-bold text-[#2D4F1E] uppercase tracking-wider">View Treatment</span>
                <ChevronRight className="w-4 h-4 text-[#D1D9CD] group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>

        {filteredDiseases.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-[#F7F9F5] rounded-full mx-auto flex items-center justify-center">
              <Search className="w-8 h-8 text-[#D1D9CD]" />
            </div>
            <p className="text-[#8A9B8A]">No diseases found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedDisease && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1A2E1A]/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              layoutId={selectedDisease.id}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedDisease(null)}
                className="absolute top-6 right-6 p-2 hover:bg-[#F7F9F5] rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-[#8A9B8A]" />
              </button>

              <div className="p-10 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {getTypeIcon(selectedDisease.type)}
                    <span className="text-xs font-bold text-[#8A9B8A] uppercase tracking-widest">{selectedDisease.type}</span>
                  </div>
                  <h2 className="text-4xl font-bold text-[#2D4F1E] tracking-tight">{selectedDisease.name}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-[#2D4F1E] font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      <h4 className="text-xs uppercase tracking-wider">Symptoms</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedDisease.symptoms.map((s, i) => (
                        <li key={i} className="text-sm text-[#5C6B5C] flex items-start gap-2">
                          <span className="text-[#4A7C44] mt-1">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-[#2D4F1E] font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <h4 className="text-xs uppercase tracking-wider">Cause</h4>
                    </div>
                    <p className="text-sm text-[#5C6B5C] leading-relaxed">
                      {selectedDisease.causes}
                    </p>
                  </section>
                </div>

                <section className="p-6 bg-[#F7F9F5] rounded-3xl border border-[#D1D9CD]">
                  <div className="flex items-center gap-2 text-[#2D4F1E] font-bold mb-4">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="text-xs uppercase tracking-wider">Organic Treatment</h4>
                  </div>
                  <p className="text-sm text-[#4A7C44] font-medium leading-relaxed mb-4">
                    {selectedDisease.treatment}
                  </p>
                  <div className="pt-4 border-t border-[#D1D9CD]/50 flex items-start gap-3">
                    <Info className="w-4 h-4 text-[#8A9B8A] mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-[#2D4F1E] uppercase tracking-wider mb-1">Prevention</p>
                      <p className="text-[11px] text-[#8A9B8A] leading-relaxed">{selectedDisease.prevention}</p>
                    </div>
                  </div>
                </section>

                <button 
                  onClick={() => setSelectedDisease(null)}
                  className="w-full py-4 bg-[#2D4F1E] text-white rounded-2xl font-bold hover:opacity-90 transition-opacity"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
