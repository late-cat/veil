'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// DApp Connector API interfaces
interface MidnightContextType {
  walletConnected: boolean;
  walletAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  generateProofAndSubmit: (feedback: string) => Promise<string>;
}

declare global {
  interface Window {
    cardano?: any;
    midnight?: {
      mnLace?: {
        enable: () => Promise<any>;
      };
      lace?: {
        enable: () => Promise<any>;
      };
      [key: string]: any;
    };
  }
}

const MidnightContext = createContext<MidnightContextType | undefined>(undefined);

export function MidnightProvider({ children }: { children: React.ReactNode }) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletApi, setWalletApi] = useState<any>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    // We intentionally do not auto-connect here so the user has to click the button.
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (typeof window === 'undefined') {
        throw new Error("Cannot connect wallet on server side.");
      }

      // Dynamically check what extensions are injected
      const cardanoKeys = window.cardano ? Object.keys(window.cardano) : [];
      const midnightKeys = window.midnight ? Object.keys(window.midnight) : [];
      console.log("Cardano injected wallets:", cardanoKeys);
      console.log("Midnight injected wallets:", midnightKeys);

      let connector = null;
      let debugOutput = "";
      
      try {
        if (window.midnight) {
          // Deep dump the midnight object
          const dumpObj = (obj: any, depth = 0): string => {
            if (depth > 2 || !obj) return String(obj);
            let out = "";
            for (let k in obj) {
              out += "  ".repeat(depth) + k + ": " + typeof obj[k] + "\n";
            }
            return out;
          };
          debugOutput = dumpObj(window.midnight);

          // Standard checks
          if (window.midnight.mnLace && typeof window.midnight.mnLace.enable === 'function') {
            connector = window.midnight.mnLace;
          } else if (window.midnight.lace && typeof window.midnight.lace.enable === 'function') {
            connector = window.midnight.lace;
          } else {
            // Find any object with an enable or connect method
            for (const key of Object.keys(window.midnight)) {
              const obj = window.midnight[key];
              if (obj && typeof obj.enable === 'function') {
                connector = obj;
                break;
              }
              // NEW MIPD Standard uses .connect()
              if (obj && typeof obj.connect === 'function') {
                connector = {
                  ...obj,
                  enable: (networkId: string) => obj.connect(networkId)
                };
                break;
              }
              if (obj && obj.api && typeof obj.api.enable === 'function') {
                connector = obj.api;
                break;
              }
            }
          }
        }
      } catch(e) {
        debugOutput += "\nError analyzing window.midnight: " + e;
      }

      if (!connector) {
        console.error(debugOutput);
        alert("Wallet structure dump:\n" + debugOutput);
        throw new Error("Lace extension not found or invalid");
      }

      console.log("Requesting access to Lace Wallet...");
      console.log("Wallet provider info:", JSON.stringify({
        name: connector.name,
        rdns: connector.rdns,
        apiVersion: connector.apiVersion,
        keys: Object.keys(connector)
      }));
      
      // Try connecting with different network IDs until one works
      // 'midnight' added because Lace shows "Midnight" as the network name
      const networkIds = ['midnight', 'Midnight', 'undeployed', 'preview', 'preprod', 'testnet', 'mainnet', 'devnet', 'qanet'];
      let api = null;
      let lastError = null;
      
      for (const networkId of networkIds) {
        try {
          console.log(`Trying network: ${networkId}...`);
          api = await connector.enable(networkId);
          console.log(`Connected successfully with network: ${networkId}`);
          break;
        } catch (e: any) {
          console.warn(`Network ${networkId} failed:`, e?.message || e);
          lastError = e;
        }
      }
      
      if (!api) {
        throw lastError || new Error("Could not connect to any supported network");
      }
      setWalletApi(api);
      
      // Get the wallet state to retrieve the address
      const state = await api.state();
      
      // Convert the raw address to a hex string for display purposes
      const addressBytes = state.address;
      // Depending on the version, address might be a string, a buffer, or a Uint8Array.
      let addressString = "0x";
      if (typeof addressBytes === 'string') {
        addressString = addressBytes;
      } else if (addressBytes) {
        const arr = new Uint8Array(addressBytes);
        addressString = "0x" + Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
      } else {
        addressString = "0xUnknownAddress";
      }

      setWalletAddress(addressString);
      setWalletConnected(true);
      console.log("Successfully connected to Lace Wallet!");

    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      alert(`Failed to connect to Lace Wallet.\nReason: ${error?.message || String(error)}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const generateProofAndSubmit = async (feedback: string) => {
    if (!walletConnected || !walletApi) {
      alert("Please connect your wallet first!");
      throw new Error("Wallet not connected");
    }

    // In a full production implementation, we would import the CompiledContract here,
    // instantiate the providers using the injected DApp connector API (walletApi),
    // and invoke the deployed.callTx.submitFeedback(nullifier).
    // For this MVP, we simulate the cryptography and network consensus time.
    
    return new Promise<string>((resolve, reject) => {
      setTimeout(async () => {
        try {
          await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feedback, nullifier: '0xabc123' })
          });
          
          // Generate a pseudo-random transaction hash to represent the Midnight tx
          const txHash = 'VF-' + Math.random().toString(16).substring(2, 9).toUpperCase();
          resolve(txHash);
        } catch (e) {
          console.error("Mock DB push failed", e);
          reject(e);
        }
      }, 3500); 
    });
  };

  return (
    <MidnightContext.Provider value={{ walletConnected, walletAddress, isConnecting, connectWallet, generateProofAndSubmit }}>
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
