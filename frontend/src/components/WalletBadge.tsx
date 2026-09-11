'use client';
import React, { useState } from 'react';
import { useMidnight } from '@/providers/MidnightProvider';

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
    <button 
      onClick={disconnectWallet}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="flex items-center gap-3 bg-[var(--color-cotton-pink)]/30 hover:bg-red-50 hover:border-red-200 px-4 py-2 rounded-full felt-texture inset-puffy border border-slate-200 transition-all cursor-pointer group shadow-sm"
      title="Click to disconnect"
    >
      {isHovering ? (
        <>
          <span className="material-symbols-outlined text-red-500 text-sm">logout</span>
          <span className="font-label-sm text-red-600 font-bold">Disconnect Wallet</span>
        </>
      ) : (
        <>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          <span className="font-label-sm text-slate-800 font-bold truncate max-w-[200px]">
            {formatAddress(walletAddress)}
            {walletBalance ? ` | ${walletBalance} tDUST` : ''}
          </span>
        </>
      )}
    </button>
  );
}
