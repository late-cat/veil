'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMidnight } from '@/providers/MidnightProvider';
import { WalletBadge } from '@/components/WalletBadge';
import { QRCodeCanvas } from 'qrcode.react';

export type QuestionType = 'text' | 'mcq' | 'rating';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  creator: string;
  questions?: Question[];
  createdAt: string;
}

export interface Feedback {
  proofId: string;
  answers: Record<string, any>;
  timestamp: string;
  status: string;
}

export default function CampaignDetails() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  // State for dynamic verification inputs
  const [verifyStates, setVerifyStates] = useState<Record<string, boolean>>({});
  const [verifyHashes, setVerifyHashes] = useState<Record<string, string>>({});
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    if (campaignId) {
      fetchData();
    }
  }, [campaignId]);

  const fetchData = async () => {
    try {
      const [campRes, feedRes] = await Promise.all([
        fetch(`/api/campaigns?id=${campaignId}`),
        fetch(`/api/feedback?campaignId=${campaignId}`)
      ]);
      const campData = await campRes.json();
      const feedData = await feedRes.json();
      
      if (campData.found) setCampaign(campData.campaign);
      if (feedData.records) setFeedbacks(feedData.records);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const { walletConnected, walletAddress, connectWallet } = useMidnight();
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/c/${campaignId}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const canvas = document.getElementById('survey-qrcode') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `survey-qr-${campaignId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-headline-md text-slate-600 animate-pulse">Decrypting state...</div>;
  if (!campaign) return <div className="min-h-screen flex items-center justify-center font-headline-lg text-slate-800 font-bold">Survey not found</div>;

  return (
    <div className="w-full flex-1 flex flex-col relative pb-24">
      
      <header className="shrink-0 z-50 bg-[var(--color-cotton-bg)]/80 backdrop-blur-md border-b border-slate-300 shadow-sm felt-texture sticky top-0 w-full">
        <nav className="flex flex-col sm:flex-row justify-between items-center w-full px-[var(--spacing-container-padding)] py-4 max-w-7xl mx-auto gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors font-label-lg font-bold">
            <span className="material-symbols-outlined text-xl drop-shadow-sm">arrow_back</span>
            Back to Dashboard
          </Link>
          <div className="flex gap-4 items-center flex-wrap justify-center">
            {walletConnected ? (
              <WalletBadge />
            ) : (
              <button 
                onClick={() => connectWallet()}
                className="bg-white text-slate-800 px-6 py-2 rounded-full font-label-lg hover:bg-slate-100 transition-all active:scale-95 shadow-sm puffy-shadow felt-texture step-button border border-slate-200"
              >
                Connect Wallet
              </button>
            )}
            <div className="font-label-lg text-slate-700 bg-white/50 px-4 py-2 rounded-full inset-puffy flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {feedbacks.length} Responses
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-[var(--spacing-container-padding)] pt-12 w-full relative z-10 flex flex-col gap-10">
        
        {/* Campaign Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 inset-puffy mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="font-label-sm text-slate-800 font-bold uppercase tracking-widest drop-shadow-sm">Live Survey • {campaign.id}</span>
          </div>
          <h1 className="font-headline-xl text-slate-900 drop-shadow-md leading-tight">
            {campaign.title}
          </h1>
          <p className="font-body-lg text-slate-700 max-w-2xl font-medium drop-shadow-sm mt-4">
            {campaign.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Share Link Section */}
          <div className="lg:col-span-8 bg-[var(--color-cotton-blue)] rounded-[3rem] p-10 puffy-shadow felt-texture flex flex-col justify-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-white/50 inset-puffy flex items-center justify-center text-slate-800">
                  <span className="material-symbols-outlined text-2xl drop-shadow-sm">link</span>
                </div>
                <h2 className="font-headline-lg font-bold text-slate-900 drop-shadow-sm">Anonymous Entrypoint</h2>
              </div>
              <p className="font-body-md text-slate-800 font-medium ml-15">
                Distribute this single entrypoint URL. Respondents generate Zero-Knowledge proofs directly in browser.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-[var(--color-cotton-bg)] p-3 rounded-3xl inset-puffy border border-white/30 ml-15">
              <div className="flex-1 px-4 py-2 overflow-hidden">
                <span className="font-label-lg text-slate-800 truncate select-all">
                  {shareUrl}
                </span>
              </div>
              <button 
                onClick={copyToClipboard}
                className="px-8 py-3 rounded-full bg-slate-800 text-white font-label-lg shadow-sm puffy-shadow felt-texture step-button flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <span className="material-symbols-outlined text-sm text-green-400">check</span>
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => setShowQR(true)}
                className="px-6 py-3 rounded-full bg-white text-slate-800 font-label-lg border border-slate-200 shadow-sm puffy-shadow felt-texture hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-sm">qr_code_2</span>
                <span>QR</span>
              </button>
              <Link 
                href={`/c/${campaignId}`}
                target="_blank"
                className="w-12 h-12 rounded-full bg-blue-600 text-white font-label-lg shadow-sm puffy-shadow felt-texture hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-4 bg-white rounded-[3rem] p-10 puffy-shadow felt-texture flex flex-col justify-center items-center text-center relative group overflow-hidden">
            <div className="absolute top-4 right-4 text-slate-200 group-hover:text-slate-300 transition-colors">
              <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_locked</span>
            </div>
            <span className="font-headline-xl text-6xl text-slate-900 drop-shadow-md z-10">{feedbacks.length}</span>
            <span className="font-label-lg text-slate-600 font-bold uppercase tracking-widest mt-4 z-10">Verified Proofs</span>
            <div className="mt-6 flex items-center gap-2 font-label-sm bg-slate-100 px-4 py-2 rounded-full inset-puffy text-slate-600 font-bold z-10 border border-slate-200">
              <span className="material-symbols-outlined text-sm text-green-600">verified</span>
              Merkle Depth: 16
            </div>
          </div>
        </div>

        {/* Responses Feed */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="font-headline-lg font-bold text-slate-900 drop-shadow-sm">Decrypted Feedback</h2>
            <button 
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="hidden sm:flex items-center gap-2 bg-white/50 hover:bg-white/80 px-4 py-2 rounded-full inset-puffy border border-white/50 transition-colors"
            >
              <span className="font-label-sm text-slate-700 font-bold uppercase tracking-widest">
                Sorted by {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
              </span>
              <span className="material-symbols-outlined text-[16px] text-slate-500">sort</span>
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {feedbacks.length === 0 ? (
              <div className="bg-white/40 rounded-[3rem] p-16 text-center flex flex-col items-center inset-puffy border border-white/50">
                <span className="material-symbols-outlined text-6xl text-slate-400 mb-6 drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>drafts</span>
                <h3 className="font-headline-md font-bold text-slate-800 drop-shadow-sm">No feedback yet</h3>
                <p className="font-body-md text-slate-700 font-medium mt-2">Share the link above to start collecting cryptographic responses.</p>
              </div>
            ) : (
              [...feedbacks]
                .sort((a, b) => {
                  const dateA = new Date(a.timestamp).getTime();
                  const dateB = new Date(b.timestamp).getTime();
                  return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
                })
                .map((fb, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="rounded-[2rem] bg-white puffy-shadow felt-texture p-8 flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="flex flex-wrap items-center gap-3">
                        {verifyStates[fb.proofId] ? (
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 bg-white rounded-md border border-blue-200 p-1 shadow-sm w-max">
                              <input 
                                type="text" 
                                placeholder="Paste Hash (e.g. 0xde94...)" 
                              className="font-mono text-xs px-2 py-1 outline-none text-slate-700 w-48 bg-transparent"
                              value={verifyHashes[fb.proofId] || ''}
                              onChange={(e) => setVerifyHashes({...verifyHashes, [fb.proofId]: e.target.value})}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = verifyHashes[fb.proofId]?.trim();
                                  if (val) {
                                    const formatted = val.startsWith('0x') ? val : '0x' + val;
                                    window.open(`https://preprod.midnightexplorer.com/transactions/${formatted}`, '_blank');
                                    setVerifyStates({...verifyStates, [fb.proofId]: false});
                                  }
                                }
                              }}
                            />
                            <button 
                              onClick={() => {
                                const val = verifyHashes[fb.proofId]?.trim();
                                if (val) {
                                  const formatted = val.startsWith('0x') ? val : '0x' + val;
                                  window.open(`https://preprod.midnightexplorer.com/transactions/${formatted}`, '_blank');
                                  setVerifyStates({...verifyStates, [fb.proofId]: false});
                                }
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 flex items-center justify-center transition-colors"
                            >
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </button>
                            <button 
                              onClick={() => setVerifyStates({...verifyStates, [fb.proofId]: false})}
                              className="text-slate-400 hover:text-slate-600 rounded px-1 py-1 flex items-center justify-center transition-colors"
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                            </div>
                            <p className="text-[10.5px] text-slate-500 max-w-[280px] leading-tight flex items-start gap-1">
                              <span className="material-symbols-outlined text-[12px] shrink-0 mt-[1px]">info</span>
                              Note: Use Cloudflare DNS (1.1.1.1) or a VPN if the Explorer is restricted by your ISP.
                            </p>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setVerifyStates({...verifyStates, [fb.proofId]: true})}
                            className="font-label-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md inset-puffy border border-blue-100 uppercase transition-colors flex items-center gap-1"
                          >
                            Verify <span className="material-symbols-outlined text-[12px]">search</span>
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-label-sm text-slate-500 font-bold tracking-widest uppercase">Response #{sortOrder === 'newest' ? feedbacks.length - idx : idx + 1}</span>
                        <span className="font-label-sm font-bold text-slate-500 uppercase tracking-wide">
                          {new Date(fb.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pl-2">
                      {(!campaign?.questions || campaign.questions.length === 0) ? (
                        <p className="font-body-md text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {fb.answers?.['default'] || "No response data"}
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {campaign.questions.map((q, qIdx) => (
                            <div key={q.id} className="bg-white/30 p-4 rounded-xl border border-white/50">
                              <h4 className="font-label-md font-bold text-slate-800 mb-2">{qIdx + 1}. {q.prompt}</h4>
                              
                              {q.type === 'rating' ? (
                                <div className="flex items-center gap-1">
                                  {[1,2,3,4,5].map(star => (
                                    <span key={star} className="material-symbols-outlined text-lg" style={{ color: fb.answers?.[q.id] >= star ? '#eab308' : '#cbd5e1', fontVariationSettings: fb.answers?.[q.id] >= star ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                                  ))}
                                </div>
                              ) : (
                                <p className="font-body-md text-slate-700 whitespace-pre-wrap">
                                  {fb.answers?.[q.id] !== undefined ? String(fb.answers[q.id]) : <span className="text-slate-400 italic">No answer provided</span>}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </main>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-[var(--color-cotton-bg)] rounded-[3rem] p-8 sm:p-12 puffy-shadow felt-texture w-full max-w-sm flex flex-col items-center relative border border-slate-200 shadow-2xl">
            <button 
              onClick={() => setShowQR(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center inset-puffy border border-slate-100"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h3 className="font-headline-md font-bold text-slate-900 mb-2">Survey QR Code</h3>
            <p className="font-body-sm text-slate-600 mb-8 text-center">Scan to open the survey directly on your mobile device.</p>
            
            <div className="bg-white p-6 rounded-3xl inset-puffy border border-slate-100 mb-8">
              <QRCodeCanvas 
                id="survey-qrcode"
                value={shareUrl} 
                size={200}
                level="H"
                fgColor="#1e293b"
              />
            </div>
            
            <button 
              onClick={downloadQR}
              className="w-full py-4 rounded-full bg-slate-800 text-white font-label-lg hover:bg-slate-700 transition-colors shadow-sm puffy-shadow felt-texture flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Download QR</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
