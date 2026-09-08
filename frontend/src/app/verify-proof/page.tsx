'use client';

import { useState } from 'react';

interface ProofRecord {
  nullifier: string;
  feedback: string;
  timestamp: string;
  status: string;
}

export default function VerifyProof() {
  const [proofId, setProofId] = useState('');
  const [result, setResult] = useState<ProofRecord | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofId.trim()) return;
    
    setSearching(true);
    setResult(null);
    setNotFound(false);

    try {
      const res = await fetch(`/api/feedback?proofId=${encodeURIComponent(proofId.trim())}`);
      const data = await res.json();
      
      if (data.found) {
        setResult(data.record);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className="main-content">
      <div className="content-wrapper animate-fade-in" style={{ maxWidth: '700px' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Verify a Proof
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: '3rem' }}>
          Enter a Proof ID to verify that a submission was recorded on the network.
        </p>

        <div className="soft-panel" style={{ padding: '2rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={proofId}
              onChange={(e) => setProofId(e.target.value)}
              placeholder="Enter Proof ID (e.g. VF-A3B2C1D)"
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                fontSize: '0.95rem',
                fontFamily: 'monospace',
                outline: 'none',
                color: 'var(--text-primary)',
              }}
            />
            <button type="submit" className="primary-button" style={{ width: 'auto', padding: '12px 24px' }} disabled={searching}>
              {searching ? 'Searching...' : 'Verify'}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-highlight)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#558763" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <span style={{ color: '#558763', fontWeight: 600, fontSize: '1.1rem' }}>Proof Verified ✓</span>
              </div>
              
              {[
                ['Status', result.status],
                ['Nullifier', result.nullifier],
                ['Timestamp', new Date(result.timestamp).toLocaleString()],
                ['Feedback', '🔒 ENCRYPTED (not visible to verifiers)'],
              ].map(([label, value], i) => (
                <div key={i} style={{ 
                  display: 'flex', justifyContent: 'space-between', 
                  padding: '0.6rem 0', 
                  borderTop: i > 0 ? '1px solid var(--border-color)' : 'none',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontWeight: 500, fontFamily: label === 'Nullifier' ? 'monospace' : 'inherit', maxWidth: '300px', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {notFound && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                No proof found for <code style={{ background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px' }}>{proofId}</code>. 
                Check the ID and try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
