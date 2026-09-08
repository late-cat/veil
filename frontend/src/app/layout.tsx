import type { Metadata } from 'next';
import './globals.css';
import { MidnightProvider } from '@/providers/MidnightProvider';

export const metadata: Metadata = {
  title: 'VEIL — Private Feedback Protocol',
  description: 'Submit verifiable feedback anonymously on the Midnight blockchain.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <div className="ambient-blob blob-1" />
          <div className="ambient-blob blob-2" />
          
          <nav className="navbar">
            <div className="nav-brand">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5H5a2 2 0 0 1 0-4h16v-5" />
              </svg>
              VEIL
            </div>
            <div className="nav-links">
              <a href="#" className="nav-link active">Surveys</a>
              <a href="#" className="nav-link">Verify Proof</a>
              <a href="#" className="nav-link">For Organizations</a>
            </div>
          </nav>

          <MidnightProvider>
            {children}
          </MidnightProvider>

          <footer className="footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Built on Midnight Network</span>
            </div>
            <div className="footer-links">
              <a href="#">Privacy Protocol</a>
              <a href="#">Documentation</a>
              <a href="#">Terms</a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
