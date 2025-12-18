
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VibeResults } from './components/VibeResults';
import { LoadingShimmer } from './components/LoadingShimmer';
import { analyzeVibe } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    loading: false,
    result: null,
    error: null,
  });
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, image: reader.result as string, error: null, result: null }));
      };
      reader.readAsDataURL(file);
    } else {
      setState(prev => ({ ...prev, error: "Please upload a valid image file (JPG or PNG)." }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleGenerate = async () => {
    if (!state.image) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await analyzeVibe(state.image);
      setState(prev => ({ ...prev, result, loading: false }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Failed to decode the vibe. The cyber-link might be unstable. Try again?" 
      }));
    }
  };

  const reset = () => {
    setState({ image: null, loading: false, result: null, error: null });
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white selection:bg-cyber-blue/30 overflow-x-hidden font-sans">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Persistent Navbar */}
      <nav className="sticky top-0 z-50 w-full glass-card border-x-0 border-t-0 border-b border-white/10 px-6 py-4 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              <span className="font-display font-black text-lg italic">V</span>
            </div>
            <h1 className="font-display font-black text-xl tracking-tighter uppercase hidden sm:block">
              Vibe<span className="text-cyber-blue">-</span>Tagger
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-6"
          >
            <button 
              onClick={reset}
              className="text-[10px] font-display tracking-[0.2em] text-white/50 hover:text-white transition-all duration-300 uppercase py-2 px-4 rounded-full border border-white/5 hover:border-white/20 hover:bg-white/5"
            >
              Reset System
            </button>
          </motion.div>
        </div>
      </nav>

      <main className="relative z-10 px-6 max-w-7xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!state.result && !state.loading && (
            <motion.div
              key="uploader"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              className="w-full max-w-3xl flex flex-col items-center gap-8 py-12"
            >
              <div className="text-center space-y-4 max-w-lg mt-8">
                <h2 className="text-4xl md:text-5xl font-black font-display leading-tight">
                  YOUR IMAGE, <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-pink">PERFECTLY CAPTIONED.</span>
                </h2>
                <p className="text-white/60 text-lg leading-relaxed">
                  Upload your photo to generate viral captions, high-energy vibes, and trending hashtags automatically.
                </p>
              </div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`w-full aspect-[16/10] md:aspect-[21/9] glass-card rounded-3xl relative flex flex-col items-center justify-center cursor-pointer group border-2 transition-all duration-300 overflow-hidden ${
                  isDragging 
                    ? 'border-cyber-blue bg-cyber-blue/5 scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
                    : state.image ? 'border-white/20' : 'border-dashed border-white/10 hover:border-cyber-blue/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {state.image ? (
                  <div className="w-full h-full relative group/img">
                    <img src={state.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-cyber-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="font-display text-xs tracking-[0.2em] font-bold uppercase">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6 text-center px-4">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-cyber-blue/20 blur-2xl rounded-full transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0'}`} />
                      <svg className={`w-16 h-16 transition-all duration-300 ${isDragging ? 'text-cyber-blue scale-110' : 'text-white/20 group-hover:text-cyber-blue/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <span className={`block font-display text-base tracking-widest uppercase font-black transition-colors ${isDragging ? 'text-cyber-blue' : 'text-white/60 group-hover:text-white'}`}>
                        {isDragging ? 'Release to Drop' : 'Select Image'}
                      </span>
                      <span className="block text-xs text-white/30 tracking-widest uppercase font-medium">
                        Drag & Drop your file or click to browse
                      </span>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*" 
                />
              </motion.div>

              {state.image && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  className="px-12 py-5 bg-cyber-blue rounded-2xl font-display font-black italic tracking-widest text-lg shadow-xl shadow-blue-500/20 flex items-center gap-3 group relative overflow-hidden"
                >
                  <span className="relative z-10">INITIALIZE ANALYSIS</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple to-cyber-pink opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <svg className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </motion.button>
              )}
            </motion.div>
          )}

          {state.loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full mt-12"
            >
              <div className="text-center mb-4 flex flex-col items-center gap-2">
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-cyber-yellow to-transparent animate-shimmer" />
                <h3 className="font-display font-black text-cyber-yellow tracking-[0.2em] text-sm animate-pulse">DECODING THE AESTHETIC...</h3>
              </div>
              <LoadingShimmer />
            </motion.div>
          )}

          {state.result && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full mt-12"
            >
              <VibeResults result={state.result} />
            </motion.div>
          )}
        </AnimatePresence>

        {state.error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 glass-card border-cyber-red/50 bg-cyber-red/10 px-6 py-3 rounded-xl flex items-center gap-3 z-50"
          >
            <div className="w-2 h-2 rounded-full bg-cyber-red animate-ping" />
            <span className="text-sm font-semibold text-cyber-red">{state.error}</span>
          </motion.div>
        )}
      </main>

      {/* Persistent Call to Action (Floating Action Button when in Results) */}
      <AnimatePresence>
        {state.result && (
          <motion.button
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            onClick={reset}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-white text-cyber-black rounded-full flex items-center justify-center shadow-2xl hover:bg-cyber-yellow transition-colors group"
          >
            <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="relative z-10 mt-32 border-t border-white/10 bg-gradient-to-b from-transparent to-cyber-black">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-6">
             <div className="flex flex-col items-center gap-3 group">
              <span className="text-[11px] font-display text-white/40 tracking-[0.2em] uppercase">Powered By</span>
              <a 
                href="https://www.oscode.co.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 glass-card rounded-lg border-cyber-blue/20 hover:border-cyber-blue/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group"
              >
                <span className="font-display font-black text-sm tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink">
                  OSCODE CIT
                </span>
              </a>
            </div>
            
            <div className="flex items-center gap-8">
              <a href="https://github.com/oscode-cit" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/oscodecit/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-cyber-blue transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://www.instagram.com/oscodecit/?igsh=N3o1d3ZzN3Y5aWl2#" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-cyber-pink transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.353 2.612 6.777 6.973 6.977 1.28.057 1.688.072 4.948.072s3.667-.015 4.947-.072c4.351-.2 6.777-2.612 6.977-6.977.058-1.28.072-1.688.072-4.947s-.015-3.667-.072-4.947c-.2-4.349-2.612-6.776-6.977-6.976C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="mailto:oscodecit@cambridge.edu.in" className="text-white/40 hover:text-cyber-yellow transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Subtle bottom bar */}
        <div className="w-full h-1 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink opacity-20" />
      </footer>
    </div>
  );
};

export default App;
