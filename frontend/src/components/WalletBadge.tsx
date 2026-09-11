'use client';
import React, { useState } from 'react';
import { useMidnight } from '@/providers/MidnightProvider';
import { motion, AnimatePresence } from 'framer-motion';

export function WalletBadge() {
  const { walletConnected, walletAddress, walletBalance, disconnectWallet } = useMidnight();
  const [isHovering, setIsHovering] = useState(false);

  if (!walletConnected) return null;

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    if (addr.length > 12) return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    return addr;
  };

  return (
    <motion.button 
      onClick={disconnectWallet}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden flex items-center justify-center w-auto min-w-[200px] h-[44px] px-6 rounded-full transition-all cursor-pointer group shadow-lg backdrop-blur-xl border ${
        isHovering 
          ? 'bg-red-500/10 border-red-500/30 text-red-600 hover:shadow-red-500/20' 
          : 'bg-white/40 border-white/60 text-slate-800 hover:bg-white/50'
      }`}
      title="Click to disconnect"
    >
      {/* Liquid Glass Shine Effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
      
      <AnimatePresence mode="wait">
        {isHovering ? (
          <motion.div 
            key="disconnect"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center gap-2 z-10 w-full absolute inset-0"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="font-label-sm font-bold tracking-wide">Disconnect</span>
          </motion.div>
        ) : (
          <motion.div 
            key="status"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center gap-3 z-10 w-full absolute inset-0 px-5"
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.8)]"></span>
            <span className="font-label-sm font-bold tracking-wide flex items-center gap-2 whitespace-nowrap">
              {formatAddress(walletAddress)}
              {walletBalance && <span className="px-2 py-0.5 rounded-md bg-white/50 border border-white/60 text-xs font-mono shadow-inner">{walletBalance} tDUST</span>}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
