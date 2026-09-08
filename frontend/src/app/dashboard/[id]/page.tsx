'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface Feedback {
  proofId: string;
  feedback: string;
  timestamp: string;
  nullifier: string;
}

export default function CampaignDetails() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [results, setResults] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignAndResults();
    }
  }, [campaignId]);

  const fetchCampaignAndResults = async () => {
    try {
      const campRes = await fetch(`/api/campaigns?id=${campaignId}`);
      const campData = await campRes.json();
      
      if (!campData.found) {
        router.push('/dashboard');
        return;
      }
      setCampaign(campData.campaign);

      const resRes = await fetch(`/api/feedback?campaignId=${campaignId}`);
      const resData = await resRes.json();
      setResults(resData.records || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/c/${campaignId}` : '';

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>;
  if (!campaign) return null;

  return (
    <main className="main-content">
      <div className="content-wrapper animate-fade-in" style={{ maxWidth: '900px' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Dashboard
          </Link>
        </div>

        <div className="soft-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{campaign.title}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px' }}>{campaign.description}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Responses</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#558763', lineHeight: 1 }}>{results.length}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          
          {/* Share Panel */}
          <div className="soft-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Share Campaign</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Send this link to your participants. They will need a Lace wallet to verify eligibility.
            </p>
            
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              {shareLink}
            </div>
            
            <button onClick={copyToClipboard} className="primary-button" style={{ width: '100%', marginBottom: '1.5rem' }}>
              {copied ? 'Copied ✓' : 'Copy Link'}
            </button>

            <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div style={{ width: '150px', height: '150px', background: 'var(--text-primary)', margin: '0 auto', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--bg-primary)' }}>[ QR Code ]</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Participant QR</div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="soft-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Responses (Decrypted for Issuer)</h3>
            
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                No feedback received yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {results.map((r, i) => (
                  <div key={i} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>{new Date(r.timestamp).toLocaleString()}</span>
                      <span style={{ fontFamily: 'monospace' }}>{r.proofId}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                      "{r.feedback}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </main>
  );
}
