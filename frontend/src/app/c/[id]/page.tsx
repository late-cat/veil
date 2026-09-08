'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useMidnight } from '@/providers/MidnightProvider';

interface Campaign {
  id: string;
  title: string;
  description: string;
}

export default function CampaignSurvey() {
  const params = useParams();
  const campaignId = params.id as string;
  
  const { walletConnected, walletAddress, connectWallet, generateProofAndSubmit } = useMidnight();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [feedback, setFeedback] = useState('');
  
  const [stage, setStage] = useState<'LOADING' | 'NOT_FOUND' | 'IDLE' | 'CONNECTING' | 'FORM' | 'PROVING' | 'SUCCESS'>('LOADING');
  const [proofProgress, setProofProgress] = useState(0);
  const [proofId, setProofId] = useState<string | null>(null);

  useEffect(() => {
    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  useEffect(() => {
    if (walletConnected && stage === 'IDLE') {
      setStage('FORM');
    }
  }, [walletConnected, stage]);

  const fetchCampaign = async () => {
    try {
      const res = await fetch(`/api/campaigns?id=${campaignId}`);
      const data = await res.json();
      if (data.found) {
        setCampaign(data.campaign);
        setStage(walletConnected ? 'FORM' : 'IDLE');
      } else {
        setStage('NOT_FOUND');
      }
    } catch {
      setStage('NOT_FOUND');
    }
  };

  const handleConnect = async () => {
    setStage('CONNECTING');
    await connectWallet();
    setStage('FORM');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback) return;
    
    setStage('PROVING');
    
    // Animate the proof progress text over the 3.5 seconds for MVP simulation
    const interval = setInterval(() => {
      setProofProgress(p => Math.min(p + 1, 3));
    }, 800);

    try {
      // In a real app, generateProofAndSubmit would take the campaignId to generate the scoped nullifier
      // For MVP, we pass it down to the API
      const id = await generateProofAndSubmit(feedback, campaignId);
      setProofId(id);
      setStage('SUCCESS');
      setFeedback('');
    } catch (e) {
      console.error(e);
      setStage('FORM');
      alert("Submission failed. Ensure wallet is connected on the correct network.");
    } finally {
      clearInterval(interval);
    }
  };

  const progressMessages = [
    "Encrypting response...",
    "Generating Zero-Knowledge proof...",
    "Verifying eligibility against ledger...",
    "Submitting transaction..."
  ];

  if (stage === 'LOADING') return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading campaign...</div>;
  
  if (stage === 'NOT_FOUND') return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Campaign Not Found</h2>
      <p style={{ color: 'var(--text-secondary)' }}>The link you followed may be broken or expired.</p>
    </div>
  );

  return (
    <main className="main-content">
      <div className="content-wrapper animate-fade-in" style={{ maxWidth: '700px' }}>
        
        {stage !== 'FORM' && stage !== 'SUCCESS' && stage !== 'PROVING' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <h1 className="hero-title" style={{ fontSize: '2rem' }}>
              {campaign?.title}
            </h1>
            <p className="hero-subtitle">
              {campaign?.description}
            </p>
          </div>
        )}

        <div className="soft-panel">
          {!walletConnected && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '1.5rem', padding: '2rem 0' }}>
              <div className="icon-circle pulse-animation">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5H5a2 2 0 0 1 0-4h16v-5" />
                </svg>
              </div>
              <h2 className="serif-text" style={{ fontSize: '1.8rem', textAlign: 'center' }}>Ready to submit?</h2>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1rem', maxWidth: '300px' }}>
                Please connect your Lace wallet using the button in the top right corner to verify your eligibility securely.
              </p>
            </div>
          )}

          {stage === 'FORM' && (
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-header">
                <div>
                  <h2 className="form-title">{campaign?.title}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Anonymous evaluation</p>
                </div>
                <span className="badge">ZK Shield Active</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  Eligibility verified (<span style={{ fontFamily: 'monospace' }}>{walletAddress}</span>)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Response remains private
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Your Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="textarea-input"
                  placeholder="Share your thoughts securely..."
                />
              </div>

              <button type="submit" disabled={!feedback} className="primary-button" style={{ marginTop: '0.5rem' }}>
                Submit Privately
              </button>
            </form>
          )}

          {stage === 'PROVING' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '2rem', padding: '2rem 0' }}>
              <div className="icon-circle pulse-animation">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 className="serif-text" style={{ fontSize: '1.5rem' }}>Protecting your response</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
                {progressMessages.map((msg, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: index <= proofProgress ? 1 : 0.3, transition: 'opacity 0.3s ease' }}>
                    <div style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
                      {index < proofProgress ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#558763" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      ) : index === proofProgress ? (
                        <div style={{ width: '12px', height: '12px', border: '2px solid var(--text-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--border-color)' }} />
                      )}
                    </div>
                    <span style={{ fontSize: '0.9rem' }}>{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage === 'SUCCESS' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '1.5rem', padding: '1rem 0' }}>
              <div className="icon-circle success">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="serif-text" style={{ fontSize: '2rem' }}>Response verified ✓</h2>
              
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', margin: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Survey</span>
                  <span style={{ fontWeight: 500 }}>{campaign?.title}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Eligibility</span>
                  <span style={{ color: '#558763', fontWeight: 500 }}>✓ PROVEN</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Response</span>
                  <span style={{ color: 'var(--text-accent)', fontWeight: 500 }}>🔒 PRIVATE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Proof ID</span>
                  <span style={{ fontFamily: 'monospace' }}>{proofId}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <a href={`/verify-proof`} className="primary-button" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
                  View Network Proof
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </main>
  );
}
