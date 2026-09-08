import type { Metadata } from 'next';
import './globals.css';
import { MidnightProvider } from '@/providers/MidnightProvider';
import { Navbar } from '@/components/Navbar';

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
          
          <MidnightProvider>
            <Navbar />
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
