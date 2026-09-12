'use client';
import React, { useState } from 'react';
import { useMidnight } from '@/providers/MidnightProvider';

export default function AdminPage() {
  const { walletConnected, connectWallet, deploySmartContract } = useMidnight();
  const [status, setStatus] = useState<'idle' | 'deploying' | 'deployed' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDeploy = async () => {
    if (!walletConnected) return;
    setStatus('deploying');
    setErrorMsg(null);

    try {
      const contractAddress = await deploySmartContract();
      setDeployedAddress(contractAddress);
      setStatus('deployed');
    } catch (e: any) {
      console.error('Deployment failed:', e);
      setStatus('error');
      setErrorMsg(e?.message ?? String(e));
    }
  };

  const copyAddress = () => {
    if (!deployedAddress) return;
    navigator.clipboard.writeText(deployedAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!walletConnected) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Admin Deployment Portal</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Please connect your 1A.M. or Lace wallet on the Preprod network to deploy the latest VEIL contract.
        </p>
        <button onClick={connectWallet} className="primary-button" style={{ padding: '12px 32px', fontSize: '1.1rem' }}>
          Connect Wallet to Deploy
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Contract Deployment</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Deploy a new instance of the VEIL survey contract to Midnight Preprod.
      </p>

      <div style={{ padding: '32px', border: '1px solid var(--border-color)', borderRadius: '16px', background: 'var(--bg-secondary)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-primary)' }}>Deployer Panel</h2>

        {status === 'idle' || status === 'error' ? (
          <button
            onClick={handleDeploy}
            className="primary-button"
            style={{ width: '100%', padding: '16px', fontSize: '1.2rem', fontWeight: 'bold' }}
          >
            Deploy Contract to Preprod
          </button>
        ) : status === 'deploying' ? (
          <button className="primary-button" style={{ width: '100%', padding: '16px', fontSize: '1.2rem', opacity: 0.7 }} disabled>
            Deploying... Please approve the transaction in your wallet
          </button>
        ) : (
          <div style={{ padding: '24px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', color: '#065f46' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '1.2rem' }}>
              ✓ Successfully Deployed!
            </div>
            <p style={{ marginBottom: '12px' }}>Your new Contract Address is:</p>
            <div style={{ fontFamily: 'monospace', background: '#d1fae5', padding: '16px', borderRadius: '8px', wordBreak: 'break-all', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem' }}>{deployedAddress}</span>
              <button 
                onClick={copyAddress} 
                style={{ 
                  cursor: 'pointer', 
                  background: 'none', 
                  border: '1px solid #065f46', 
                  color: '#065f46',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {status === 'error' && errorMsg && (
          <div style={{ marginTop: '24px', padding: '20px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#991b1b' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>Deployment Failed</div>
            <p style={{ fontFamily: 'monospace', wordBreak: 'break-all', opacity: 0.9 }}>{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
