/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { GeneratedImage, AnalysisResult } from '../types';
import { WidgetEngine } from './widgets/WidgetEngine';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  image: GeneratedImage;
  analysis?: AnalysisResult | null;
  isScanning?: boolean;
}

export const AugmentedCanvas: React.FC<Props> = ({ image, analysis, isScanning = false }) => {
  const [activeSegmentId, setActiveSegmentId] = useState<number | null>(null);
  
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveSegmentId(index);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveSegmentId(null);
    }, 300);
  };

  const activeSegment = activeSegmentId !== null && analysis?.segments ? analysis.segments[activeSegmentId] : null;

  return (
    <div className="w-full h-full flex items-center justify-center p-2 md:p-4 relative">
      
      {/* Container Wrapper */}
      <div 
        ref={containerRef}
        className={`relative max-w-full max-h-full shadow-2xl rounded-xl border border-white/10 bg-gray-900 group ${isScanning ? 'overflow-hidden' : ''}`}
        style={{ aspectRatio: '16 / 9' }}
      >
        
        {/* The Image */}
        <img 
          src={`data:${image.mimeType};base64,${image.base64}`} 
          alt="Generated Infographic"
          className={`w-full h-full object-contain rounded-xl transition-all duration-700 ease-in-out ${activeSegmentId !== null ? 'blur-[3px] opacity-50 scale-[1.01]' : 'opacity-100 scale-100'}`}
        />

        {/* Focus Darkening Overlay */}
        <div className={`absolute inset-0 bg-black/60 rounded-xl transition-opacity duration-300 pointer-events-none ${activeSegmentId !== null ? 'opacity-100' : 'opacity-0'}`} />

        {/* SCANNING MODE OVERLAY */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 overflow-hidden bg-zinc-900/60 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-32 h-32 rounded-full bg-white/10 blur-3xl"
                  />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Hitboxes Layer */}
        {!isScanning && analysis?.segments && analysis.segments.map((segment, index) => {
          const isActive = activeSegmentId === index;
          
          return (
            <div
              key={index}
              style={{
                left: `${segment.bounds.x}%`,
                top: `${segment.bounds.y}%`,
                width: `${segment.bounds.width}%`,
                height: `${segment.bounds.height}%`,
              }}
              className={`absolute ${isActive ? 'z-40' : 'z-30'}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: isActive ? 1.05 : 1,
                  borderColor: isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.15)',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                }}
                className="w-full h-full border-2 rounded-lg cursor-pointer transition-colors duration-300 relative"
              >
                  {!isActive && activeSegmentId === null && (
                      <>
                        <div className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
                        <div className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 bg-cyan-400 rounded-full" />
                      </>
                  )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* CENTERED MODAL OVERLAY */}
      <AnimatePresence>
        {activeSegment && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          >
            <motion.div
              key="modal-container"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="pointer-events-auto w-full max-w-lg"
              onMouseEnter={() => activeSegmentId !== null && handleMouseEnter(activeSegmentId)}
              onMouseLeave={handleMouseLeave}
            >
              <WidgetEngine segment={activeSegment} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};