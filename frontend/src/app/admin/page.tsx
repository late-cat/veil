'use client';
import React, { useState, useCallback } from 'react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenDeployTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { useWallet } from '@/contexts/WalletContext';
import { Contract } from '@/contracts/survey/index.js';

function getCompiledContract() {
  const assetUrl = new URL('/managed/survey', window.location.origin).toString();
  return CompiledContract.make('survey', Contract as any).pipe(
    // @ts-expect-error bypass SDK generic typings
    CompiledContract.withWitnesses({
      secretEligibilityHash: (context: any) => [context.privateState, new Uint8Array(32)],
    }),
    CompiledContract.withCompiledFileAssets(assetUrl),
  ) as any;
}

export default function AdminPage() {
  const { session, isConnected, connect, networkId } = useWallet();
  const [status, setStatus] = useState<'idle' | 'deploying' | 'deployed' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('DEPLOYED_CONTRACT_ADDRESS') : null
  );
  const [copied, setCopied] = useState(false);

  const handleDeploy = useCallback(async () => {
    if (!session || !isConnected) return;
    setStatus('deploying');
    setErrorMsg(null);

    try {
      const compiledContract = getCompiledContract();
      const initialPrivateState = {};

      const deployTxData = await createUnprovenDeployTx(session.providers as any, {
        compiledContract,
        args: [],
        initialPrivateState,
      } as any);

      const contractAddress = deployTxData.public.contractAddress;

      await submitTxAsync(session.providers as any, {
        unprovenTx: deployTxData.private.unprovenTx,
      });

      setDeployedAddress(contractAddress);
      localStorage.setItem('DEPLOYED_CONTRACT_ADDRESS', contractAddress);
      setStatus('deployed');
    } catch (e: any) {
      console.error('Deployment failed:', e);
      setStatus('error');
      setErrorMsg(e?.message ?? String(e));
    }
  }, [session, isConnected]);

  const copyAddress = () => {
    if (!deployedAddress) return;
    navigator.clipboard.writeText(deployedAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center mt-20 text-slate-800">
        <span className="material-symbols-outlined text-5xl mb-4 text-slate-400">admin_panel_settings</span>
        <h2 className="text-2xl font-bold mb-2">Admin Deployment Portal</h2>
        <p className="text-slate-600 mb-6">Please connect your 1AM wallet on the Preprod network to deploy.</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold" onClick={() => connect('preprod')}>
          Connect 1AM Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-2 text-slate-900">Contract Deployment</h1>
      <p className="text-slate-600 mb-8">Deploy a new instance of the survey contract to Midnight {networkId}.</p>

      <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
          <span className="material-symbols-outlined">rocket_launch</span> Deployer Panel
        </h2>

        {status === 'idle' || status === 'error' ? (
          <button
            className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-lg transition"
            onClick={handleDeploy}
          >
            Deploy Contract to {networkId}
          </button>
        ) : status === 'deploying' ? (
          <button className="w-full py-3 bg-blue-400 text-white font-bold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed" disabled>
            <span className="material-symbols-outlined animate-spin">refresh</span>
            Deploying... Please approve in your 1AM wallet
          </button>
        ) : (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <div className="flex items-center gap-2 font-bold mb-2">
              <span className="material-symbols-outlined">check_circle</span> Successfully Deployed!
            </div>
            <div className="text-sm font-mono break-all bg-green-100 p-3 rounded flex items-center justify-between gap-2 border border-green-200">
              <span>{deployedAddress}</span>
              <button onClick={copyAddress} className="hover:text-green-900">
                <span className="material-symbols-outlined text-lg">content_copy</span>
              </button>
            </div>
            {copied && <span className="text-xs text-green-600 mt-2 block font-medium">Copied to clipboard!</span>}
            <a
              href={`https://${networkId}.midnightexplorer.com/contracts/${deployedAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-4 font-medium"
            >
              View on Midnight Explorer <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        )}

        {status === 'error' && errorMsg && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <div className="flex items-center gap-2 font-bold mb-1">
              <span className="material-symbols-outlined">error</span> Deployment Failed
            </div>
            <p className="text-sm break-words font-mono mt-2 bg-red-100 p-2 rounded">{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
