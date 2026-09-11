'use client';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Connect Your Wallet',
      desc: 'Link your Midnight wallet (1A.M. or Lace) to prove you are an eligible participant. Your identity is never stored — only your eligibility is checked.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5H5a2 2 0 0 1 0-4h16v-5" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Write Your Feedback',
      desc: 'Share your honest thoughts about faculty, coursework, or institutional policies. Your response text is encrypted and stored off-chain.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Zero-Knowledge Proof Generated',
      desc: 'A cryptographic proof is generated locally in your browser. This proof mathematically verifies you are eligible and have not submitted before — without revealing who you are.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Verified On-Chain',
      desc: 'The proof and a unique nullifier are recorded on the Midnight blockchain. The nullifier prevents double-submissions. Your identity and feedback text never touch the ledger.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  return (
    <main className="main-content">
      <div className="content-wrapper animate-fade-in" style={{ maxWidth: '800px' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          How VEIL Works
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: '3rem' }}>
          Four steps from honest opinion to verified, anonymous submission.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {steps.map((step, i) => (
            <div key={i} className="soft-panel" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ 
                minWidth: '56px', height: '56px', borderRadius: '16px', 
                background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--border-color)',
                color: 'var(--text-accent)'
              }}>
                {step.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-accent)', letterSpacing: '0.1em' }}>STEP {step.num}</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{step.title}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="soft-panel" style={{ marginTop: '3rem', padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Ready to try it?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Connect your wallet and submit your first private feedback.</p>
          <a href="/" className="primary-button" style={{ display: 'inline-block', textDecoration: 'none' }}>Submit Feedback →</a>
        </div>
      </div>
    </main>
  );
}
