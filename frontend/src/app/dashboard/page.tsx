'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMidnight } from '@/providers/MidnightProvider';
import { WalletBadge } from '@/components/WalletBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export type QuestionType = 'text' | 'mcq' | 'rating' | 'image';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[]; // only for mcq
  imageUrl?: string; // only for image
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  creator: string;
  questions?: Question[];
  bannerUrl?: string;
  createdAt: string;
  responseCount?: number;
  endDate?: string;
}

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bannerUrl, setBannerUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'active' | 'stats'>('active');
  const [endDate, setEndDate] = useState('');

  const { walletConnected, walletAddress, connectWallet } = useMidnight();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'create' || tab === 'active' || tab === 'stats') {
        setActiveTab(tab);
      }
    }

    if (walletAddress) {
      fetch(`/api/campaigns?wallet=${encodeURIComponent(walletAddress)}`)
        .then(r => r.json())
        .then(data => {
          if(data.success) setCampaigns(data.campaigns);
          setLoading(false);
        });
    } else {
      setCampaigns([]);
      setLoading(false);
    }
  }, [walletAddress]);

  const addQuestion = (type: QuestionType) => {
    setQuestions([...questions, {
      id: Math.random().toString(36).substring(2, 9),
      type,
      prompt: '',
      options: type === 'mcq' ? ['Option 1'] : undefined
    }]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      const data = await response.json();
      setBannerUrl(data.url);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected) {
      alert("Please connect your wallet first");
      return;
    }
    setIsCreating(true);
    
    try {
      // Create campaign via API
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          questions,
          bannerUrl,
          endDate,
          creator: walletAddress || '0xunknown'
        })
      });
      const data = await res.json();
      if(data.success) {
        setCampaigns([...campaigns, data.campaign]);
        setTitle('');
        setDescription('');
        setBannerUrl('');
        setEndDate('');
        setQuestions([]);
        setActiveTab('active');
      }
    } catch (e) {
      console.error('Failed to create campaign', e);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this survey? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/campaigns?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCampaigns(campaigns.filter(c => c.id !== id));
      } else {
        alert('Failed to delete survey.');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting survey.');
    }
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    return sortOrder === 'newest' 
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const displayedCampaigns = showAll ? sortedCampaigns : sortedCampaigns.slice(0, 4);

  return (
    <div className="min-h-screen bg-[var(--color-cotton-bg)] flex flex-col relative overflow-x-hidden pb-20">
      
      <header className="shrink-0 z-50 bg-[var(--color-cotton-bg)]/80 backdrop-blur-md border-b border-slate-300 shadow-sm felt-texture fixed top-0 w-full">
        <nav className="flex flex-col sm:flex-row justify-between items-center w-full px-4 sm:px-8 xl:px-12 py-4 gap-4">
          <Link href="/" className="flex items-center gap-2 text-slate-800 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined font-bold text-3xl drop-shadow-sm">lock</span>
            <h1 className="font-headline-md font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 drop-shadow-md">VEIL Protocol</h1>
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
          </div>
        </nav>
      </header>

      <main className="px-4 sm:px-8 xl:px-12 pt-28 pb-12 w-full relative z-10 flex flex-col md:flex-row gap-10 min-h-screen">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4">
          <button 
            onClick={() => setActiveTab('create')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-label-lg transition-all ${activeTab === 'create' ? 'bg-slate-800 text-white shadow-sm puffy-shadow' : 'bg-white/50 text-slate-700 hover:bg-white/80 border border-slate-200 inset-puffy'}`}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Create Survey
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-label-lg transition-all ${activeTab === 'active' ? 'bg-slate-800 text-white shadow-sm puffy-shadow' : 'bg-white/50 text-slate-700 hover:bg-white/80 border border-slate-200 inset-puffy'}`}
          >
            <span className="material-symbols-outlined">grid_view</span>
            Active Surveys
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-label-lg transition-all ${activeTab === 'stats' ? 'bg-slate-800 text-white shadow-sm puffy-shadow' : 'bg-white/50 text-slate-700 hover:bg-white/80 border border-slate-200 inset-puffy'}`}
          >
            <span className="material-symbols-outlined">bar_chart</span>
            Statistics
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'create' && (
            <div className="felt-texture bg-[var(--color-cotton-pink)] rounded-[3rem] puffy-shadow p-8 sm:p-12 flex flex-col gap-8">
              <div className="text-center">
                <h2 className="font-headline-lg font-bold text-slate-900 drop-shadow-sm">New Survey</h2>
                <p className="font-body-md text-slate-700 font-medium mt-1">Deploy a ZK-Shielded survey to the network.</p>
              </div>
              
              <form onSubmit={handleCreate} className="flex flex-col gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <label className="font-label-lg text-slate-800 uppercase tracking-widest px-2 drop-shadow-sm">Survey Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Employee Feedback"
                  required
                  className="w-full bg-[var(--color-cotton-bg)] border-none rounded-2xl p-4 font-body-lg inset-puffy focus:ring-2 focus:ring-slate-400 text-slate-900 placeholder-slate-400 felt-texture outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-lg text-slate-800 uppercase tracking-widest px-2 drop-shadow-sm">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief details about the survey..."
                  rows={3}
                  className="w-full bg-[var(--color-cotton-bg)] border-none rounded-2xl p-4 font-body-lg inset-puffy focus:ring-2 focus:ring-slate-400 text-slate-900 placeholder-slate-400 felt-texture outline-none resize-none"
                />
              </div>

              
              <div className="flex flex-col gap-2">
                <label className="font-label-lg text-slate-800 uppercase tracking-widest px-2 drop-shadow-sm">End Date (Optional)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[var(--color-cotton-bg)] border-none rounded-2xl p-4 font-body-lg inset-puffy focus:ring-2 focus:ring-slate-400 text-slate-900 felt-texture outline-none"
                />
              </div>
<div className="flex flex-col gap-2">
                <label className="font-label-lg text-slate-800 uppercase tracking-widest px-2 drop-shadow-sm">Banner Image</label>
                <div className="w-full bg-white/40 border border-white/60 rounded-2xl p-4 flex flex-col items-center justify-center inset-puffy relative overflow-hidden group">
                  {bannerUrl ? (
                    <div className="w-full h-32 relative rounded-xl overflow-hidden shadow-sm">
                      <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setBannerUrl('')}
                        className="absolute top-2 right-2 bg-slate-900/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors backdrop-blur-sm"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleBannerUpload}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center text-slate-500 group-hover:text-slate-700 transition-colors py-4">
                        {isUploading ? (
                          <span className="material-symbols-outlined text-3xl animate-spin text-blue-500 mb-2">sync</span>
                        ) : (
                          <span className="material-symbols-outlined text-3xl mb-2">add_photo_alternate</span>
                        )}
                        <span className="font-label-sm font-bold">
                          {isUploading ? "Uploading..." : "Click to upload banner"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Dynamic Question Builder */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center justify-between px-2">
                  <label className="font-label-lg text-slate-800 uppercase tracking-widest drop-shadow-sm">Questions ({questions.length})</label>
                </div>
                
                {questions.map((q, index) => (
                  <div key={q.id} className="bg-white/50 rounded-2xl p-4 flex flex-col gap-3 relative border border-white/60 shadow-sm">
                    <button type="button" onClick={() => removeQuestion(q.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-1 bg-slate-200 text-slate-700 rounded-md uppercase tracking-wider">
                        {q.type === 'mcq' ? 'Multiple Choice' : q.type === 'rating' ? '1-5 Rating' : q.type === 'image' ? 'Image Block' : 'Text Entry'}
                      </span>
                    </div>

                    <input
                      type="text"
                      value={q.prompt}
                      onChange={(e) => updateQuestion(q.id, 'prompt', e.target.value)}
                      placeholder={q.type === 'image' ? "Optional image title..." : "Enter question prompt..."}
                      required={q.type !== 'image'}
                      className="w-full bg-transparent border-b border-slate-300 px-1 py-2 font-body-lg focus:outline-none focus:border-slate-500 text-slate-900 placeholder-slate-400"
                    />

                    {q.type === 'image' && (
                      <div className="mt-2 w-full bg-white/40 border border-white/60 rounded-xl p-4 flex flex-col items-center justify-center inset-puffy relative overflow-hidden group">
                        {q.imageUrl ? (
                          <div className="w-full h-40 relative rounded-lg overflow-hidden shadow-sm">
                            <img src={q.imageUrl} alt="Block" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => updateQuestion(q.id, 'imageUrl', '')}
                              className="absolute top-2 right-2 bg-slate-900/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors backdrop-blur-sm"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={async (e) => {
                                if (!e.target.files || e.target.files.length === 0) return;
                                const file = e.target.files[0];
                                try {
                                  const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                                    method: 'POST',
                                    body: file,
                                  });
                                  const data = await response.json();
                                  updateQuestion(q.id, 'imageUrl', data.url);
                                } catch (error) {
                                  console.error("Upload failed", error);
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center text-slate-500 group-hover:text-slate-700 transition-colors py-4">
                              <span className="material-symbols-outlined text-3xl mb-2">add_photo_alternate</span>
                              <span className="font-label-sm font-bold">Click to upload image</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {q.type === 'mcq' && q.options && (
                      <div className="flex flex-col gap-2 mt-2 pl-4 border-l-2 border-slate-300">
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...q.options!];
                                newOpts[optIndex] = e.target.value;
                                updateQuestion(q.id, 'options', newOpts);
                              }}
                              className="bg-transparent border-none focus:outline-none font-body-md text-slate-700 w-full"
                              placeholder={`Option ${optIndex + 1}`}
                              required
                            />
                            {q.options!.length > 1 && (
                              <button 
                                type="button"
                                onClick={() => {
                                  const newOpts = [...q.options!];
                                  newOpts.splice(optIndex, 1);
                                  updateQuestion(q.id, 'options', newOpts);
                                }}
                                className="text-slate-400 hover:text-red-500"
                              >
                                <span className="material-symbols-outlined text-sm">remove</span>
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newOpts = [...q.options!, `Option ${q.options!.length + 1}`];
                            updateQuestion(q.id, 'options', newOpts);
                          }}
                          className="text-sm font-label-md text-slate-500 hover:text-slate-800 self-start flex items-center gap-1 mt-1"
                        >
                          <span className="material-symbols-outlined text-sm">add</span> Add Option
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex flex-wrap gap-2 mt-2">
                  <button type="button" onClick={() => addQuestion('text')} className="flex-1 bg-white/60 hover:bg-white text-slate-700 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1 shadow-sm transition-colors border border-slate-200">
                    <span className="material-symbols-outlined text-sm">notes</span> Text
                  </button>
                  <button type="button" onClick={() => addQuestion('mcq')} className="flex-1 bg-white/60 hover:bg-white text-slate-700 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1 shadow-sm transition-colors border border-slate-200">
                    <span className="material-symbols-outlined text-sm">list</span> MCQ
                  </button>
                  <button type="button" onClick={() => addQuestion('rating')} className="flex-1 bg-white/60 hover:bg-white text-slate-700 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1 shadow-sm transition-colors border border-slate-200">
                    <span className="material-symbols-outlined text-sm">star</span> Rating
                  </button>
                  <button type="button" onClick={() => addQuestion('image')} className="flex-1 bg-white/60 hover:bg-white text-slate-700 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1 shadow-sm transition-colors border border-slate-200">
                    <span className="material-symbols-outlined text-sm">image</span> Image
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isCreating || !title || questions.length === 0}
                className="mt-4 w-full py-4 bg-slate-800 text-white font-label-lg text-lg rounded-full puffy-shadow felt-texture step-button flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCreating ? (
                  <span className="material-symbols-outlined animate-spin">sync</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">rocket_launch</span>
                    <span>Deploy to Ledger</span>
                  </>
                )}
              </button>
            </form>
            </div>
          )}

          {activeTab === 'active' && (
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 px-2 gap-4">
                <h2 className="font-headline-lg font-bold text-slate-900 drop-shadow-sm">Active Surveys</h2>
                <div className="flex gap-4 items-center">
                  <button 
                    onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                    className="bg-white/50 px-4 py-2 rounded-full inset-puffy font-label-sm text-slate-700 flex items-center gap-2 hover:bg-white/70 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">sort</span>
                    {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                  </button>
                  <span className="font-label-lg text-slate-700 bg-white/50 px-4 py-2 rounded-full inset-puffy">
                    {campaigns.length} Total
                  </span>
                </div>
              </div>
              
          {loading ? (
            <div className="flex justify-center p-12 text-slate-600 font-label-lg animate-pulse">
              Syncing with Midnight Network...
            </div>
          ) : sortedCampaigns.length === 0 ? (
            <div className="bg-white/40 rounded-[3rem] p-12 text-center flex flex-col items-center inset-puffy border border-white/50">
              <span className="material-symbols-outlined text-6xl text-slate-400 mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>inbox</span>
              <h3 className="font-headline-md font-bold text-slate-800">No surveys yet</h3>
              <p className="font-body-md text-slate-600 mt-2 font-medium">Create your first zero-knowledge survey using the form.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {displayedCampaigns.map((camp) => (
                  <motion.div 
                    whileHover={{ y: -5 }}
                    key={camp.id} 
                    className="p-8 rounded-[2rem] bg-[var(--color-cotton-lavender)] puffy-shadow felt-texture flex flex-col justify-between group relative"
                  >
                    <button 
                      onClick={() => handleDelete(camp.id)}
                      className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center border border-slate-200 shadow-sm"
                      title="Delete Survey"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/50 inset-puffy text-slate-800 font-label-sm font-bold flex items-center gap-1.5 uppercase">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          Active
                        </span>
                        <span className="font-label-sm text-slate-500 mr-12">ID: {camp.id}</span>
                      </div>
                      <h3 className="font-headline-md text-slate-900 font-bold group-hover:text-blue-900 transition-colors line-clamp-1 drop-shadow-sm pr-12">
                        {camp.title}
                      </h3>
                      <p className="font-body-sm text-slate-700 font-medium mt-2 line-clamp-2 min-h-[40px]">
                        {camp.description || 'No description provided.'}
                      </p>
                      
                      <div className="mt-4 flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-slate-600 bg-white/40 px-3 py-1.5 rounded-lg border border-white/60">
                          <span className="material-symbols-outlined text-sm">inventory_2</span>
                          <span className="font-label-sm font-bold">{camp.questions?.length || 0} Questions</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 bg-white/40 px-3 py-1.5 rounded-lg border border-white/60">
                          <span className="material-symbols-outlined text-sm">groups</span>
                          <span className="font-label-sm font-bold">{camp.responseCount || 0} Responses</span>
                        </div>
                        {camp.endDate && (
                          <div className="flex items-center gap-1.5 text-slate-600 bg-white/40 px-3 py-1.5 rounded-lg border border-white/60">
                            <span className="material-symbols-outlined text-sm">event</span>
                            <span className="font-label-sm font-bold">{new Date(camp.endDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/40 flex items-center justify-between">
                      <span className="font-label-sm text-slate-600 font-medium">
                        {new Date(camp.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/c/${camp.id}`);
                            alert('Survey link copied to clipboard!');
                          }}
                          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-800 puffy-shadow step-button felt-texture hover:bg-slate-100 transition-colors"
                          title="Copy Survey Link"
                        >
                          <span className="material-symbols-outlined text-sm">link</span>
                        </button>
                        <Link 
                          href={`/dashboard/${camp.id}`}
                          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-800 puffy-shadow step-button felt-texture hover:bg-slate-100 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {sortedCampaigns.length > 4 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="mt-4 py-4 rounded-full bg-white/40 border border-white/60 text-slate-700 font-label-lg hover:bg-white/60 transition-colors puffy-shadow inset-puffy flex items-center justify-center gap-2 mx-auto w-full max-w-sm"
                >
                  {showAll ? (
                    <>Show Less <span className="material-symbols-outlined">expand_less</span></>
                  ) : (
                    <>View All {sortedCampaigns.length} Surveys <span className="material-symbols-outlined">expand_more</span></>
                  )}
                </button>
              )}
            </div>
          )}

            </div>
          )}

          {activeTab === 'stats' && (
            <div className="felt-texture bg-white rounded-[3rem] puffy-shadow p-8 sm:p-12 flex flex-col gap-8 border border-slate-200">
               <h2 className="font-headline-lg font-bold text-slate-900 drop-shadow-sm text-center">Platform Statistics</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                 <div className="bg-[var(--color-cotton-bg)] rounded-3xl p-8 flex flex-col items-center justify-center border border-slate-200 inset-puffy text-center gap-2">
                   <span className="material-symbols-outlined text-4xl text-blue-500 mb-2">grid_view</span>
                   <span className="text-4xl font-bold text-slate-900">{campaigns.length}</span>
                   <span className="font-label-lg text-slate-600 uppercase tracking-widest">Total Surveys Issued</span>
                 </div>
                 <div className="bg-[var(--color-cotton-bg)] rounded-3xl p-8 flex flex-col items-center justify-center border border-slate-200 inset-puffy text-center gap-2">
                   <span className="material-symbols-outlined text-4xl text-green-500 mb-2">forum</span>
                   <span className="text-4xl font-bold text-slate-900">{campaigns.reduce((acc, c) => acc + (c.responseCount || 0), 0)}</span>
                   <span className="font-label-lg text-slate-600 uppercase tracking-widest">Total Secure Responses</span>
                 </div>
               </div>

               {campaigns.length > 0 && (
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-6">
                   {(() => {
                     const barData = campaigns.map(c => ({ name: c.title.substring(0, 15) + (c.title.length > 15 ? '...' : ''), responses: c.responseCount || 0 }));
                     const allQuestions = campaigns.flatMap(c => c.questions || []);
                     const pieData = [
                       { name: 'Text', value: allQuestions.filter(q => q.type === 'text').length },
                       { name: 'MCQ', value: allQuestions.filter(q => q.type === 'mcq').length },
                       { name: 'Rating', value: allQuestions.filter(q => q.type === 'rating').length },
                       { name: 'Image', value: allQuestions.filter(q => q.type === 'image').length },
                     ].filter(d => d.value > 0);
                     const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
                     
                     return (
                       <>
                         <div className="bg-[var(--color-cotton-bg)] rounded-3xl p-6 border border-slate-200 inset-puffy">
                           <h3 className="font-headline-sm font-bold text-slate-800 text-center mb-6">Responses per Survey</h3>
                           <div className="h-64 w-full">
                             <ResponsiveContainer width="100%" height="100%">
                               <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                 <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                 <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                 <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                 <Bar dataKey="responses" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                               </BarChart>
                             </ResponsiveContainer>
                           </div>
                         </div>
                         <div className="bg-[var(--color-cotton-bg)] rounded-3xl p-6 border border-slate-200 inset-puffy">
                           <h3 className="font-headline-sm font-bold text-slate-800 text-center mb-6">Question Types Used</h3>
                           <div className="h-64 w-full">
                             <ResponsiveContainer width="100%" height="100%">
                               <PieChart>
                                 <Pie
                                   data={pieData}
                                   cx="50%"
                                   cy="50%"
                                   innerRadius={60}
                                   outerRadius={80}
                                   paddingAngle={5}
                                   dataKey="value"
                                   stroke="none"
                                 >
                                   {pieData.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                   ))}
                                 </Pie>
                                 <Tooltip contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                               </PieChart>
                             </ResponsiveContainer>
                           </div>
                           <div className="flex justify-center gap-4 mt-2">
                             {pieData.map((entry, index) => (
                               <div key={entry.name} className="flex items-center gap-1.5">
                                 <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                                 <span className="font-label-sm text-slate-600">{entry.name}</span>
                               </div>
                             ))}
                           </div>
                         </div>
                       </>
                     );
                   })()}
                 </div>
               )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
