
import React from 'react';
import { motion } from 'framer-motion';

export const LoadingShimmer: React.FC = () => {
  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto mt-12">
      <div className="h-10 w-48 glass-card rounded-lg shimmer mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="h-40 glass-card rounded-2xl p-6 space-y-3 relative overflow-hidden"
          >
            <div className="shimmer absolute inset-0 opacity-20" />
            <div className="h-4 w-20 bg-white/10 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-3/4 bg-white/5 rounded" />
          </motion.div>
        ))}
      </div>
      <div className="h-32 glass-card rounded-2xl p-6 shimmer opacity-50" />
    </div>
  );
};
