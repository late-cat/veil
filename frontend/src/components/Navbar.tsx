'use client';

import React from 'react';
import { useMidnight } from '@/providers/MidnightProvider';

export function Navbar() {
  const { walletConnected, walletAddress, isConnecting, connectWallet, disconnectWallet } = useMidnight();

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5H5a2 2 0 0 1 0-4h16v-5" />
        </svg>
        VEIL
      </div>
      <div className="nav-links">
        <a href="#" className="nav-link">How it Works</a>
        <a href="#" className="nav-link">Privacy Model</a>
        <a href="#" className="nav-link">Verify Proof</a>
        <a href="#" className="nav-link">For Organizations</a>
        
        <div style={{ marginLeft: '1rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)' }}>
          {walletConnected ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'var(--bg-secondary)', 
              padding: '8px 16px', 
              borderRadius: '999px',
              border: '1px solid var(--border-highlight)',
              boxShadow: 'var(--shadow-inner)'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#558763' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 500, fontFamily: 'monospace' }}>
                {formatAddress(walletAddress)}
              </span>
            </div>
          ) : (
            <button 
              onClick={connectWallet} 
              disabled={isConnecting}
              className="primary-button" 
              style={{ padding: '8px 24px', fontSize: '0.9rem', width: 'auto' }}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
