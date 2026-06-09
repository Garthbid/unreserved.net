import React, { useState } from 'react';
import {
  Play,
  Clock,
  ShieldCheck,
  Eye,
  MapPin,
  Heart,
  Share2,
  MessageSquare,
  UserPlus,
  Sparkles,
  Check,
  Video,
  Camera,
  FileText,
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
  AlertTriangle,
  Plus,
  Zap,
  Hammer,
} from 'lucide-react';
import { FloorTopBar } from './ListingJourney';
import { VEHICLE, LISTING_TASKS, FLOOR_HISTORY, COMMENTS, ImpactLevel } from './sampleData';

const ImpactBadge: React.FC<{ impact: ImpactLevel }> = ({ impact }) => {
  const styles =
    impact === 'High'
      ? 'bg-green-500/15 text-green-300 border-green-500/30'
      : impact === 'Medium'
        ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
        : 'bg-white/[0.04] text-gray-400 border-white/10';
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${styles}`}>
      {impact}
    </span>
  );
};

const Tag: React.FC<{ children: React.ReactNode; variant?: 'green' | 'dark' | 'live' }> = ({
  children,
  variant = 'dark',
}) => {
  const styles =
    variant === 'green'
      ? 'bg-green-500 text-black border-green-400'
      : variant === 'live'
        ? 'bg-red-500/15 text-red-300 border-red-500/30'
        : 'bg-black/70 backdrop-blur text-white border-white/15';
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border ${styles}`}
    >
      {children}
    </span>
  );
};

const taskIcon = (cat: string) => {
  switch (cat) {
    case 'video':
      return Video;
    case 'photo':
      return Camera;
    case 'document':
      return FileText;
    case 'answer':
      return MessageSquare;
    default:
      return Activity;
  }
};

