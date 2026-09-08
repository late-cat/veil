'use client';

export default function PrivacyModel() {
  return (
    <main className="main-content">
      <div className="content-wrapper animate-fade-in" style={{ maxWidth: '800px' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Privacy Model
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: '3rem' }}>
          Selective Disclosure — what&apos;s proven, what&apos;s private, and what&apos;s public.
        </p>

        {/* Public vs Private Table */}
        <div className="soft-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 600 }}>Data Classification</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--bg-secondary)', padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              <span>DATA POINT</span>
              <span>VISIBILITY</span>
              <span>DISCLOSED TO</span>
            </div>
            {[
              ['Participation Count', 'Public Ledger', 'Everyone'],
              ['Nullifier Hash', 'Public Ledger', 'Everyone (anonymous)'],
              ['Wallet Address', 'Private Witness', 'No one'],
              ['Feedback Text', 'Off-chain Encrypted', 'No one'],
              ['Eligibility Status', 'ZK Proven', 'Verifier only (as boolean)'],
            ].map(([data, visibility, disclosed], i) => (
              <div key={i} style={{ 
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', 
                padding: '0.75rem 1rem', fontSize: '0.9rem',
                background: i % 2 === 0 ? 'transparent' : 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-color)'
              }}>
                <span style={{ fontWeight: 500 }}>{data}</span>
                <span style={{ color: visibility === 'Private Witness' || visibility === 'Off-chain Encrypted' ? '#c0392b' : '#558763' }}>{visibility}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{disclosed}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Claim */}
        <div className="soft-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 600 }}>Privacy Claim</h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h4 style={{ color: '#558763', marginBottom: '0.5rem' }}>✓ What an observer CAN see</h4>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
                <li>Total number of participants</li>
                <li>A set of anonymous nullifier hashes</li>
                <li>That each submission was valid</li>
              </ul>
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h4 style={{ color: '#c0392b', marginBottom: '0.5rem' }}>✗ What an observer CANNOT see</h4>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
                <li>Who submitted feedback</li>
                <li>What any individual wrote</li>
                <li>Which wallet is linked to which nullifier</li>
                <li>Any correlation between responses</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How Midnight Enables This */}
        <div className="soft-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 600 }}>Why Midnight?</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Traditional blockchains store all data publicly. A feedback system on Ethereum or Solana would expose 
            every response for anyone to read. Midnight&apos;s <strong>Compact language</strong> allows us to write circuits that 
            verify constraints (eligibility, uniqueness) without ever putting the sensitive data on-chain. 
            The <code style={{ background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>disclose()</code> function 
            is used deliberately only for the participation count — everything else stays in the private witness.
          </p>
        </div>
      </div>
    </main>
  );
}
