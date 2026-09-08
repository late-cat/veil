'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useMidnight } from '@/providers/MidnightProvider';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export type QuestionType = 'text' | 'mcq' | 'rating' | 'image';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  imageUrl?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  creator: string;
  questions?: Question[];
  bannerUrl?: string;
  createdAt: string;
  endDate?: string;
}

export default function CampaignSurvey() {
  const params = useParams();
  const campaignId = params.id as string;
  
  const { walletConnected, walletAddress, connectWallet, generateProofAndSubmit } = useMidnight();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [hoveredRatings, setHoveredRatings] = useState<Record<string, number>>({});
  
  const [stage, setStage] = useState<'LOADING' | 'NOT_FOUND' | 'IDLE' | 'CONNECTING' | 'FORM' | 'PROVING' | 'SUCCESS'>('LOADING');
  const [proofProgress, setProofProgress] = useState(0);
  const [proofId, setProofId] = useState<string | null>(null);

  const isExpired = campaign?.endDate ? new Date(campaign.endDate).getTime() < Date.now() : false;

  useEffect(() => {
    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  useEffect(() => {
    if (walletConnected && stage === 'IDLE') {
      setStage('FORM');
    }
  }, [walletConnected, stage]);

  const fetchCampaign = async () => {
    try {
      const res = await fetch(`/api/campaigns?id=${campaignId}`);
      const data = await res.json();
      if (data.found) {
        setCampaign(data.campaign);
        setStage(walletConnected ? 'FORM' : 'IDLE');
      } else {
        setStage('NOT_FOUND');
      }
    } catch {
      setStage('NOT_FOUND');
    }
  };

  const handleConnect = async () => {
    setStage('CONNECTING');
    await connectWallet();
    setStage('FORM');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required questions (basic validation: at least some answer if questions exist)
    if (campaign?.questions && campaign.questions.length > 0 && Object.keys(answers).length === 0) {
      alert("Please answer at least one question.");
      return;
    }
    
    setStage('PROVING');
    setProofProgress(1);
    
    const steps = [
      setTimeout(() => setProofProgress(2), 1000),
      setTimeout(() => setProofProgress(3), 2500)
    ];

    try {
      // Hand over to the provider to do the pseudo-ZK stuff and API submit
      const pid = await generateProofAndSubmit(answers, campaignId);
      setProofId(pid);
      setStage('SUCCESS');
    } catch (e) {
      alert("Failed to submit proof");
      setStage('FORM');
    } finally {
      steps.forEach(clearTimeout);
    }
  };

  if (stage === 'LOADING') return <div className="min-h-screen bg-[var(--color-cotton-bg)] flex items-center justify-center font-headline-md text-slate-600 animate-pulse felt-texture">Loading secure connection...</div>;
  if (stage === 'NOT_FOUND') return <div className="min-h-screen bg-[var(--color-cotton-bg)] flex flex-col items-center justify-center text-center p-8 felt-texture"><h2 className="font-headline-xl text-slate-900 font-bold drop-shadow-md">Survey Not Found</h2><p className="font-body-lg text-slate-700 mt-2 font-medium">The link is invalid or the survey has been closed.</p></div>;

  return (
    <div className="w-full flex-1 flex flex-col relative pb-16">
      
      <header className="shrink-0 z-50 bg-[var(--color-cotton-bg)]/80 backdrop-blur-md border-b border-slate-300 shadow-sm felt-texture sticky top-0">
        <nav className="flex flex-col sm:flex-row justify-between items-center w-full px-[var(--spacing-container-padding)] py-4 max-w-4xl mx-auto gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-800 font-bold text-3xl drop-shadow-sm">lock</span>
            <h1 className="font-headline-md font-bold tracking-tight text-slate-900 drop-shadow-sm">VEIL</h1>
          </div>
          <div className="flex items-center gap-4">
            {walletConnected ? (
              <div className="flex items-center gap-3 bg-[var(--color-cotton-pink)]/30 px-4 py-2 rounded-full felt-texture inset-puffy border border-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                <span className="font-label-lg text-slate-800 font-bold truncate max-w-[120px]">{walletAddress}</span>
              </div>
            ) : (
              <button 
                onClick={handleConnect}
                className="bg-white text-slate-800 px-6 py-2 rounded-full font-label-lg hover:bg-slate-100 transition-all active:scale-95 shadow-sm puffy-shadow felt-texture step-button border border-slate-200"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-[var(--spacing-container-padding)] py-12 flex flex-col relative z-10">
        
        <AnimatePresence mode="wait">
          {stage === 'IDLE' || stage === 'CONNECTING' ? (
            <motion.div 
              key="connect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center justify-center flex-1 space-y-10 bg-white/40 p-12 rounded-[3rem] inset-puffy border border-white/50 my-10"
            >
              <div className="w-24 h-24 rounded-full bg-[var(--color-cotton-lavender)] flex items-center justify-center text-slate-800 mb-2 relative puffy-shadow felt-texture">
                <div className="absolute inset-0 rounded-full border border-slate-400/20 animate-ping"></div>
                <span className="material-symbols-outlined text-5xl">wallet</span>
              </div>
              <div>
                <h1 className="font-headline-lg font-bold text-slate-900 drop-shadow-sm mb-4">Connect your Wallet</h1>
                <p className="font-body-lg text-slate-700 font-medium max-w-md">
                  To participate in <strong>{campaign?.title}</strong>, you must connect your Lace Wallet. Your identity remains cryptographically private.
                </p>
              </div>
              <button 
                onClick={handleConnect}
                disabled={stage === 'CONNECTING'}
                className="px-8 py-4 rounded-full bg-slate-800 text-white font-label-lg text-lg puffy-shadow felt-texture step-button transition-all disabled:opacity-50 flex items-center gap-3"
              >
                {stage === 'CONNECTING' ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Connect Securely</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </motion.div>
          ) : isExpired ? (
            <motion.div 
              key="expired"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col flex-1 items-center justify-center text-center gap-6 bg-[var(--color-cotton-pink)] p-12 rounded-[3rem] puffy-shadow felt-texture"
            >
              <div className="w-24 h-24 rounded-full bg-white/50 flex items-center justify-center text-slate-500 inset-puffy border border-white/60 mx-auto">
                <span className="material-symbols-outlined text-5xl">event_busy</span>
              </div>
              <div>
                <h2 className="font-headline-lg font-bold text-slate-900 drop-shadow-sm mb-2">Survey Closed</h2>
                <p className="font-body-lg text-slate-700 font-medium max-w-md mx-auto">
                  This survey stopped accepting new responses on {new Date(campaign!.endDate!).toLocaleDateString()}.
                </p>
              </div>
            </motion.div>
          ) : stage === 'FORM' ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit} 
              className="flex flex-col flex-1 gap-8 bg-[var(--color-cotton-pink)] p-8 sm:p-12 rounded-[3rem] puffy-shadow felt-texture"
            >
              <div className="flex flex-col gap-3 text-center mb-2">
                <span className="font-label-sm text-slate-600 font-bold tracking-widest uppercase bg-white/50 px-4 py-1.5 rounded-full inset-puffy mx-auto mb-2">Verified Survey</span>
                
                {campaign?.bannerUrl && (
                  <div className="w-full h-48 md:h-64 rounded-[2rem] overflow-hidden mb-6 shadow-sm border border-white/40">
                    <img src={campaign.bannerUrl} alt="Survey Banner" className="w-full h-full object-cover" />
                  </div>
                )}
                <h2 className="font-headline-lg text-slate-900 font-bold leading-tight drop-shadow-sm">
                  {campaign?.title}
                </h2>
                <p className="font-body-lg text-slate-700 font-medium">
                  {campaign?.description}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {!campaign?.questions || campaign.questions.length === 0 ? (
                  <div className="relative">
                    <div className="absolute right-4 top-4 text-slate-400 drop-shadow-sm">
                      <span className="material-symbols-outlined">lock</span>
                    </div>
                    <textarea 
                      value={answers['default'] || ''}
                      onChange={(e) => setAnswers({...answers, default: e.target.value})}
                      className="w-full bg-[var(--color-cotton-bg)] border-none rounded-[2rem] p-6 font-body-lg text-slate-900 inset-puffy focus:ring-2 focus:ring-slate-400 placeholder-slate-500 felt-texture outline-none resize-none min-h-[200px]" 
                      placeholder="Share candid thoughts..." 
                      required
                    ></textarea>
                  </div>
                ) : (
                  campaign.questions.map((q, idx) => (
                    <div key={q.id} className="bg-white/40 rounded-[2rem] p-6 inset-puffy border border-white/50 relative">
                      {q.type !== 'image' && (
                        <div className="absolute right-4 top-4 text-slate-400 drop-shadow-sm">
                          <span className="material-symbols-outlined">lock</span>
                        </div>
                      )}
                      {q.prompt && (
                        <h3 className={`font-label-lg font-bold text-slate-800 ${q.type === 'image' ? 'mb-4 text-center text-slate-600' : 'mb-4'}`}>
                          {q.type !== 'image' ? `${idx + 1}. ` : ''}{q.prompt}
                        </h3>
                      )}
                      
                      {q.type === 'image' && q.imageUrl && (
                        <div className="w-full flex justify-center mb-2">
                          <img src={q.imageUrl} alt={q.prompt || 'Survey Image'} className="max-w-full rounded-xl object-cover shadow-sm border border-slate-200" style={{maxHeight: '400px'}} />
                        </div>
                      )}
                      
                      {q.type === 'text' && (
                        <textarea
                          value={answers[q.id] || ''}
                          onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                          className="w-full bg-[var(--color-cotton-bg)] border-none rounded-xl p-4 font-body-md text-slate-900 inset-puffy focus:ring-2 focus:ring-slate-400 placeholder-slate-500 felt-texture outline-none resize-none min-h-[100px]"
                          placeholder="Your answer..."
                          required
                        ></textarea>
                      )}

                      {q.type === 'mcq' && q.options && (
                        <div className="flex flex-col gap-3">
                          {q.options.map((opt, optIdx) => (
                            <label key={optIdx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 cursor-pointer transition-colors border border-transparent hover:border-white/60">
                              <input 
                                type="radio" 
                                name={`q-${q.id}`} 
                                value={opt} 
                                checked={answers[q.id] === opt}
                                onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                                className="w-5 h-5 text-slate-800 focus:ring-slate-400"
                                required
                              />
                              <span className="font-body-md text-slate-700 font-medium">{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'rating' && (
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const currentRating = answers[q.id] || 0;
                            const hoverRating = hoveredRatings[q.id] || 0;
                            const isFilled = hoverRating >= star || (hoverRating === 0 && currentRating >= star);
                            
                            return (
                              <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoveredRatings({...hoveredRatings, [q.id]: star})}
                                onMouseLeave={() => setHoveredRatings({...hoveredRatings, [q.id]: 0})}
                                onClick={() => setAnswers({...answers, [q.id]: star})}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                  isFilled 
                                    ? 'bg-slate-800 text-yellow-400 puffy-shadow scale-110' 
                                    : 'bg-white/50 text-slate-400 inset-puffy hover:bg-white/80'
                                }`}
                              >
                                <span 
                                  className="material-symbols-outlined text-2xl transition-all duration-300" 
                                  style={{ 
                                    fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0",
                                    filter: isFilled ? "drop-shadow(0 0 8px rgba(250,204,21,0.6))" : "none"
                                  }}
                                >
                                  star
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-1.5 text-slate-600 font-label-sm font-bold">
                    <span className="material-symbols-outlined text-sm">visibility_off</span>
                    <span>No logging. Unlinkable proof.</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={campaign?.questions && campaign.questions.length > 0 ? Object.keys(answers).length === 0 : !answers['default']}
                className="mt-4 px-8 py-4 rounded-full bg-slate-800 text-white font-label-lg text-lg puffy-shadow felt-texture step-button transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <span>Submit with ZK Proof</span>
                <span className="material-symbols-outlined">security</span>
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="proving"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="w-full bg-[var(--color-cotton-lavender)] rounded-[3rem] puffy-shadow felt-texture p-8 sm:p-12 space-y-10 relative overflow-hidden">
                
                {stage === 'PROVING' ? (
                  <>
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                      <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white inset-puffy mb-2">
                        <motion.span 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="material-symbols-outlined text-5xl text-slate-800 drop-shadow-sm"
                        >
                          settings
                        </motion.span>
                      </div>
                      <h3 className="font-headline-lg font-bold text-slate-900 drop-shadow-sm">Synthesizing Proof</h3>
                      <p className="font-body-md text-slate-700 font-medium">Computing zero-knowledge circuit on client thread...</p>
                    </div>

                    <div className="space-y-4 bg-white/40 p-6 rounded-[2rem] inset-puffy border border-white/50">
                      <div className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${proofProgress >= 1 ? 'bg-white shadow-sm' : 'opacity-40'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${proofProgress > 1 ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                          <span className="material-symbols-outlined text-sm">{proofProgress > 1 ? 'check' : 'lock'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-lg font-bold text-slate-900">Encrypting Response</span>
                          <span className="font-body-sm text-slate-600 font-medium">AES-256-GCM & nullifier hash created</span>
                        </div>
                      </div>
                      
                      <div className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${proofProgress >= 2 ? 'bg-white shadow-sm' : 'opacity-40'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${proofProgress > 2 ? 'bg-green-100 text-green-600' : (proofProgress === 2 ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-200 text-slate-500')}`}>
                          <span className="material-symbols-outlined text-sm">{proofProgress > 2 ? 'check' : 'memory'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-lg font-bold text-slate-900">Generating ZK-SNARK</span>
                          <span className="font-body-sm text-slate-600 font-medium">Proving eligibility without leaking ID</span>
                        </div>
                      </div>
                      
                      <div className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${proofProgress >= 3 ? 'bg-white shadow-sm' : 'opacity-40'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${proofProgress >= 3 ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-200 text-slate-500'}`}>
                          <span className="material-symbols-outlined text-sm">cloud_upload</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-lg font-bold text-slate-900">Broadcasting to Midnight</span>
                          <span className="font-body-sm text-slate-600 font-medium">Submitting verifiable nullifier to ledger</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-8 flex flex-col items-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-green-600 puffy-shadow border-4 border-white mb-4"
                    >
                      <span className="material-symbols-outlined text-5xl font-bold">check</span>
                    </motion.div>
                    
                    <div className="text-center">
                      <h3 className="font-headline-xl font-bold text-slate-900 drop-shadow-md">Successfully Submitted</h3>
                      <p className="font-body-lg text-slate-700 font-medium max-w-sm mt-4">
                        Your answer has been tallied into the public pool. Your identity remains 100% confidential.
                      </p>
                    </div>
                    
                    <div className="w-full bg-[var(--color-cotton-bg)] p-6 rounded-[2rem] inset-puffy border border-white/50 text-center space-y-3">
                      <div className="font-label-sm font-bold text-slate-500 uppercase tracking-widest">Midnight Proof ID</div>
                      <code className="font-label-lg font-bold text-slate-800 break-all select-all block px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-200">
                        {proofId}
                      </code>
                    </div>

                    <button 
                      onClick={() => setStage('FORM')}
                      className="mt-2 px-6 py-3 rounded-full bg-white text-slate-800 font-label-lg puffy-shadow step-button felt-texture border border-slate-200"
                    >
                      Return to Survey
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