export const FloorMarketItem: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [floorAmount, setFloorAmount] = useState('21900');
  const [expiry, setExpiry] = useState<'1h' | '6h' | '24h'>('1h');
  const [conditional, setConditional] = useState(true);

  const completedTasks = LISTING_TASKS.filter((t) => t.status === 'complete').length;

  return (
    <div className="min-h-screen bg-black text-white">
      <FloorTopBar onNavigate={onNavigate} active="floor-item" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-4">
          <button onClick={() => onNavigate('home')} className="hover:text-white">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => onNavigate('dashboard')} className="hover:text-white">Floor Market</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-300">2012 Ford F-150 Lariat EcoBoost</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Media */}
            <div>
              <div className="relative aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 group">
                <img src={VEHICLE.gallery[activeImg]} alt={VEHICLE.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

                {/* Top tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <Tag variant="green"><Hammer className="w-2.5 h-2.5" /> Floor Market</Tag>
                  <Tag><ShieldCheck className="w-2.5 h-2.5" /> Trust {VEHICLE.trustScore}</Tag>
                  <Tag variant="live"><Clock className="w-2.5 h-2.5" /> Expires in {VEHICLE.offerExpiry}</Tag>
                  <Tag><Eye className="w-2.5 h-2.5" /> {VEHICLE.floorSettersWatching} floor setters</Tag>
                </div>

                {/* Play */}
                <button className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/90 border-2 border-white/30 flex items-center justify-center hover:scale-110 transition shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                    <Play className="w-7 h-7 text-black fill-black ml-1" />
                  </div>
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                {VEHICLE.gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition ${
                      activeImg === i ? 'border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <img src={g} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                <button className="shrink-0 w-24 h-16 rounded-lg border-2 border-dashed border-white/10 hover:border-green-500/40 transition flex items-center justify-center text-gray-500 hover:text-green-400">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Title block */}
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                {VEHICLE.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-gray-400 mt-2">
                <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {VEHICLE.location}</span>
                <span>·</span>
                <span>{VEHICLE.mileage.toLocaleString()} km</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" /> {VEHICLE.views.toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
                    <span className="text-[10px] font-black text-black">JR</span>
                  </div>
                  <div className="text-[12px]">
                    <span className="font-bold text-white">{VEHICLE.seller}</span>
                    <span className="text-gray-500"> · </span>
                    <span className="text-green-400 font-bold inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {VEHICLE.sellerStatus}
                    </span>
                    <span className="text-gray-500"> · {VEHICLE.sellerAuctions} auctions</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <ActionButton icon={UserPlus}>Follow</ActionButton>
                <ActionButton icon={MessageSquare}>Contact</ActionButton>
                <ActionButton icon={Share2}>Share</ActionButton>
                <ActionButton icon={Heart} accent>Watchlist</ActionButton>
              </div>
            </div>

            {/* Build This Listing */}
            <section className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 md:p-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white">Build this listing</h2>
                  <p className="text-[12px] text-gray-500 mt-1 max-w-md">
                    Verified floor setters can request proof before raising their guarantees.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Trust Potential</div>
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-2xl font-black tabular-nums text-white">{VEHICLE.trustScore}</span>
                    <span className="text-sm font-bold text-gray-500">→</span>
                    <span className="text-2xl font-black tabular-nums text-green-400">{VEHICLE.trustScorePotential}</span>
                  </div>
                </div>
              </div>

              <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-3 mb-5 relative">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${VEHICLE.trustScore}%` }} />
                <div
                  className="absolute inset-y-0 bg-green-500/30 border-r-2 border-green-400"
                  style={{ left: `${VEHICLE.trustScore}%`, width: `${VEHICLE.trustScorePotential - VEHICLE.trustScore}%` }}
                />
              </div>

              <div className="space-y-2">
                {LISTING_TASKS.map((t) => {
                  const Icon = taskIcon(t.category);
                  const done = t.status === 'complete';
                  return (
                    <div
                      key={t.id}
                      className={`rounded-xl border p-3 md:p-4 transition group ${
                        done
                          ? 'bg-green-500/5 border-green-500/20'
                          : 'bg-[#0d0d0d] border-white/5 hover:border-green-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            done ? 'bg-green-500/20 text-green-300' : 'bg-white/5 text-gray-400'
                          }`}
                        >
                          {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[13px] font-bold ${done ? 'text-green-200' : 'text-white'}`}>
                              {t.label}
                            </span>
                            {done && (
                              <span className="text-[9px] font-black uppercase tracking-widest text-green-400">
                                Complete
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5">
                            Requested by <span className="text-gray-300 font-bold">{t.requestedBy}</span> floor{' '}
                            {t.requestedBy === 1 ? 'setter' : 'setters'}
                          </div>
                        </div>
                        <ImpactBadge impact={t.impact} />
                        {done ? (
                          <button className="hidden sm:inline-flex bg-white/[0.05] text-gray-400 border border-white/10 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                            Request more
                          </button>
                        ) : (
                          <button className="hidden sm:inline-flex bg-green-500/10 hover:bg-green-500 hover:text-black text-green-300 border border-green-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition">
                            Upload / Respond
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-[10px] text-gray-500 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-green-400" />
                {completedTasks} of {LISTING_TASKS.length} tasks complete. Finishing all could unlock{' '}
                <span className="text-green-400 font-bold">+{VEHICLE.trustScorePotential - VEHICLE.trustScore} trust</span>.
              </div>
            </section>

            {/* Floor Setter Q&A */}
            <section className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 md:p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-black uppercase tracking-tight text-white">Floor Setter Q&amp;A</h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Verified floor setters only
                </span>
              </div>
              <p className="text-[12px] text-gray-500 mb-5">
                Underwriting questions and seller responses. Comments can become listing tasks.
              </p>

              {/* AI Summary */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/[0.03] border border-purple-500/25 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-300">GarthAI Summary</span>
                </div>
                <ul className="space-y-1.5 text-[12px] text-gray-300 leading-snug">
                  <li>· 4 floor setters are waiting for cold-start proof</li>
                  <li>· 5 floor setters requested title / lien verification</li>
                  <li>· Most important missing item: <span className="text-white font-bold">undercarriage photos</span></li>
                  <li>· Completing these could materially improve floor confidence</li>
                </ul>
              </div>

              <div className="space-y-3">
                {COMMENTS.map((c) => {
                  const isSeller = c.badge === 'Seller';
                  return (
                    <div
                      key={c.id}
                      className={`rounded-xl border p-4 ${
                        isSeller
                          ? 'bg-green-500/5 border-green-500/25 ml-0 md:ml-8'
                          : 'bg-[#0d0d0d] border-white/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                            isSeller
                              ? 'bg-gradient-to-br from-green-500 to-emerald-700 text-black'
                              : 'bg-white/[0.06] text-gray-300 border border-white/10'
                          }`}
                        >
                          <span className="text-[10px] font-black">{c.user.replace('@', '').slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <span className={`text-[12px] font-bold ${isSeller ? 'text-green-300' : 'text-white'}`}>
                              {c.user}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${
                                isSeller
                                  ? 'bg-green-500/15 text-green-300 border-green-500/30'
                                  : 'bg-white/[0.04] text-gray-400 border-white/10'
                              }`}
                            >
                              {c.badge}
                            </span>
                            <span className="text-[10px] text-gray-600">· {c.ago}</span>
                          </div>
                          <p className="text-[13px] text-gray-200 leading-relaxed">{c.text}</p>
                          {!isSeller && (
                            <div className="flex flex-wrap gap-2 mt-2.5">
                              <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-green-400 transition">
                                Convert to task
                              </button>
                              <span className="text-gray-700">·</span>
                              <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-green-400 transition">
                                Reply
                              </button>
                              <span className="text-gray-700">·</span>
                              <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-green-400 transition">
                                Upvote
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="mt-4 w-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition">
                Load more comments
              </button>
            </section>

            {/* Floor History */}
            <section className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black uppercase tracking-tight text-white">Floor History</h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  {FLOOR_HISTORY.length} entries
                </span>
              </div>
              <div className="space-y-2">
                {FLOOR_HISTORY.map((b) => {
                  const styles = {
                    active: 'border-green-500/40 bg-green-500/5',
                    expired: 'border-white/5 bg-[#0d0d0d] opacity-60',
                    conditional: 'border-yellow-500/30 bg-yellow-500/5',
                    baseline: 'border-blue-500/25 bg-blue-500/5',
                  }[b.status];
                  return (
                    <div key={b.id} className={`rounded-xl border p-3 flex items-center gap-3 ${styles}`}>
                      <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                        {b.user.replace('@', '').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[12px] font-bold text-white">{b.user}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/10">
                            {b.status}
                          </span>
                        </div>
                        {b.note && <div className="text-[10px] text-gray-500 mt-0.5">{b.note}</div>}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-black tabular-nums text-white">${b.amount.toLocaleString()}</div>
                        {b.expiresIn && (
                          <div className="text-[9px] font-bold text-green-400 uppercase tracking-widest">
                            <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                            {b.expiresIn} left
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Trust Score detail */}
            <section className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 md:p-6">
              <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4">Trust Score Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                <TrustDetail label="Seller Identity" value="Verified" verified />
                <TrustDetail label="VIN" value="Verified" verified />
                <TrustDetail label="Odometer" value="Verified" verified />
                <TrustDetail label="Photos" value="78%" pct={78} />
                <TrustDetail label="Videos" value="35%" pct={35} warn />
                <TrustDetail label="Ownership docs" value="Missing" missing />
                <TrustDetail label="Condition answers" value="Complete" verified />
                <TrustDetail label="Floor Setter Review" value="Active" verified />
                <TrustDetail label="AI Confidence" value="Medium" pct={60} />
              </div>
            </section>

            {/* Public auction readiness */}
            <section className="bg-gradient-to-br from-yellow-500/10 to-orange-500/[0.03] border border-yellow-500/30 rounded-2xl p-5 md:p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">
                  Public Auction Readiness
                </span>
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white mb-3">
                Not ready for public auction yet
              </h3>
              <p className="text-[12px] text-gray-400 mb-4">Missing before launch:</p>
              <ul className="space-y-2 mb-4">
                <ReadinessItem>Seller must accept a floor</ReadinessItem>
                <ReadinessItem>Title / lien status should be verified</ReadinessItem>
                <ReadinessItem>Cold-start video recommended</ReadinessItem>
                <ReadinessItem>Undercarriage photos recommended</ReadinessItem>
              </ul>
              <div className="bg-black/40 border border-white/5 rounded-lg p-3">
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Once enough tasks are complete and a floor is accepted, this listing will read:{' '}
                  <span className="text-green-300 font-bold">
                    "Ready to launch unreserved once seller accepts a floor."
                  </span>
                </p>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-3">
            {/* Summary cards */}
            <div className="bg-gradient-to-br from-green-500/15 to-emerald-500/[0.05] border border-green-500/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-green-300" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-300">Top Floor Bid</span>
              </div>
              <div className="text-4xl font-black tabular-nums text-white leading-none">
                ${VEHICLE.currentTopFloor.toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                <span>1 floor bid</span>
                <span>·</span>
                <Clock className="w-3 h-3 text-green-400" />
                <span className="text-green-300 font-bold">Expires in {VEHICLE.offerExpiry}</span>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">AI Estimate</span>
              </div>
              <div className="text-2xl font-black tabular-nums text-white leading-none">
                ${(VEHICLE.aiEstimateLow / 1000).toFixed(1)}k – ${(VEHICLE.aiEstimateHigh / 1000).toFixed(1)}k
              </div>
              <div className="text-[10px] text-gray-500 mt-2">Based on market comps</div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Trust Score</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-3xl font-black tabular-nums text-white leading-none">{VEHICLE.trustScore}</span>
                <span className="text-xs font-bold text-gray-500">/100</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${VEHICLE.trustScore}%` }} />
              </div>
              <p className="text-[10px] text-gray-500 leading-snug">
                Complete requested tasks to unlock stronger guarantees.
              </p>
            </div>

            {/* Floor bidding card */}
            <div className="bg-[#0a0a0a] border border-green-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(34,197,94,0.08)]">
              <div className="flex items-center gap-2 mb-1">
                <Hammer className="w-3.5 h-3.5 text-green-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-300">Set The Floor</span>
              </div>
              <h3 className="text-lg font-black text-white leading-tight mb-1">Set the floor. Get paid if accepted.</h3>
              <p className="text-[11px] text-gray-400 leading-snug mb-4">
                Submit a guaranteed floor. If the seller accepts and the auction does not beat your floor, you buy it.
              </p>

              <label className="flex flex-col gap-1 mb-3">
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-500">Your floor bid</span>
                <div className="flex items-center bg-[#111] border border-white/10 rounded-lg overflow-hidden focus-within:border-green-500/40">
                  <span className="px-3 text-gray-500 text-sm font-bold">$</span>
                  <input
                    value={floorAmount}
                    onChange={(e) => setFloorAmount(e.target.value)}
                    className="flex-1 bg-transparent py-2.5 outline-none text-base font-black text-white tabular-nums"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1 mb-3">
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-500">Expiry</span>
                <div className="flex gap-1 bg-[#111] border border-white/10 rounded-lg p-1">
                  {(['1h', '6h', '24h'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setExpiry(opt)}
                      className={`flex-1 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition ${
                        expiry === opt ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {opt === '1h' ? '1 hour' : opt === '6h' ? '6 hours' : '24 hours'}
                    </button>
                  ))}
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer mb-4 bg-[#0d0d0d] border border-white/5 rounded-lg p-3 hover:border-green-500/30 transition">
                <input
                  type="checkbox"
                  checked={conditional}
                  onChange={(e) => setConditional(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-green-500"
                />
                <div>
                  <div className="text-[11px] font-bold text-white">Conditional offer</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                    Increase my floor if seller completes specific tasks
                  </div>
                </div>
              </label>

              <div className="bg-[#0d0d0d] border border-white/5 rounded-lg p-3 mb-4 space-y-1.5">
                <Row label="Current offer" value={`$${Number(floorAmount).toLocaleString()}`} />
                <Row label="Reward if accepted" value={`$${Math.round(Number(floorAmount) * 0.01).toLocaleString()}`} accent />
              </div>

              <button className="w-full inline-flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-400 text-black font-black text-xs uppercase tracking-widest px-4 py-3 rounded-full transition shadow-[0_0_24px_rgba(34,197,94,0.4)]">
                Place {expiry === '1h' ? '1-Hour' : expiry === '6h' ? '6-Hour' : '24-Hour'} Floor Bid
                <Zap className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-3.5 h-3.5 text-green-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Live activity</span>
              </div>
              <ul className="space-y-2 text-[11px] text-gray-400 leading-snug">
                <li><span className="text-white font-bold">@prairie_trucks</span> requested cold-start video</li>
                <li><span className="text-white font-bold">@yycauto</span> asked about warning lights</li>
                <li><span className="text-white font-bold">Justin Rogers</span> uploaded walkaround video</li>
                <li><span className="text-white font-bold">GarthAI</span> flagged blurry odometer</li>
                <li><span className="text-white font-bold">@fleetbuyer</span> added conditional floor</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ icon: any; children: React.ReactNode; accent?: boolean }> = ({
  icon: Icon,
  children,
  accent,
}) => (
  <button
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition ${
      accent
        ? 'bg-green-500/10 hover:bg-green-500 hover:text-black text-green-300 border-green-500/30'
        : 'bg-white/[0.04] hover:bg-white/[0.1] text-white border-white/10'
    }`}
  >
    <Icon className="w-3 h-3" /> {children}
  </button>
);

const Row: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className="flex items-center justify-between">
    <span className="text-[11px] text-gray-400">{label}</span>
    <span className={`text-[12px] font-black tabular-nums ${accent ? 'text-green-400' : 'text-white'}`}>{value}</span>
  </div>
);

const TrustDetail: React.FC<{
  label: string;
  value: string;
  verified?: boolean;
  missing?: boolean;
  warn?: boolean;
  pct?: number;
}> = ({ label, value, verified, missing, warn, pct }) => (
  <div className="flex items-center gap-3 py-1">
    <span className="text-[11px] text-gray-400 flex-1">{label}</span>
    {pct !== undefined && (
      <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${warn ? 'bg-yellow-400' : 'bg-green-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    )}
    <span
      className={`text-[10px] font-black uppercase tracking-widest ${
        verified ? 'text-green-400' : missing ? 'text-red-400' : warn ? 'text-yellow-300' : 'text-gray-300'
      }`}
    >
      {verified && <Check className="w-3 h-3 inline -mt-0.5 mr-0.5" />}
      {value}
    </span>
  </div>
);

const ReadinessItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-2 text-[12px] text-gray-300">
    <div className="w-4 h-4 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center mt-0.5 shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
    </div>
    <span>{children}</span>
  </li>
);
