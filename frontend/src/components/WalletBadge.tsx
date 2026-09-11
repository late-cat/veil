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

  const formatBalance = (bal: string | null) => {
    if (!bal) return '';
    const num = parseFloat(bal);
    if (isNaN(num)) return '';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  return (
    <motion.button 
      onClick={disconnectWallet}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden flex items-center justify-center h-[44px] px-6 rounded-full transition-all cursor-pointer group shadow-sm border ${
        isHovering 
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 inset-puffy' 
          : 'bg-white text-slate-800 border-white/60 puffy-shadow felt-texture hover:bg-slate-50'
      }`}
      title="Click to disconnect"
    >
      <AnimatePresence mode="wait">
        {isHovering ? (
          <motion.div 
            key="disconnect"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center gap-2"
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
            className="flex items-center justify-center gap-3"
          >
            <span className="w-2 h-2 rounded-full shrink-0 bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
            <span className="font-label-sm font-bold tracking-wide flex items-center gap-2 whitespace-nowrap">
              {formatAddress(walletAddress)}
              {walletBalance && (
                <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-100 text-slate-600 text-xs font-mono shadow-inner tracking-tight">
                  {formatBalance(walletBalance)} tDUST
                </span>
              )}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
