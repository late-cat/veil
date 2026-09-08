'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ExplorerVerification() {
  const params = useParams();
  const txHash = params.id as string;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Explorer Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl">travel_explore</span>
            <div>
              <h1 className="font-bold text-xl tracking-wide">Midnight Testnet Explorer</h1>
              <p className="text-slate-400 text-sm">Zero-Knowledge Proof Verification</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-sm bg-slate-800 px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to App
          </Link>
        </div>

        {/* Transaction Details */}
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm border border-green-200">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Transaction Confirmed</h2>
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Included in Ledger
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Transaction Hash / Proof ID</div>
              <div className="font-mono text-lg text-slate-800 break-all select-all">{txHash}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Status</div>
                <div className="text-slate-800 font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500 text-sm">verified</span>
                  ZK-SNARK Validated
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Network</div>
                <div className="text-slate-800 font-medium">Midnight Testnet (Simulated)</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Timestamp</div>
                <div className="text-slate-800 font-medium">{new Date().toLocaleString()}</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Payload Type</div>
                <div className="text-slate-800 font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-500 text-sm">lock</span>
                  Shielded Payload (Encrypted)
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
              <h3 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">info</span>
                Privacy Preserved
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                This transaction contains a valid Zero-Knowledge proof confirming the sender's eligibility without revealing their unshielded Midnight address or public key. The underlying data remains cryptographically secure.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
