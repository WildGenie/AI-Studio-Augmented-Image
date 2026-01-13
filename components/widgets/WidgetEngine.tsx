/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Segment } from '../../types';
import { motion } from 'framer-motion';

interface WidgetProps {
  segment: Segment;
}

// ----------------------------------------------------------------------
// Shared Styles
// ----------------------------------------------------------------------
// Max height set to 80vh to ensure it fits on screen when centered
const GLASS_PANEL = "bg-black/90 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] w-full max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent";

// ----------------------------------------------------------------------
// Sub-components for different formats
// ----------------------------------------------------------------------

const MiniWidget: React.FC<WidgetProps> = ({ segment }) => (
  <motion.div 
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="bg-black/95 backdrop-blur-md border border-cyan-500/30 px-6 py-3 rounded-full flex items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] mx-auto w-fit"
  >
    <span className="text-2xl shrink-0">{segment.icon || '✨'}</span>
    <span className="text-lg font-bold text-white tracking-wide">{segment.label}</span>
  </motion.div>
);

const CompactWidget: React.FC<WidgetProps> = ({ segment }) => (
  <motion.div 
    className={`${GLASS_PANEL} p-6 rounded-2xl relative group`}
  >
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-transparent opacity-70" />
    
    <div className="flex items-start gap-5 mb-4">
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner shrink-0">
        {segment.icon || '🔍'}
      </div>
      <div className="min-w-0 flex-1 pt-1">
        <div className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold mb-1 truncate">{segment.category || 'Concept'}</div>
        <h3 className="font-bold text-white text-2xl leading-tight break-words">{segment.label}</h3>
      </div>
    </div>
    
    <p className="text-base text-gray-300 leading-relaxed font-light">
      {segment.description}
    </p>
  </motion.div>
);

const StatsWidget: React.FC<WidgetProps> = ({ segment }) => (
  <motion.div 
    className={`${GLASS_PANEL} p-6 rounded-2xl relative`}
  >
    <div className="flex justify-between items-center mb-5 pb-5 border-b border-white/5 sticky top-0 bg-black/90 backdrop-blur-xl z-10 -mx-6 px-6 -mt-6 pt-6 rounded-t-2xl">
      <h3 className="font-bold text-white text-xl flex items-center gap-3 truncate pr-2">
        <span className="text-2xl">{segment.icon || '📊'}</span>
        <span className="truncate">{segment.label}</span>
      </h3>
      <div className="px-3 py-1 rounded text-[10px] font-bold bg-purple-500/20 text-purple-200 uppercase tracking-wider border border-purple-500/20 shrink-0">Data</div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      {segment.stats?.map((stat, idx) => (
        <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-cyan-500/30 transition-colors">
            <div className="text-cyan-400 font-mono font-bold text-xl truncate">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mt-1 truncate">{stat.label}</div>
        </div>
      ))}
      {(!segment.stats || segment.stats.length === 0) && (
          <div className="col-span-2 text-sm text-gray-500 italic p-4 text-center">
            Detailed metrics unavailable.
          </div>
      )}
    </div>
    <p className="mt-5 text-sm text-gray-400 border-t border-white/5 pt-4 leading-relaxed">{segment.description}</p>
  </motion.div>
);

const DetailedWidget: React.FC<WidgetProps> = ({ segment }) => (
  <motion.div 
    className={`${GLASS_PANEL} p-0 rounded-2xl flex flex-col`}
  >
    {/* Header */}
    <div className="bg-gradient-to-br from-zinc-900 to-black border-b border-white/10 p-6 relative overflow-hidden shrink-0">
      <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
            <span className="inline-block px-3 py-1 rounded text-[10px] font-bold bg-white/10 text-cyan-200 border border-cyan-500/20 uppercase tracking-wide">
                {segment.category || 'Deep Dive'}
            </span>
            <span className="text-4xl filter drop-shadow-glow shrink-0 ml-3">{segment.icon || '🚀'}</span>
        </div>
        <h3 className="font-bold text-3xl text-white mb-2 leading-tight break-words">{segment.label}</h3>
        <div className="w-16 h-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full" />
      </div>
    </div>

    {/* Content */}
    <div className="p-6 bg-black/40">
      <p className="text-base text-gray-300 leading-relaxed mb-6 font-light">
        {segment.description}
      </p>

      {segment.stats && segment.stats.length > 0 && (
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {segment.stats.map((stat, i) => (
             <div key={i} className="flex-shrink-0 bg-white/5 rounded-lg px-4 py-3 border border-white/5 min-w-[100px]">
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider truncate">{stat.label}</div>
                <div className="text-white font-mono font-medium text-lg truncate">{stat.value}</div>
             </div>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

// ----------------------------------------------------------------------
// Main Factory
// ----------------------------------------------------------------------

export const WidgetEngine: React.FC<WidgetProps> = ({ segment }) => {
  switch (segment.format) {
    case 'mini': return <MiniWidget segment={segment} />;
    case 'stats': return <StatsWidget segment={segment} />;
    case 'detailed': return <DetailedWidget segment={segment} />;
    case 'compact': 
    default: return <CompactWidget segment={segment} />;
  }
};