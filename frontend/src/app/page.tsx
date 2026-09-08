import Link from 'next/link';

export default function Home() {
  return (
    <main className="main-content">
      <div className="content-wrapper animate-fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        
        <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
          The Private Web3<br/>
          <span className="text-accent">Survey Platform.</span>
        </h1>
        
        <p className="hero-subtitle" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          Create campaigns, collect verified feedback, and guarantee user anonymity.
          Powered by Midnight Network's Zero-Knowledge cryptography.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link href="/dashboard" className="primary-button" style={{ padding: '16px 32px', fontSize: '1.1rem', textDecoration: 'none' }}>
            Launch a Campaign
          </Link>
          <Link href="/how-it-works" className="secondary-button" style={{ padding: '16px 32px', fontSize: '1.1rem', textDecoration: 'none' }}>
            Learn More
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
          <div className="soft-panel" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛡️</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>ZK-Shielded</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Feedback is proven mathematically without ever revealing the underlying data or identity to the blockchain.
            </p>
          </div>
          
          <div className="soft-panel" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔗</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>Decentralized Tally</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Participation counts are maintained on the Midnight public ledger, ensuring auditable transparency.
            </p>
          </div>

          <div className="soft-panel" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>Instant Setup</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Generate a shareable link and QR code in seconds. No coding required for issuers.
            </p>
          </div>
        </div>
        
      </div>
    </main>
  );
}
