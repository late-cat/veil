'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMidnight } from '@/providers/MidnightProvider';
import { useState, useEffect } from 'react';
import { WalletBadge } from '@/components/WalletBadge';
import { Logo } from '@/components/Logo';

export default function Home() {
  const { walletConnected, isConnecting, connectWallet } = useMidnight();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;



  return (
    <main className="w-full min-h-screen flex flex-col relative">
      
      {/* Navigation */}
      <header className="shrink-0 z-50 bg-[var(--color-cotton-bg)]/80 backdrop-blur-md border-b border-slate-300 shadow-sm felt-texture sticky top-0">
        <nav className="flex flex-col sm:flex-row justify-between items-center w-full px-4 sm:px-[var(--spacing-container-padding)] py-4 max-w-7xl mx-auto">
          <div className="w-full sm:w-auto flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-800">
              <Logo className="text-slate-800" />
              <h1 className="font-headline-md font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 drop-shadow-md">VEIL Protocol</h1>
            </div>
            
            <button 
              className="sm:hidden text-slate-800 p-2 hover:bg-slate-200/50 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-3xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
          
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row gap-4 sm:gap-6 items-center w-full sm:w-auto mt-6 sm:mt-0`}>
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto flex justify-center items-center gap-2 font-label-lg text-slate-700 hover:text-slate-900 transition-colors drop-shadow-sm bg-white/50 px-5 py-2.5 rounded-full inset-puffy border border-slate-200"
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              Dashboard
            </Link>
            
            <div className="w-full sm:w-auto flex justify-center">
              {walletConnected ? (
                <WalletBadge />
              ) : (
                <button 
                  onClick={() => connectWallet()}
                  className="w-full sm:w-auto bg-white text-slate-800 px-6 py-2.5 rounded-full font-label-lg hover:bg-slate-100 transition-all active:scale-95 shadow-sm puffy-shadow felt-texture step-button border border-slate-200"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden">
        {/* Floating background elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 sm:left-20 text-slate-400 opacity-30 drop-shadow-md"
        >
          <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-10 sm:right-32 text-slate-400 opacity-30 drop-shadow-md"
        >
          <span className="material-symbols-outlined text-9xl" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl felt-texture bg-[var(--color-cotton-pink)] rounded-[3rem] puffy-shadow p-8 sm:p-16 flex flex-col gap-8 items-center text-center relative z-10 mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 inset-puffy shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-label-lg text-slate-800 font-bold uppercase tracking-widest text-xs drop-shadow-sm">Midnight Network Active</span>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="font-headline-xl text-5xl sm:text-6xl text-slate-900 drop-shadow-md leading-tight font-bold">
              Your opinion.
            </h1>
            <h1 className="font-headline-xl text-5xl sm:text-6xl text-blue-900 drop-shadow-md leading-tight font-bold">
              Your privacy.
            </h1>
          </div>

          <p className="font-body-lg text-slate-800 max-w-2xl font-medium drop-shadow-sm">
            Collect honest feedback without asking people to sacrifice their privacy. VEIL uses Zero-Knowledge proofs to verify participation while keeping individual responses cryptographically unlinked on the Midnight Blockchain.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mt-4">
            <Link 
              href="/dashboard?tab=create"
              className="bg-slate-800 text-white px-8 py-4 rounded-full font-label-lg text-lg hover:bg-slate-700 transition-all shadow-md puffy-shadow felt-texture step-button flex items-center justify-center gap-2"
            >
              <span>Create Survey</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            
          </div>
        </motion.div>
      </div>

      {/* Realistic Thread Stitch Divider */}
      <div className="w-full h-3 relative z-20 -mt-[1px] opacity-80 mix-blend-luminosity">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stitch-pattern" x="0" y="0" width="32" height="12" patternUnits="userSpaceOnUse">
              {/* Puncture Hole Left */}
              <circle cx="4" cy="6" r="1.5" fill="#000000" opacity="0.25" />
              {/* Puncture Hole Right */}
              <circle cx="24" cy="6" r="1.5" fill="#000000" opacity="0.25" />
              {/* Thread Shadow */}
              <path d="M4,7 L24,7" stroke="#000000" strokeWidth="3" strokeLinecap="round" opacity="0.15" />
              {/* Thread Base */}
              <path d="M4,6 L24,6" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              {/* Thread Highlight */}
              <path d="M5,5.5 L23,5.5" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stitch-pattern)" />
        </svg>
      </div>

      {/* Feature Section */}
      <div className="w-full bg-[var(--color-cotton-lavender)] py-24 felt-texture">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-slate-900 drop-shadow-sm font-bold">Institutional Grade Infrastructure</h2>
            <p className="font-body-md text-slate-700 mt-2 font-medium">Privacy shouldn't come at the cost of trust.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="bg-[var(--color-cotton-blue)] p-10 rounded-[2rem] puffy-shadow flex flex-col items-center text-center gap-4 felt-texture group">
              <div className="w-16 h-16 rounded-full bg-white/50 inset-puffy flex items-center justify-center text-slate-800 mb-2">
                <span className="material-symbols-outlined text-3xl">security</span>
              </div>
              <h3 className="font-headline-md font-bold text-slate-900 drop-shadow-sm">ZK-Shielded Privacy</h3>
              <p className="font-body-md text-slate-800 font-medium">Respondents prove their eligibility without exposing their identity or wallet address.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-[var(--color-cotton-bg)] p-10 rounded-[2rem] puffy-shadow flex flex-col items-center text-center gap-4 felt-texture group">
              <div className="w-16 h-16 rounded-full bg-white/50 inset-puffy flex items-center justify-center text-slate-800 mb-2">
                <span className="material-symbols-outlined text-3xl">fact_check</span>
              </div>
              <h3 className="font-headline-md font-bold text-slate-900 drop-shadow-sm">Verifiable Results</h3>
              <p className="font-body-md text-slate-800 font-medium">Public participation tallies are anchored against cryptographic commitments on Midnight.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-10 rounded-[2rem] puffy-shadow flex flex-col items-center text-center gap-4 felt-texture group">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-cotton-blue)] flex items-center justify-center inset-puffy text-blue-600 mb-6 group-hover:scale-110 transition-transform shadow-sm mx-auto sm:mx-0">
                <span className="material-symbols-outlined text-3xl">add_circle</span>
              </div>
              <h3 className="font-headline-md font-bold text-slate-900 mb-3 drop-shadow-sm text-xl">1. Build Survey</h3>
              <p className="font-body-md text-slate-800 font-medium">Create a survey in 60 seconds and share an elegant one-click link. No coding required.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
