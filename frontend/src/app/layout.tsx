import type { Metadata } from 'next';
import './globals.css';
import { MidnightProvider } from '@/providers/MidnightProvider';
import { Outfit } from 'next/font/google';
import { Logo } from '@/components/Logo';



const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

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
    <html lang="en" className={`${outfit.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="antialiased overflow-x-hidden grain-texture min-h-screen flex flex-col">
          <MidnightProvider>
            <div className="flex-1 flex flex-col relative z-10">
              {children}
            </div>
            
            <footer className="shrink-0 z-50 bg-[var(--color-cotton-bg)]/80 backdrop-blur-md border-t border-slate-300 shadow-inner felt-texture mt-auto">
              <div className="w-full px-[var(--spacing-container-padding)] py-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Logo className="text-slate-800" />
                  <span className="font-headline-md font-bold text-slate-900 drop-shadow-sm">VEIL Protocol</span>
                </div>
                <div className="font-body-md text-slate-700 flex items-center gap-4">
                  <span className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full inset-puffy">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Midnight Testnet Active
                  </span>
                  <span>© 2026 VEIL</span>
                </div>
              </div>
            </footer>
          </MidnightProvider>
      </body>
    </html>
  );
}
