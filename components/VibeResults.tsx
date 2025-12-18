
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VibeResult, Caption } from '../types';

interface VibeResultsProps {
  result: VibeResult;
}

const CaptionCard: React.FC<{ caption: Caption; index: number }> = ({ caption, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(caption.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 rounded-2xl relative group overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-display uppercase tracking-widest text-cyber-blue px-2 py-1 bg-blue-500/10 rounded-md">
          {caption.style}
        </span>
        <button
          onClick={handleCopy}
          className="text-white/40 hover:text-cyber-yellow transition-colors"
        >
          {copied ? (
            <span className="text-xs font-semibold text-cyber-yellow">COPIED!</span>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-white/90 leading-relaxed font-medium">
        {caption.text}
      </p>
    </motion.div>
  );
};

export const VibeResults: React.FC<VibeResultsProps> = ({ result }) => {
  const [hashtagsCopied, setHashtagsCopied] = useState(false);

  const copyHashtags = () => {
    navigator.clipboard.writeText(result.hashtags.join(' '));
    setHashtagsCopied(true);
    setTimeout(() => setHashtagsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h3 className="text-sm font-display text-cyber-yellow uppercase tracking-[0.3em] mb-2">Detected Vibe</h3>
        <h2 className="text-4xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple via-cyber-pink to-cyber-red italic uppercase">
          {result.vibe}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.captions.map((cap, idx) => (
          <CaptionCard key={idx} caption={cap} index={idx} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-lg tracking-wider text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-yellow animate-pulse" />
            Hashtag Grid
          </h3>
          <button
            onClick={copyHashtags}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 flex items-center gap-2 text-sm font-semibold"
          >
            {hashtagsCopied ? 'STASHED!' : 'COPY ALL'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.hashtags.map((tag, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.02 }}
              className="text-sm font-medium px-3 py-1 bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg text-cyber-blue hover:bg-cyber-blue hover:text-white transition-all duration-300 cursor-pointer"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
