'use client';

import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InitialAPI, ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

// Context shape
interface MidnightContextType {
  walletConnected: boolean;
  walletAddress: string | null;
  walletBalance: string | null;
  isConnecting: boolean;
  networkId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  generateProofAndSubmit: (answers: Record<string, any>, campaignId: string) => Promise<string>;
  deploySmartContract: () => Promise<string>;
}

const MidnightContext = createContext<MidnightContextType | undefined>(undefined);

/**
 * Discovers the first available Midnight wallet provider from window.midnight.
 * Per the official DApp Connector spec, wallets inject under UUID keys.
 */
function discoverWallet(walletId?: string): InitialAPI | null {
  if (typeof window === 'undefined' || !window.midnight) return null;
  
  if (walletId === '1am' && window.midnight['1am']) {
    return window.midnight['1am'] as InitialAPI;
  }
  if (walletId === 'lace' && (window.midnight.mnLace || window.midnight.lace)) {
    return (window.midnight.mnLace || window.midnight.lace) as InitialAPI;
  }
  
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
      return provider as InitialAPI;
    }
  }
  return null;
}

export function MidnightProvider({ children }: { children: React.ReactNode }) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkId, setNetworkId] = useState<string | null>(null);
  const [connectedApi, setConnectedApi] = useState<ConnectedAPI | null>(null);

  // Contract specific state
  const [midnightProviders, setMidnightProviders] = useState<any>(null);
  const [compiledContract, setCompiledContract] = useState<any>(null);
  const [contractAddress, setContractAddress] = useState<string>('');

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
      
      const wallet = discoverWallet(walletId);
      if (!wallet) {
        alert(
          `${walletId === '1am' ? '1A.M.' : 'Lace'} wallet for Midnight not found!\n\n` +
          'Please install the extension and try again.'
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
          'Could not auto-detect your wallet network.\n\n' +
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

      if (connectedNetwork === 'testnet') {
        connectedNetwork = 'preprod';
      }

      setConnectedApi(api);
      setNetworkId(connectedNetwork);
      const { CONTRACT_ADDRESS } = await import('@/config');
      let contractAddress = CONTRACT_ADDRESS;

      try {
        const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
          const { levelPrivateStateProvider } = await import('@midnight-ntwrk/midnight-js-level-private-state-provider');
          const { indexerPublicDataProvider } = await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider');
          const { FetchZkConfigProvider: fetchZkConfigProvider } = await import('@midnight-ntwrk/midnight-js-fetch-zk-config-provider');
          const { httpClientProofProvider } = await import('@midnight-ntwrk/midnight-js-http-client-proof-provider');
          const { Contract } = await import('@/contracts/survey/index.js');
          const { CompiledContract } = await import('@midnight-ntwrk/midnight-js-protocol/compact-js');
          
          const { setNetworkId } = await import('@midnight-ntwrk/midnight-js-network-id');
          
          // Configure global network ID for the Midnight SDK
          setNetworkId(connectedNetwork);

          const config = await api.getConfiguration();
          const zkConfig = new fetchZkConfigProvider(window.location.origin + '/survey-contract/', window.fetch.bind(window));
          
          const shieldedAddresses = await api.getShieldedAddresses();
          
          const walletProvider = {
            getCoinPublicKey: () => shieldedAddresses.shieldedCoinPublicKey,
            getEncryptionPublicKey: () => shieldedAddresses.shieldedEncryptionPublicKey,
            balanceTx: async (tx: any, ttl?: Date) => (await api!.balanceUnsealedTransaction(tx, { payFees: true })).tx,
            submitTx: async (tx: any) => await api!.submitTransaction(tx)
          } as any;

          const providers = {
            privateStateProvider: levelPrivateStateProvider({
              privateStateStoreName: 'survey-state',
              accountId: (await api.getUnshieldedAddress()).unshieldedAddress,
              privateStoragePasswordProvider: () => 'Local-Devnet-Development-Placeholder-1'
            }),
            publicDataProvider: indexerPublicDataProvider(config.indexerUri, config.indexerWsUri),
            zkConfigProvider: zkConfig,
            proofProvider: httpClientProofProvider(process.env.NEXT_PUBLIC_PROOF_SERVER_URL || 'http://127.0.0.1:6300', zkConfig),
            walletProvider,
            midnightProvider: walletProvider
          };

          const compiled = CompiledContract.make('survey', Contract).pipe(
            CompiledContract.withWitnesses({ secretEligibilityHash: () => new Uint8Array(32) }),
            CompiledContract.withCompiledFileAssets('/survey-contract/')
          );
          
          setMidnightProviders(providers);
          setCompiledContract(compiled);
          setContractAddress(contractAddress);

          // We don't save the contract to context immediately because it's stateless, 
          // but we can initialize the logic here to ensure it works
          console.log('[VEIL] Contract Providers configured successfully!');
        } catch (initErr) {
          console.error('[VEIL] Provider initialization failed:', initErr);
        }

      // Get actual wallet address using the official API
      try {
        const addrInfo = await api.getUnshieldedAddress();
        console.log('[VEIL] Wallet address info:', addrInfo);
        setWalletAddress(addrInfo.unshieldedAddress);
      } catch (addrErr: any) {
        if (addrErr?.message?.toLowerCase().includes('locked')) {
          throw new Error('Your wallet is locked. Please open the extension and unlock it first.');
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

      // Fetch Balance
      try {
        const dust = await api.getDustBalance();
        const formattedBalance = (Number(dust.balance) / 1000000).toFixed(2);
        setWalletBalance(formattedBalance);
      } catch (balanceErr) {
        console.warn('[VEIL] Could not fetch dust balance:', balanceErr);
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
      alert(`Failed to connect to Wallet.\nReason: ${error?.message || String(error)}`);
      setConnectionStatus('idle');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    setWalletBalance(null);
    setConnectedApi(null);
    setNetworkId(null);
    console.log('[VEIL] Wallet disconnected.');
  };

  const generateProofAndSubmit = async (answers: Record<string, any>, campaignId: string) => {
    if (!walletConnected || !connectedApi || !walletAddress) {
      alert('Please connect your wallet first!');
      throw new Error('Wallet not connected');
    }
    
    if (!midnightProviders || !compiledContract || !contractAddress) {
      alert('Midnight Smart Contract providers are not initialized!');
      throw new Error('Providers not initialized');
    }
    
    return new Promise<string>(async (resolve, reject) => {
      try {
        // Generate a pseudo-nullifier based on wallet + campaign for ZK double-vote prevention
        const nullifierRaw = `${walletAddress}-${campaignId}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(nullifierRaw);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const nullifier = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);

        // 1. Submit ZK Proof to Midnight Network Smart Contract
        console.log('[VEIL] Constructing Smart Contract Transaction...');
        const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
        
        const contract = await findDeployedContract(midnightProviders, {
          contractAddress,
          compiledContract,
          privateStateId: 'survey-state',
          initialPrivateState: {},
        });

        console.log('[VEIL] Prompting wallet to sign and submit Zero-Knowledge Proof...');
        const tx = await contract.callTx.submitFeedback(BigInt(campaignId), new Uint8Array(hashBuffer));
        console.log('[VEIL] Transaction Successful! TxHash:', tx.public.txHash);

        // 2. Save the answers and transaction hash to our traditional backend database
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, nullifier, campaignId, txHash: tx.public.txHash })
        });
        const resData = await res.json();
        
        if (!resData.success) throw new Error(resData.error);
        resolve(resData.proofId);
      } catch (e: any) {
        console.error('[VEIL] Feedback submission failed', e);
        // Alert the user if the contract rejects the transaction (e.g. double voting)
        if (e.message && e.message.includes('Custom error')) {
           alert('Midnight Network: You have already submitted feedback for this campaign (or contract error).');
        } else {
           alert('Failed to submit ZK proof: ' + e.message);
        }
        reject(e);
      }
    });
  };

  const deploySmartContract = async () => {
    if (!walletConnected || !connectedApi || !walletAddress) {
      alert('Please connect your wallet first!');
      throw new Error('Wallet not connected');
    }
    
    if (!midnightProviders || !compiledContract) {
      alert('Midnight Smart Contract providers are not initialized!');
      throw new Error('Providers not initialized');
    }
    
    return new Promise<string>(async (resolve, reject) => {
      try {
        console.log('[VEIL] Deploying Smart Contract via Midnight Wallet...');
        const { deployContract } = await import('@midnight-ntwrk/midnight-js-contracts');
        
        const deployedContract = await deployContract(midnightProviders, {
          privateStateProvider: midnightProviders.privateStateProvider,
          zkConfigProvider: midnightProviders.zkConfigProvider,
          compilerNetworkId: networkId!,
          contract: (await import('@/contracts/survey/index.js')).Contract,
          compiledContract: compiledContract,
          initialPrivateState: {},
        } as any);

        console.log('[VEIL] Deployment Successful!');
        console.log('[VEIL] Contract Address:', deployedContract.deployTxData.public.contractAddress);
        
        // Update local state
        setContractAddress(deployedContract.deployTxData.public.contractAddress);
        resolve(deployedContract.deployTxData.public.contractAddress);
      } catch (e: any) {
        console.error('[VEIL] Contract deployment failed', e);
        alert('Failed to deploy contract: ' + e.message);
        reject(e);
      }
    });
  };

  return (
    <MidnightContext.Provider value={{ 
      walletConnected, walletAddress, walletBalance, isConnecting, networkId,
      connectWallet, disconnectWallet, generateProofAndSubmit, deploySmartContract 
    }}>
      {children}

      {/* Manual Wallet Selection Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white/70 backdrop-blur-3xl border border-white/50 rounded-3xl p-8 max-w-sm w-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden"
            >
              {/* Glass glare effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-50 pointer-events-none" />
              
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 text-slate-500 hover:text-slate-800 bg-white/50 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center transition-all z-50 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-2 drop-shadow-sm tracking-tight">Connect Wallet</h2>
                <p className="text-sm text-slate-600 mb-8 font-medium">Select your Midnight compatible wallet to authenticate securely.</p>
                
                <div className="space-y-4">
                  {connectionStatus === 'connecting' || connectionStatus === 'success' ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full flex flex-col items-center justify-center p-8 gap-4 rounded-3xl border border-white/60 bg-white/40 shadow-sm backdrop-blur-md"
                    >
                      {connectionStatus === 'connecting' ? (
                        <>
                          <div className="w-12 h-12 rounded-full border-[3px] border-slate-200/50 border-t-slate-800 animate-spin shadow-sm"></div>
                          <span className="font-bold text-slate-800 animate-pulse tracking-wide">Connecting...</span>
                        </>
                      ) : (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <div className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                            <span className="material-symbols-outlined text-3xl">check</span>
                          </div>
                          <span className="font-bold text-green-700 text-lg">Connected!</span>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <>
                      <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => executeConnection('1am')}
                        className="w-full flex items-center justify-between p-4 rounded-3xl border border-white/60 hover:border-white bg-white/40 hover:bg-white/70 transition-all shadow-sm hover:shadow-md group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-inner shadow-black/20 group-hover:scale-110 transition-transform">
                            1
                          </div>
                          <span className="font-bold text-slate-800 text-lg">1A.M. Wallet</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-800 transition-colors">chevron_right</span>
                      </motion.button>

                      <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => executeConnection('lace')}
                        className="w-full flex items-center justify-between p-4 rounded-3xl border border-white/60 hover:border-white bg-white/40 hover:bg-white/70 transition-all shadow-sm hover:shadow-md group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-inner shadow-black/20 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                          </div>
                          <span className="font-bold text-slate-800 text-lg">Lace Wallet</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-800 transition-colors">chevron_right</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
