'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch (e) {
      console.error("Failed to fetch campaigns", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsCreating(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, questions: [{ type: 'text', label: 'Your Feedback' }] })
      });
      
      const data = await res.json();
      if (data.success) {
        setShowCreate(false);
        setTitle('');
        setDescription('');
        await fetchCampaigns();
      }
    } catch (e) {
      console.error("Failed to create campaign", e);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="main-content">
      <div className="content-wrapper animate-fade-in" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              Issuer Dashboard
            </h1>
            <p className="hero-subtitle" style={{ margin: 0 }}>
              Manage your private, ZK-verified survey campaigns.
            </p>
          </div>
          <button 
            onClick={() => setShowCreate(!showCreate)} 
            className="primary-button" 
            style={{ width: 'auto', padding: '12px 24px' }}
          >
            {showCreate ? 'Cancel' : '+ New Campaign'}
          </button>
        </div>

        {showCreate && (
          <div className="soft-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border-highlight)' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 600 }}>Create New Campaign</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="input-group">
                <label className="input-label">Campaign Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="textarea-input" 
                  style={{ minHeight: 'auto', padding: '12px 16px' }} 
                  placeholder="e.g., Q3 Engineering Feedback"
                  required 
                />
              </div>
              <div className="input-group">
                <label className="input-label">Description (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea-input" 
                  style={{ minHeight: '100px' }} 
                  placeholder="Explain the purpose of this survey..."
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="primary-button" style={{ width: 'auto' }} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="soft-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📊</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No campaigns yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Create your first campaign to start collecting verified feedback.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {campaigns.map(c => (
              <div key={c.id} className="soft-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{c.title}</h3>
                  <span className="badge" style={{ fontSize: '0.7rem' }}>Active</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                  {c.description || "No description provided."}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>ID: {c.id}</span>
                  <Link href={`/dashboard/${c.id}`} className="primary-button" style={{ width: 'auto', padding: '6px 16px', fontSize: '0.85rem' }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
