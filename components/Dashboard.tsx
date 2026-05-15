'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db, OperationType, handleFirestoreError } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { PlantScanner } from '@/components/PlantScanner';
import { PlantResultModal } from '@/components/PlantResultModal';
import { DiseaseGuide } from '@/components/DiseaseGuide';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, Droplets, Calendar, ChevronRight, AlertTriangle, 
  Leaf, Info, Sun, Thermometer, User, Home, Database, Users,
  HeartPulse, Sparkles, Sprout
} from 'lucide-react';

interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  nativeStatus: string;
  photoUrl: string;
  wateringIntervalDays: number;
  lastWateredAt: any;
  description: string;
  careTips: string;
}

export default function Dashboard() {
  const { user, signIn, logout, loading: authLoading } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [diagnosingPlant, setDiagnosingPlant] = useState<Plant | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'garden' | 'guides'>('dashboard');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'plants'), where('ownerId', '==', user.uid));
    return onSnapshot(q, (snapshot) => {
      setPlants(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Plant[]);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'plants'));
  }, [user]);

  const handleScan = async (image: string) => {
    setIsProcessing(true);
    setCapturedPhoto(image);
    try {
      const endpoint = diagnosingPlant ? '/api/diagnose' : '/api/identify';
      const body = diagnosingPlant ? { image, plantName: diagnosingPlant.commonName } : { image };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setScanResult(diagnosingPlant ? { ...data, commonName: diagnosingPlant.commonName, isDiagnosis: true } : data);
    } catch (err) {
      alert('Analysis failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setDiagnosingPlant(null);
    }
  };

  const savePlant = async (result: any) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'plants'), {
        ...result,
        ownerId: user.uid,
        photoUrl: capturedPhoto,
        lastWateredAt: serverTimestamp(),
        addedAt: serverTimestamp(),
      });
      setScanResult(null);
      setShowScanner(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'plants');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#F7F9F5] p-6 text-center">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
          <div className="w-20 h-20 bg-[#2D4F1E] rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl">
            <Sprout className="w-10 h-10" />
          </div>
          <h1 className="text-6xl font-bold tracking-tight text-[#2D4F1E]">ROOTS<span className="font-light">AI</span></h1>
          <p className="text-[#5C6B5C] text-lg max-w-sm mx-auto">Master your garden with AI-powered native species identification and health diagnostics.</p>
          <motion.button 
            onClick={signIn} 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#2D4F1E] text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-3 mx-auto"
          >
            <User className="w-5 h-5" />
            Get Started
          </motion.button>
        </motion.div>
      </main>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-[#D1D9CD] bg-white px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2D4F1E] rounded-lg flex items-center justify-center text-white">
            <Leaf className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#2D4F1E]">ROOTS<span className="font-light">AI</span></h1>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-[#5C6B5C]">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setActiveTab('dashboard')}
            className={`${activeTab === 'dashboard' ? 'text-[#2D4F1E] border-b-2 border-[#2D4F1E]' : 'hover:text-[#2D4F1E]'} pb-1 transition-all`}
          >
            Dashboard
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setActiveTab('garden')}
            className={`${activeTab === 'garden' ? 'text-[#2D4F1E] border-b-2 border-[#2D4F1E]' : 'hover:text-[#2D4F1E]'} pb-1 transition-all`}
          >
            My Garden
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setActiveTab('guides')}
            className={`${activeTab === 'guides' ? 'text-[#2D4F1E] border-b-2 border-[#2D4F1E]' : 'hover:text-[#2D4F1E]'} pb-1 transition-all`}
          >
            Guides
          </motion.button>
        </nav>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold">{user.displayName}</p>
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

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Stats Sidebar */}
        <aside className="w-72 hidden lg:flex flex-col gap-6">
          <div className="bg-white p-5 rounded-3xl border border-[#D1D9CD] shadow-sm">
            <h3 className="text-xs font-bold text-[#8A9B8A] uppercase tracking-wider mb-4">Environment</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#5C6B5C]">Soil Moisture</span>
                  <span className="text-[#2D4F1E] font-bold">48%</span>
                </div>
                <div className="w-full h-1.5 bg-[#F0F4EF] rounded-full overflow-hidden">
                  <div className="bg-[#4A7C44] h-full w-[48%]"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center pt-2">
                <div className="bg-[#F7F9F5] p-2 rounded-xl border border-[#E9ECE7]">
                  <p className="text-[10px] text-brand-muted">Humidity</p>
                  <p className="text-sm font-bold text-[#2D4F1E]">62%</p>
                </div>
                <div className="bg-[#F7F9F5] p-2 rounded-xl border border-[#E9ECE7]">
                  <p className="text-[10px] text-brand-muted">Temp</p>
                  <p className="text-sm font-bold text-[#2D4F1E]">74°F</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white flex-1 p-5 rounded-3xl border border-[#D1D9CD] shadow-sm flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold text-[#8A9B8A] uppercase tracking-wider mb-4">Watering Schedule</h3>
            <div className="space-y-3 overflow-y-auto pr-2">
              {plants.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-[#F0F4EF] rounded-2xl hover:bg-[#E6ECE5] cursor-pointer transition-colors">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{p.commonName}</p>
                    <p className="text-[10px] text-[#8A9B8A]">In {p.wateringIntervalDays} days</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Canvas / Feed or Guides */}
        {activeTab === 'guides' ? (
          <DiseaseGuide />
        ) : (
          <section className="flex-1 bg-white rounded-[2.5rem] border border-[#D1D9CD] shadow-sm flex flex-col overflow-hidden">
            <div className="p-8 border-b border-[#F0F4EF] flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#2D4F1E]">
                  {activeTab === 'garden' ? 'My Habitat' : 'Garden Intelligence'}
                </h2>
                <p className="text-[#8A9B8A] text-sm">Tracking {plants.length} species</p>
              </div>
              <motion.button 
                onClick={() => { setDiagnosingPlant(null); setShowScanner(true); }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#2D4F1E] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:opacity-90 flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Scan Plant
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                {plants.map(plant => (
                  <motion.div 
                    key={plant.id} 
                    layout
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#F7F9F5] rounded-3xl overflow-hidden border border-[#D1D9CD] group"
                  >
                    <div className="h-40 relative">
                      <img src={plant.photoUrl} alt={plant.commonName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <span className="px-2 py-1 bg-white/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-[#2D4F1E] uppercase">{plant.nativeStatus}</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-[#2D4F1E]">{plant.commonName}</h4>
                          <p className="text-[10px] text-[#8A9B8A] italic">{plant.scientificName}</p>
                        </div>
                        <motion.button 
                          onClick={() => { setDiagnosingPlant(plant); setShowScanner(true); }}
                          whileHover={{ scale: 1.1, backgroundColor: '#2D4F1E', color: '#ffffff' }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white rounded-xl border border-[#D1D9CD] text-[#2D4F1E] transition-all shadow-sm"
                          title="Diagnose Health"
                        >
                          <HeartPulse className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
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

        {/* Right Analysis Sidebar */}
        <aside className="w-80 hidden xl:flex flex-col gap-4">
          <div className="bg-[#FFF4ED] p-5 rounded-3xl border border-[#FFE0D1] shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-[#D35400]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold">Local Pest Alert</h3>
            </div>
            <p className="text-xs text-[#6E4B34] leading-relaxed">High Aphid activity reported in your area. Check undersides of young leaves.</p>
          </div>

          <div className="bg-white flex-1 p-5 rounded-3xl border border-[#D1D9CD] shadow-sm flex flex-col">
            <h3 className="text-xs font-bold text-[#8A9B8A] uppercase tracking-wider mb-4">Garden Insights</h3>
            <div className="space-y-4 flex-1">
              <div className="flex gap-3">
                <div className="w-1 bg-[#4A7C44] rounded-full"></div>
                <div>
                  <p className="text-xs font-bold text-[#2D4F1E]">Seasonal Advice</p>
                  <p className="text-[11px] text-[#5C6B5C]">Mid-Spring: Increase watering for native shrubs as they prepare for early summer blooms.</p>
                </div>
              </div>
              <div className="bg-[#F7F9F5] p-3 rounded-2xl border border-[#D1D9CD]/50">
                <p className="text-[11px] font-bold text-[#2D4F1E] mb-2">Native Ecosystem Tip</p>
                <p className="text-[10px] text-[#5C6B5C] leading-relaxed">Leaving dead flower stalks provides critical nesting material for over 20 species of native bees.</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-[#2D4F1E] text-white rounded-2xl text-xs font-bold shadow-lg hover:opacity-90 mt-4 transition-all"
            >
              Export Garden Report
            </motion.button>
          </div>
        </aside>
      </main>

      <AnimatePresence>
        {showScanner && <PlantScanner onScan={handleScan} onClose={() => setShowScanner(false)} isProcessing={isProcessing} />}
        {scanResult && <PlantResultModal result={scanResult} onClose={() => {setScanResult(null); setShowScanner(false);}} onSave={savePlant} isSaving={isSaving} photoUrl={capturedPhoto} />}
      </AnimatePresence>
    </div>
  );
}
