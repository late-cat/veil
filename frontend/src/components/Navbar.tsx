'use client';

import React from 'react';
import Link from 'next/link';
import { useMidnight } from '@/providers/MidnightProvider';

export function Navbar() {
  const { walletConnected, walletAddress, isConnecting, connectWallet, disconnectWallet } = useMidnight();

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    if (addr.length > 16) return `${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}`;
    return addr;
  };

  return (
    <nav className="navbar">
      <Link href="/" className="nav-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5H5a2 2 0 0 1 0-4h16v-5" />
        </svg>
        VEIL
      </Link>
      <div className="nav-links">
        <Link href="/how-it-works" className="nav-link">How it Works</Link>
        <Link href="/privacy-model" className="nav-link">Privacy Model</Link>
        <Link href="/verify-proof" className="nav-link">Verify Proof</Link>
        <Link href="/organizations" className="nav-link">For Organizations</Link>
        
        <div style={{ marginLeft: '1rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)' }}>
          {walletConnected ? (
            <button
              onClick={disconnectWallet}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                background: 'var(--bg-secondary)', 
                padding: '8px 16px', 
                borderRadius: '999px',
                border: '1px solid var(--border-highlight)',
                boxShadow: 'var(--shadow-inner)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
              }}
              title="Click to disconnect"
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#558763' }} />
              <span style={{ fontWeight: 500, fontFamily: 'monospace' }}>
                {formatAddress(walletAddress)}
              </span>
            </button>
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
