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
  generateProofAndSubmit: (feedback: string) => Promise<string>;
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

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const wallet = discoverWallet();
      if (!wallet) {
        alert(
          'Lace wallet for Midnight not found!\n\n' +
          'Please install the Lace browser extension from lace.io\n' +
          'and ensure a Midnight account is configured.'
        );
        throw new Error('No Midnight wallet provider found');
      }

      // The wallet's Midnight account is bound to a specific network.
      // We need to discover which network by reading the wallet's config.
      // Try to get the network from the wallet's serviceUriConfig if available,
      // otherwise try known networks in priority order.
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
          // If it's "Unsupported", skip. If it's "mismatch", try next.
          continue;
        }
      }

      if (!api || !connectedNetwork) {
        // Last resort: let the user pick
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

      // Get configuration to extract the network info and display an address
      try {
        const config = await api.getConfiguration();
        console.log('[VEIL] Wallet configuration:', config);
        // Use the substrate node URI domain as a display identifier
        const displayAddr = config.indexerUri 
          ? new URL(config.indexerUri).hostname.split('.')[0]
          : connectedNetwork;
        setWalletAddress(displayAddr);
      } catch {
        // Fallback: just show the network name
        setWalletAddress(connectedNetwork);
      }

      setWalletConnected(true);
      console.log('[VEIL] Wallet connected successfully!');

    } catch (error: any) {
      console.error('[VEIL] Failed to connect wallet:', error);
      alert(`Failed to connect to Lace Wallet.\nReason: ${error?.message || String(error)}`);
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

  const generateProofAndSubmit = async (feedback: string) => {
    if (!walletConnected || !connectedApi) {
      alert('Please connect your wallet first!');
      throw new Error('Wallet not connected');
    }

    // In a full production implementation, we would:
    // 1. Import the CompiledContract from managed/
    // 2. Use connectedApi.getProvingProvider() for ZK proving
    // 3. Call the deployed contract's submitFeedback circuit
    // For this MVP, we simulate the proof generation time.
    
    return new Promise<string>((resolve, reject) => {
      setTimeout(async () => {
        try {
          await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feedback, nullifier: '0xabc123' })
          });
          
          const txHash = 'VF-' + Math.random().toString(16).substring(2, 9).toUpperCase();
          resolve(txHash);
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
