'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Mocking Midnight SDK for the UI layer while keeping the architecture realistic
interface MidnightContextType {
  walletConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  generateProofAndSubmit: (feedback: string) => Promise<string>;
}

const MidnightContext = createContext<MidnightContextType | undefined>(undefined);

export function MidnightProvider({ children }: { children: React.ReactNode }) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    // In a real implementation, this interacts with the Lace Wallet extension via @midnight-ntwrk/wallet-sdk
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setWalletConnected(true);
        setWalletAddress('0x8A...42F');
        resolve();
      }, 800);
    });
  };

  const generateProofAndSubmit = async (feedback: string) => {
    // This mocks the complex 4-step sequence defined in the VEIL blueprint
    // 1. Encrypt Response -> 2. Generate ZK Proof -> 3. Verify Eligibility -> 4. Submit TX
    return new Promise<string>((resolve) => {
      setTimeout(async () => {
        // Mock pushing the raw feedback to our Vercel API backend securely
        try {
          await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feedback, nullifier: '0xabc123' })
          });
        } catch (e) {
          console.error("Mock DB push failed", e);
        }
        resolve('VF-7A92B41');
      }, 3500); // Takes 3.5 seconds to simulate proof generation
    });
  };

  return (
    <MidnightContext.Provider value={{ walletConnected, walletAddress, connectWallet, generateProofAndSubmit }}>
      {children}
    </MidnightContext.Provider>
  );
}

export function useMidnight() {
  const context = useContext(MidnightContext);
  if (context === undefined) {
    throw new Error('useMidnight must be used within a MidnightProvider');
  }
  return context;
}
