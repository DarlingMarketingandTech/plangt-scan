'use client';

import React, { useState } from 'react';
import { diseases, DiseaseInfo } from '@/lib/data-diseases';
import { Search, AlertTriangle, Bug, Droplets, Info, ChevronRight, X, ShieldCheck, Sparkles, Sprout } from 'lucide-react';
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
    <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-[4rem] border border-[#D1D9CD]/50 shadow-2xl">
      <div className="p-12 border-b border-[#F0F4EF] flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/50 backdrop-blur-xl">
        <div>
          <h2 className="text-4xl font-light font-serif text-[#2D4F1E] tracking-tight">Health Lexicon</h2>
          <p className="text-[#8A9B8A] text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Organic pathology & native garden stewardship</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9B8A] opacity-50" />
          <input 
            type="text" 
            placeholder="Search symptoms or ailments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-8 py-4 bg-[#F7F9F5] rounded-full border border-[#D1D9CD]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F1E]/5 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredDiseases.map((disease) => (
            <motion.button
              key={disease.id}
              layoutId={disease.id}
              onClick={() => setSelectedDisease(disease)}
              whileHover={{ y: -8, scale: 1.02 }}
              className="flex flex-col text-left bg-white rounded-[3rem] border border-[#D1D9CD]/20 p-8 transition-all duration-500 group shadow-sm hover:shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#F7F9F5] rounded-full flex items-center justify-center group-hover:bg-[#4A7C44]/10 transition-colors">
                  {getTypeIcon(disease.type)}
                </div>
                <span className="text-[10px] font-bold text-[#8A9B8A] uppercase tracking-[0.2em]">{disease.type}</span>
              </div>
              
              <h3 className="text-2xl font-light font-serif text-[#2D4F1E] mb-3 leading-tight">{disease.name}</h3>
              <p className="text-sm text-[#5C6B5C] line-clamp-3 mb-6 leading-relaxed opacity-80 font-serif italic">
                "{disease.symptoms[0]}"
              </p>

              <div className="mt-auto pt-6 flex items-center justify-between border-t border-[#F0F4EF]">
                <span className="text-[10px] font-bold text-[#2D4F1E] uppercase tracking-widest opacity-60">Consult Guide</span>
                <div className="w-8 h-8 rounded-full border border-[#D1D9CD]/30 flex items-center justify-center group-hover:bg-[#2D4F1E] group-hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {filteredDiseases.length === 0 && (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-[#F7F9F5] rounded-full mx-auto flex items-center justify-center border border-[#D1D9CD]/30 shadow-inner">
              <Sprout className="w-8 h-8 text-[#D1D9CD]" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-serif text-[#2D4F1E]">Species record not found</p>
              <p className="text-[#8A9B8A] text-sm italic">Consider refining your query or scanning the specimen directly.</p>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedDisease && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1A2E1A]/95 backdrop-blur-md p-4 md:p-12"
          >
            <motion.div 
              layoutId={selectedDisease.id}
              className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative"
            >
              <button 
                onClick={() => setSelectedDisease(null)}
                className="absolute top-10 right-10 p-3 hover:bg-[#F7F9F5] rounded-full transition-all z-10 border border-transparent hover:border-[#D1D9CD]/30 outline-none"
              >
                <X className="w-5 h-5 text-[#8A9B8A]" />
              </button>

              <div className="p-16 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#F0F4EF]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F7F9F5] rounded-full flex items-center justify-center">
                        {getTypeIcon(selectedDisease.type)}
                      </div>
                      <span className="text-[10px] font-bold text-[#8A9B8A] uppercase tracking-[0.3em]">{selectedDisease.type} PATHOLOGY</span>
                    </div>
                    <h2 className="text-5xl font-light font-serif text-[#2D4F1E] tracking-tight">{selectedDisease.name}</h2>
                  </div>
                  <div className="px-5 py-2 bg-red-50 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-red-100 h-fit">
                    Active Research Required
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 text-[#2D4F1E]">
                      <AlertTriangle className="w-4 h-4 opacity-40" />
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Diagnostic Symptoms</h4>
                    </div>
                    <ul className="space-y-4">
                      {selectedDisease.symptoms.map((s, i) => (
                        <li key={i} className="text-sm text-[#5C6B5C] flex items-start gap-4 font-serif italic text-lg leading-relaxed">
                          <span className="h-1.5 w-1.5 bg-[#2D4F1E]/20 rounded-full mt-2.5 shrink-0" />
                          "{s}"
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="space-y-6">
                    <div className="flex items-center gap-3 text-[#2D4F1E]">
                      <ShieldCheck className="w-4 h-4 opacity-40" />
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Primary Vectors</h4>
                    </div>
                    <div className="bg-[#F7F9F5] p-10 rounded-[3rem] border border-[#D1D9CD]/30">
                      <p className="text-sm text-[#5C6B5C] leading-relaxed opacity-80">
                        {selectedDisease.causes}
                      </p>
                    </div>
                  </section>
                </div>

                <section className="p-12 bg-white rounded-[4rem] border border-[#D1D9CD]/30 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                    <Sparkles className="w-32 h-32 text-[#2D4F1E]" />
                  </div>
                  <div className="flex items-center gap-3 text-[#2D4F1E] mb-8 relative z-10">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Restoration Protocol</h4>
                  </div>
                  <p className="text-2xl text-[#2D4F1E] font-serif leading-relaxed mb-8 relative z-10 italic">
                    "{selectedDisease.treatment}"
                  </p>
                  <div className="pt-8 border-t border-[#F0F4EF] flex items-start gap-6 relative z-10">
                    <div className="w-10 h-10 bg-[#F7F9F5] rounded-full flex items-center justify-center shrink-0">
                      <Info className="w-4 h-4 text-[#2D4F1E] opacity-60" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#2D4F1E] uppercase tracking-[0.2em] mb-2">Long-term Stewardship</p>
                      <p className="text-sm text-[#8A9B8A] leading-relaxed opacity-80">{selectedDisease.prevention}</p>
                    </div>
                  </div>
                </section>

                <button 
                  onClick={() => setSelectedDisease(null)}
                  className="w-full py-6 bg-[#2D4F1E] text-white rounded-full font-bold hover:opacity-95 transition-all text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#2D4F1E]/20"
                >
                  Archive Observation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
