/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingPhrases = [
  "Synthesizing visuals...",
  "Rendering atmosphere...",
  "Composing cinematic scene...",
  "Applying artistic grading...",
  "Finalizing render..."
];

export const LoadingState: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col items-center">
      {/* The Gray Screen / Skeleton Card */}
      <div className="w-full aspect-video bg-zinc-900/40 rounded-xl border border-white/5 relative overflow-hidden shadow-2xl backdrop-blur-sm">
        
        {/* Shimmer/Scan Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center Pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
             <motion.div 
               animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.95, 1.05, 0.95] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="w-32 h-32 rounded-full bg-white/5 blur-3xl"
             />
        </div>
      </div>

      {/* Rotating Text */}
      <div className="mt-8 h-8 relative flex justify-center items-center w-full overflow-hidden perspective-500">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 15, opacity: 0, rotateX: 90 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: -15, opacity: 0, rotateX: -90 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="text-gray-500 font-mono text-xs md:text-sm tracking-[0.2em] uppercase absolute text-center"
          >
            {loadingPhrases[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};