'use client';

import { useState } from 'react';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleConnect = async () => {
    // TODO: Wire up Lace wallet connection via Midnight Wallet API
    setWalletConnected(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback) return;
    
    setIsSubmitting(true);
    // TODO: Generate local ZK Proof and submit transaction to Midnight devnet
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFeedback('');
    }, 2500);
  };

  return (
    <main className="main-container">
      <div className="glow-bg" />
      
      <div className="content-wrapper animate-fade-in">
        <h1 className="hero-title">
          Secure, <span className="text-gradient">Zero-Knowledge</span> Feedback
        </h1>
        
        <p className="hero-subtitle">
          Submit verifiable feedback anonymously. Your identity is cryptographically proven on-chain, but your response remains entirely private.
        </p>

        {!walletConnected ? (
          <div className="glass-panel">
            <div className="icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5H5a2 2 0 0 1 0-4h16v-5" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 500 }}>Connect Wallet</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.875rem' }}>
              Connect your Lace wallet to prove your credentials via the Midnight Network.
            </p>
            <button 
              onClick={handleConnect}
              className="primary-button"
              style={{ marginTop: '1rem' }}
            >
              Connect Lace Wallet
            </button>
          </div>
        ) : (
          <div className="glass-panel">
            {submitted ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
                <div className="icon-circle success">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 500 }}>Feedback Verified & Submitted</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center' }}>
                  Your Zero-Knowledge proof was verified on the Midnight ledger.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="secondary-button"
                  style={{ marginTop: '1rem' }}
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-container">
                <div className="form-header">
                  <h2 className="form-title">Anonymous Survey</h2>
                  <span className="badge">ZK Shield Active</span>
                </div>
                
                <div className="input-group">
                  <label className="input-label">Your Feedback (Private)</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="textarea-input"
                    placeholder="Share your thoughts securely..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={!feedback || isSubmitting}
                  className="primary-button"
                  style={{ marginTop: '0.5rem' }}
                >
                  {isSubmitting ? 'Generating ZK Proof...' : 'Submit Securely'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
