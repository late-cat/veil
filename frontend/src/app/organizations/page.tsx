'use client';

export default function Organizations() {
  return (
    <main className="main-content">
      <div className="content-wrapper animate-fade-in" style={{ maxWidth: '800px' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          For Organizations
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: '3rem' }}>
          Collect trustworthy, verified feedback without compromising participant privacy.
        </p>

        {/* Value Props */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { title: 'Honest Responses', desc: 'Participants know their identity is mathematically protected, leading to more candid feedback.', icon: '💬' },
            { title: 'Double-Submit Protection', desc: 'Cryptographic nullifiers ensure each participant can only submit once — no ballot stuffing.', icon: '🛡️' },
            { title: 'Verifiable Results', desc: 'Every submission is backed by a ZK proof on the Midnight blockchain — auditable by anyone.', icon: '✓' },
          ].map((item, i) => (
            <div key={i} className="soft-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Mock Dashboard */}
        <div className="soft-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, margin: 0 }}>Organization Dashboard</h2>
            <span className="badge">Demo Preview</span>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total Responses', value: '47', color: 'var(--text-primary)' },
              { label: 'Verified Proofs', value: '47', color: '#558763' },
              { label: 'Duplicate Attempts', value: '3', color: '#c0392b' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Sentiment Overview */}
          <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>Aggregated Themes (AI Summary)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { theme: 'Course material needs updating', pct: 72 },
                { theme: 'Office hours scheduling improvement', pct: 58 },
                { theme: 'More hands-on lab sessions', pct: 45 },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ flex: 1, height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.pct}%`, height: '100%', background: 'var(--text-accent)', borderRadius: '4px', transition: 'width 1s ease' }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', minWidth: '35px' }}>{item.pct}%</span>
                  <span style={{ fontSize: '0.85rem', minWidth: '200px' }}>{item.theme}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="soft-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Interested in deploying VEIL?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Contact us to set up private, verifiable feedback for your organization.
          </p>
          <button className="primary-button" style={{ width: 'auto', padding: '12px 32px' }}>
            Request Access
          </button>
        </div>
      </div>
    </main>
  );
}
