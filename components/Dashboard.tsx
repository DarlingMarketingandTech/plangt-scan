'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { PlantScanner } from '@/components/PlantScanner';
import { PlantResultModal } from '@/components/PlantResultModal';
import { DiseaseGuide } from '@/components/DiseaseGuide';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, Droplets, Calendar, ChevronRight, AlertTriangle, 
  Sprout, HeartPulse, User, LogOut, Info, Clock, CheckCircle2, Sparkles, FileText, Save
} from 'lucide-react';

interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  nativeStatus: string;
  addedAt: any;
  lastWateredAt?: any;
  photoUrl: string;
  wateringIntervalDays: number;
  description: string;
  careTips: string;
  notes?: string;
}

export default function Dashboard() {
  const { user, loading: authLoading, signIn, logout } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [diagnosingPlant, setDiagnosingPlant] = useState<Plant | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'garden' | 'guides'>('dashboard');
  const [updatingPlantId, setUpdatingPlantId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'plants'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPlants(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant)));
    });
    return () => unsubscribe();
  }, [user]);

  const handleCapture = async (imageData: string) => {
    setCapturedPhoto(imageData);
    setShowScanner(false);
    
    try {
      const endpoint = diagnosingPlant ? '/api/diagnose' : '/api/identify';
      const body = diagnosingPlant 
        ? { image: imageData, plantName: diagnosingPlant.commonName }
        : { image: imageData };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const result = await res.json();
      setAnalysisResult({ ...result, isDiagnosis: !!diagnosingPlant });
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const savePlant = async (result: any) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'plants'), {
        ownerId: user.uid,
        commonName: result.commonName,
        scientificName: result.scientificName,
        nativeStatus: result.nativeStatus,
        description: result.description,
        careTips: result.careTips,
        notes: result.notes || '',
        wateringIntervalDays: result.wateringIntervalDays || 7,
        photoUrl: capturedPhoto,
        addedAt: serverTimestamp(),
        lastWateredAt: serverTimestamp()
      });
      setAnalysisResult(null);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePlantNotes = async (plantId: string) => {
    const newNotes = editingNotes[plantId];
    if (newNotes === undefined) return;
    
    setUpdatingPlantId(plantId);
    try {
      await updateDoc(doc(db, 'plants', plantId), {
        notes: newNotes
      });
      // Clear editing state for this plant
      const newEditingNotes = { ...editingNotes };
      delete newEditingNotes[plantId];
      setEditingNotes(newEditingNotes);
    } catch (error) {
      console.error("Update notes failed:", error);
    } finally {
      setUpdatingPlantId(null);
    }
  };
  const markAsWatered = async (plantId: string) => {
    try {
      await updateDoc(doc(db, 'plants', plantId), {
        lastWateredAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Mark as watered failed:", error);
    }
  };

  const getWateringStatus = (plant: Plant) => {
    if (!plant.lastWateredAt) return { needsWater: true, daysLeft: 0 };
    
    const lastWatered = plant.lastWateredAt.toDate ? plant.lastWateredAt.toDate() : new Date(plant.lastWateredAt);
    const nextWatering = new Date(lastWatered.getTime() + (plant.wateringIntervalDays * 24 * 60 * 60 * 1000));
    const now = new Date();
    const diff = nextWatering.getTime() - now.getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    return { 
      needsWater: daysLeft <= 1, 
      daysLeft: daysLeft < 0 ? 0 : daysLeft 
    };
  };

  if (authLoading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#F7F9F5]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <Sprout className="w-10 h-10 text-[#2D4F1E]" />
      </motion.div>
    </div>
  );

  if (!user) return (
    <main className="h-screen w-screen flex flex-col items-center justify-center bg-[#F7F9F5] p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="w-24 h-24 bg-[#2D4F1E] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
          <Sprout className="w-12 h-12 text-[#F7F9F5]" />
        </div>
        <h1 className="text-7xl font-light tracking-tight text-[#2D4F1E] font-serif mb-4">ROOTS<span className="font-bold">AI</span></h1>
        <p className="text-[#5C6B5C] text-xl font-serif italic max-w-md mx-auto leading-relaxed">Master your garden with AI-powered native species identification and health diagnostics.</p>
        <motion.button 
          onClick={signIn} 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#2D4F1E] text-[#F7F9F5] px-12 py-5 rounded-full font-bold shadow-2xl hover:opacity-90 transition-all flex items-center gap-3 mx-auto mt-12"
        >
          <User className="w-5 h-5 opacity-80" />
          Enter the Garden
        </motion.button>
      </motion.div>
    </main>
  );

  return (
    <div className="min-h-screen bg-[#F7F9F5] flex flex-col">
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#D1D9CD] px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2D4F1E] rounded-xl flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-medium tracking-tight text-[#2D4F1E] font-serif uppercase letter-spacing-widest">ROOTS<span className="font-light">AI</span></h1>
        </div>

        <nav className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A9B8A]">
          <motion.button 
            onClick={() => setActiveTab('dashboard')}
            className={`${activeTab === 'dashboard' ? 'text-[#2D4F1E]' : 'hover:text-[#2D4F1E]'} transition-all relative py-2`}
          >
            Dashboard
            {activeTab === 'dashboard' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D4F1E]" />}
          </motion.button>
          <motion.button 
            onClick={() => setActiveTab('garden')}
            className={`${activeTab === 'garden' ? 'text-[#2D4F1E]' : 'hover:text-[#2D4F1E]'} transition-all relative py-2`}
          >
            My Garden
            {activeTab === 'garden' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D4F1E]" />}
          </motion.button>
          <motion.button 
            onClick={() => setActiveTab('guides')}
            className={`${activeTab === 'guides' ? 'text-[#2D4F1E]' : 'hover:text-[#2D4F1E]'} transition-all relative py-2`}
          >
            Guides
            {activeTab === 'guides' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D4F1E]" />}
          </motion.button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <h4 className="text-xs font-bold text-[#2D4F1E]">{user.displayName}</h4>
            <p className="text-[10px] text-[#8A9B8A]">Native Specialist</p>
          </div>
          <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
          <motion.button 
            onClick={logout} 
            whileHover={{ opacity: 0.8 }}
            className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-2"
          >
            Exit
          </motion.button>
        </div>
      </header>

      <main className="flex-1 flex gap-8 p-8 max-w-[1600px] mx-auto w-full overflow-hidden">
        <aside className="w-80 hidden lg:flex flex-col gap-8">
          <div className="bg-[#2D4F1E] p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Sparkles className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em] mb-3">Weekly Task</h3>
              <h2 className="text-3xl font-light font-serif leading-tight">Native Habitat Health Check</h2>
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-sans relative z-10">Scan your native prairie patch for early signs of rust or aphids.</p>
            <motion.button 
              onClick={() => { setDiagnosingPlant(null); setShowScanner(true); }}
              whileHover={{ x: 8 }}
              className="flex items-center gap-3 text-xs font-bold bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all w-fit relative z-10 uppercase tracking-widest"
            >
              Start Analysis <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-[#D1D9CD]/50 shadow-sm flex-1 space-y-8">
            <h3 className="text-[10px] font-bold text-[#8A9B8A] uppercase tracking-[0.2em]">Watering Cycle</h3>
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
              {plants.map(plant => {
                const status = getWateringStatus(plant);
                return (
                  <div key={plant.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${status.needsWater ? 'bg-blue-500/10 text-blue-500' : 'bg-[#F7F9F5] text-[#4A7C44]'}`}>
                        <Droplets className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#2D4F1E]">{plant.commonName}</h4>
                        <p className={`text-[10px] uppercase tracking-wider font-semibold ${status.needsWater ? 'text-blue-500' : 'text-[#8A9B8A]'}`}>
                          {status.needsWater ? 'Thirsty' : `${status.daysLeft}d left`}
                        </p>
                      </div>
                    </div>
                    {status.needsWater && (
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => markAsWatered(plant.id)}
                        className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                );
              })}
              {plants.length === 0 && (
                <div className="py-12 text-center text-[#8A9B8A] space-y-2">
                  <Droplets className="w-8 h-8 mx-auto opacity-30" />
                  <p className="text-[10px]">No schedule yet</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {activeTab === 'guides' ? (
          <DiseaseGuide />
        ) : (
          <section className="flex-1 bg-white rounded-[4rem] border border-[#D1D9CD]/50 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-12 border-b border-[#F0F4EF] flex items-center justify-between bg-white/50 backdrop-blur-xl sticky top-0 z-10">
              <div>
                <h2 className="text-4xl font-light text-[#2D4F1E] font-serif tracking-tight">
                  {activeTab === 'garden' ? 'My Native Habitat' : 'Garden Intelligence'}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-[#8A9B8A] text-[10px] font-bold uppercase tracking-[0.2em]">{plants.length} species cataloged</p>
                  <div className="h-1 w-1 bg-[#D1D9CD] rounded-full" />
                  <p className="text-[#8A9B8A] text-[10px] font-bold uppercase tracking-[0.2em]">Growing Zone 5b</p>
                </div>
              </div>
              <motion.button 
                onClick={() => { setDiagnosingPlant(null); setShowScanner(true); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#2D4F1E] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:opacity-90 flex items-center gap-3 text-xs uppercase tracking-widest"
              >
                <Camera className="w-4 h-4" />
                Scan Species
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-8">
                {plants.map(plant => {
                  const status = getWateringStatus(plant);
                  return (
                    <motion.div 
                      key={plant.id} 
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -8 }}
                      className="group bg-white rounded-[3rem] overflow-hidden border border-[#D1D9CD]/30 hover:border-[#D1D9CD] transition-all duration-500 shadow-sm hover:shadow-2xl"
                    >
                      <div className="h-64 relative overflow-hidden">
                        <img src={plant.photoUrl} alt={plant.commonName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="absolute top-6 left-6 right-6 flex justify-between">
                          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-[#2D4F1E] uppercase tracking-widest shadow-lg">{plant.nativeStatus}</span>
                          {status.needsWater && (
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1] }} 
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="px-3 py-1.5 bg-blue-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg"
                            >
                              <Droplets className="w-3 h-3" /> Thirsty
                            </motion.div>
                          )}
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                          <button 
                            onClick={() => setEditingNotes({ ...editingNotes, [plant.id]: plant.notes || '' })}
                            className="flex-1 bg-white/90 backdrop-blur-md text-[#2D4F1E] py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors"
                          >
                            Observations
                          </button>
                          <button 
                            onClick={() => { setDiagnosingPlant(plant); setShowScanner(true); }}
                            className="flex-1 bg-[#2D4F1E] text-white py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                          >
                            Diagnose
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <div>
                          <h4 className="text-2xl font-light font-serif text-[#2D4F1E] mb-1">{plant.commonName}</h4>
                          <p className="text-[11px] text-[#8A9B8A] italic uppercase tracking-wider font-semibold">{plant.scientificName}</p>
                        </div>

                        {editingNotes[plant.id] !== undefined ? (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 pt-6"
                          >
                            <textarea
                              value={editingNotes[plant.id]}
                              onChange={(e) => setEditingNotes({ ...editingNotes, [plant.id]: e.target.value })}
                              placeholder="Add your reflections..."
                              className="w-full p-5 bg-[#F7F9F5] border border-[#D1D9CD] rounded-[2rem] text-sm text-[#5C6B5C] focus:outline-none focus:ring-2 focus:ring-[#2D4F1E]/10 min-h-[140px] resize-none"
                            />
                            <div className="flex gap-3 justify-end">
                              <button 
                                onClick={() => {
                                  const newEditingNotes = { ...editingNotes };
                                  delete newEditingNotes[plant.id];
                                  setEditingNotes(newEditingNotes);
                                }}
                                className="px-5 py-2.5 text-[10px] font-bold text-[#8A9B8A] uppercase tracking-widest hover:text-[#2D4F1E] transition-colors"
                              >
                                Burn changes
                              </button>
                              <button 
                                onClick={() => updatePlantNotes(plant.id)}
                                disabled={updatingPlantId === plant.id}
                                className="px-8 py-2.5 bg-[#2D4F1E] text-white rounded-full text-[10px] font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 uppercase tracking-widest shadow-xl"
                              >
                                {updatingPlantId === plant.id ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
                                Archive Notes
                              </button>
                            </div>
                          </motion.div>
                        ) : plant.notes && (
                          <div className="pt-6">
                            <div className="bg-[#F7F9F5] p-5 rounded-[2rem] border border-[#D1D9CD]/30 relative group/notes">
                              <p className="text-sm text-[#5C6B5C] leading-relaxed font-serif italic line-clamp-4">
                                "{plant.notes}"
                              </p>
                              <button 
                                onClick={() => setEditingNotes({ ...editingNotes, [plant.id]: plant.notes || '' })}
                                className="mt-4 text-[10px] font-bold text-[#2D4F1E] uppercase tracking-widest opacity-0 group-hover/notes:opacity-100 transition-opacity flex items-center gap-2"
                              >
                                <FileText className="w-3 h-3" /> Refine Observations
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                {plants.length === 0 && (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <Sprout className="w-12 h-12 text-[#D1D9CD] mx-auto" />
                    <p className="text-[#8A9B8A]">Your garden awaits. Scan your first plant above.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <aside className="w-80 hidden xl:flex flex-col gap-8">
          <div className="bg-white p-10 rounded-[3.5rem] border border-[#D1D9CD]/50 shadow-sm flex flex-col gap-10">
            <h3 className="text-[10px] font-bold text-[#8A9B8A] uppercase tracking-[0.2em]">Environmental Pulse</h3>
            <div className="space-y-10">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#F7F9F5] rounded-full flex items-center justify-center text-[#2D4F1E] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2D4F1E] mb-1">Spring Equinox</h4>
                  <p className="text-[11px] text-[#8A9B8A] leading-relaxed">Perfect time for seeding native perennials like the Purple Coneflower.</p>
                </div>
              </div>
              <div className="p-8 bg-[#F7F9F5] rounded-[2.5rem] border border-[#E8EEE6] relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#2D4F1E] text-[#F7F9F5] rounded-full flex items-center justify-center shadow-lg">
                  <Info className="w-4 h-4" />
                </div>
                <h4 className="text-[10px] font-bold text-[#2D4F1E] uppercase tracking-widest mb-3">Stewardship Tip</h4>
                <p className="text-sm text-[#5C6B5C] leading-relaxed font-serif italic">"Leaving dead flower stalks provides critical nesting material for over 20 species of native bees."</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-[#2D4F1E] text-white rounded-full text-xs font-bold shadow-xl hover:opacity-90 mt-4 transition-all uppercase tracking-[0.1em]"
            >
              Export Garden Manifesto
            </motion.button>
          </div>
        </aside>
      </main>

      <AnimatePresence>
        {showScanner && (
          <PlantScanner 
            onCapture={handleCapture}
            onClose={() => setShowScanner(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {analysisResult && (
          <PlantResultModal 
            result={analysisResult}
            photoUrl={capturedPhoto}
            onSave={savePlant}
            onClose={() => setAnalysisResult(null)}
            isSaving={isSaving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
