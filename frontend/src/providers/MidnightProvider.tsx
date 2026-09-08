'use client';

import React, { createContext, useContext, useState } from 'react';
import type { InitialAPI, ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

// Context shape
interface MidnightContextType {
  walletConnected: boolean;
  walletAddress: string | null;
  isConnecting: boolean;
  networkId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  generateProofAndSubmit: (answers: Record<string, any>, campaignId: string) => Promise<string>;
}

const MidnightContext = createContext<MidnightContextType | undefined>(undefined);

/**
 * Discovers the first available Midnight wallet provider from window.midnight.
 * Per the official DApp Connector spec, wallets inject under UUID keys.
 */
function discoverWallet(): InitialAPI | null {
  if (typeof window === 'undefined' || !window.midnight) return null;
  
  const keys = Object.keys(window.midnight);
  console.log('[VEIL] Discovered window.midnight keys:', keys);
  
  for (const key of keys) {
    const provider = window.midnight[key];
    if (provider && typeof provider.connect === 'function') {
      console.log(`[VEIL] Found wallet provider under key "${key}":`, {
        name: provider.name,
        apiVersion: provider.apiVersion,
        rdns: provider.rdns,
      });
      return provider;
    }
  }
  return null;
}

export function MidnightProvider({ children }: { children: React.ReactNode }) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkId, setNetworkId] = useState<string | null>(null);
  const [connectedApi, setConnectedApi] = useState<ConnectedAPI | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success'>('idle');

  const connectWallet = async () => {
    setConnectionStatus('idle');
    setShowModal(true);
  };

  const executeConnection = async (walletId: string) => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    try {
      // Simulate connection delay for visual feedback
      await new Promise(r => setTimeout(r, 1000));
      
      const wallet = discoverWallet();
      if (!wallet) {
        alert(
          'Lace wallet for Midnight not found!\n\n' +
          'Please install the Lace browser extension from lace.io\n' +
          'and ensure a Midnight account is configured.'
        );
        throw new Error('No Midnight wallet provider found');
      }

      const networksToTry = ['undeployed', 'preview', 'preprod', 'mainnet'];
      let api: ConnectedAPI | null = null;
      let connectedNetwork: string | null = null;

      for (const net of networksToTry) {
        try {
          console.log(`[VEIL] Attempting connect with network: ${net}`);
          api = await wallet.connect(net);
          connectedNetwork = net;
          console.log(`[VEIL] ✓ Connected on network: ${net}`);
          break;
        } catch (e: any) {
          const msg = e?.message || String(e);
          console.warn(`[VEIL] ✗ Network ${net}: ${msg}`);
          continue;
        }
      }

      if (!api || !connectedNetwork) {
        const userNetwork = prompt(
          'Could not auto-detect your Lace wallet network.\n\n' +
          'Please enter the network your Midnight account is configured for:\n' +
          '(undeployed, preview, preprod, mainnet)'
        );
        if (userNetwork) {
          api = await wallet.connect(userNetwork.trim().toLowerCase());
          connectedNetwork = userNetwork.trim().toLowerCase();
        } else {
          throw new Error('Connection cancelled by user');
        }
      }

      setConnectedApi(api);
      setNetworkId(connectedNetwork);

      // Get actual wallet address using the official API
      try {
        const addrInfo = await api.getUnshieldedAddress();
        console.log('[VEIL] Wallet address info:', addrInfo);
        setWalletAddress(addrInfo.unshieldedAddress);
      } catch (addrErr: any) {
        if (addrErr?.message?.toLowerCase().includes('locked')) {
          throw new Error('Your wallet is locked. Please open the Lace extension and unlock it first.');
        }
        console.warn('[VEIL] Could not get unshielded address, trying shielded:', addrErr);
        try {
          const shielded = await api.getShieldedAddresses();
          console.log('[VEIL] Shielded addresses:', shielded);
          setWalletAddress(shielded.shieldedAddress || connectedNetwork);
        } catch {
          setWalletAddress(`${connectedNetwork}-connected`);
        }
      }

      setWalletConnected(true);
      console.log('[VEIL] Wallet connected successfully!');
      
      // Show success in modal before closing
      setConnectionStatus('success');
      setTimeout(() => {
        setShowModal(false);
      }, 1000);

    } catch (error: any) {
      console.error('[VEIL] Failed to connect wallet:', error);
      alert(`Failed to connect to Lace Wallet.\nReason: ${error?.message || String(error)}`);
      setConnectionStatus('idle');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    setConnectedApi(null);
    setNetworkId(null);
    console.log('[VEIL] Wallet disconnected.');
  };

  const generateProofAndSubmit = async (answers: Record<string, any>, campaignId: string) => {
    if (!walletConnected || !connectedApi || !walletAddress) {
      alert('Please connect your wallet first!');
      throw new Error('Wallet not connected');
    }
    
    return new Promise<string>((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Generate a pseudo-nullifier based on wallet + campaign for ZK double-vote prevention
          const nullifierRaw = `${walletAddress}-${campaignId}`;
          const encoder = new TextEncoder();
          const data = encoder.encode(nullifierRaw);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const nullifier = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);

          const res = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers, nullifier, campaignId })
          });
          const resData = await res.json();
          
          if (!resData.success) throw new Error(resData.error);
          resolve(resData.proofId);
        } catch (e) {
          console.error('[VEIL] Feedback submission failed', e);
          reject(e);
        }
      }, 3500); 
    });
  };

  return (
    <MidnightContext.Provider value={{ 
      walletConnected, walletAddress, isConnecting, networkId,
      connectWallet, disconnectWallet, generateProofAndSubmit 
    }}>
      {children}

      {/* Manual Wallet Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Connect Wallet</h2>
            <p className="text-sm text-slate-600 mb-6">Select your Midnight compatible wallet to authenticate securely.</p>
            
            <div className="space-y-3">
              {connectionStatus === 'connecting' || connectionStatus === 'success' ? (
                <div className="w-full flex flex-col items-center justify-center p-8 gap-4 rounded-2xl border border-slate-200 bg-slate-50">
                  {connectionStatus === 'connecting' ? (
                    <>
                      <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin"></div>
                      <span className="font-bold text-slate-700 animate-pulse">Connecting to Lace...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">check_circle</span>
                      </div>
                      <span className="font-bold text-green-700">Connected!</span>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => executeConnection('lace')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                      </div>
                      <span className="font-bold text-slate-800">Lace Wallet</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                  </button>

                  <button 
                    disabled
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined">extension</span>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-slate-600">Nightly</span>
                        <span className="text-xs text-slate-500">Coming soon</span>
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
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
