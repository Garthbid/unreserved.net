import React from 'react';
import {
  TrendingUp,
  Layers,
  Clock,
  ShieldCheck,
  Rocket,
  Eye,
  AlertCircle,
  Video,
  Camera,
  FileText,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Activity,
  Plus,
  Zap,
} from 'lucide-react';
import { FloorTopBar } from './ListingJourney';
import { SELLER_LISTINGS, NOTIFICATIONS, LISTING_TASKS, ImpactLevel } from './sampleData';

const ImpactBadge: React.FC<{ impact: ImpactLevel }> = ({ impact }) => {
  const styles =
    impact === 'High'
      ? 'bg-green-500/15 text-green-300 border-green-500/30'
      : impact === 'Medium'
        ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
        : 'bg-white/[0.04] text-gray-400 border-white/10';
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${styles}`}>
      {impact} impact
    </span>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    Draft: 'bg-white/5 text-gray-400 border-white/10',
    'In Floor Market': 'bg-green-500/15 text-green-300 border-green-500/30',
    'Floor Accepted': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    'Auction Live': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    Sold: 'bg-white/10 text-gray-200 border-white/15',
  };
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${map[status]}`}>
      {status}
    </span>
  );
};

const SummaryCard: React.FC<{
  icon: any;
  label: string;
  value: string;
  accent?: 'green' | 'default';
  sub?: string;
}> = ({ icon: Icon, label, value, accent = 'default', sub }) => (
  <div
    className={`rounded-2xl border p-4 md:p-5 ${
      accent === 'green'
        ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/[0.04] border-green-500/30'
        : 'bg-[#0a0a0a] border-white/5'
    }`}
  >
    <div className="flex items-center gap-2 mb-3">
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
          accent === 'green' ? 'bg-green-500/20 text-green-300' : 'bg-white/[0.05] text-gray-400'
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-500">{label}</span>
    </div>
    <div className="text-2xl md:text-3xl font-black tabular-nums text-white leading-none">{value}</div>
    {sub && <div className="text-[10px] text-gray-500 mt-1.5 font-medium">{sub}</div>}
  </div>
);

const ListingCard: React.FC<{
  listing: (typeof SELLER_LISTINGS)[number];
  onOpen: () => void;
}> = ({ listing, onOpen }) => {
  const trustColor =
    listing.trustScore >= 80 ? 'text-green-400' : listing.trustScore >= 60 ? 'text-yellow-300' : 'text-orange-400';
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition group">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-0">
        <div className="relative aspect-video md:aspect-auto md:h-full bg-neutral-900 overflow-hidden">
          <img src={listing.image} alt={listing.title} className="absolute inset-0 w-full h-full object-cover" />
          {listing.expiry && (
            <div className="absolute top-2 left-2 bg-black/80 border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-green-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white">{listing.expiry}</span>
            </div>
          )}
        </div>

        <div className="p-4 md:p-5 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={listing.status} />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
              Trust <span className={trustColor}>{listing.trustScore}</span>/100
            </span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-white leading-tight">{listing.title}</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1">
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Top Floor</div>
              <div className="text-sm font-black text-white tabular-nums">
                {listing.topFloor ? `$${listing.topFloor.toLocaleString()}` : '—'}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">AI Estimate</div>
              <div className="text-sm font-bold text-gray-300 tabular-nums">
                ${(listing.aiEstimateLow / 1000).toFixed(1)}k–${(listing.aiEstimateHigh / 1000).toFixed(1)}k
              </div>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Watching</div>
              <div className="text-sm font-bold text-gray-300 flex items-center gap-1">
                <Eye className="w-3 h-3 text-gray-500" />
                {listing.watching}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Requests</div>
              <div className="text-sm font-bold text-gray-300 flex items-center gap-1">
                <AlertCircle className={`w-3 h-3 ${listing.requestsPending ? 'text-yellow-400' : 'text-gray-500'}`} />
                {listing.requestsPending} pending
              </div>
            </div>
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-white/5 p-4 flex md:flex-col items-stretch justify-between gap-2 md:min-w-[170px]">
          <button
            onClick={onOpen}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-400 text-black text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full transition shadow-[0_0_18px_rgba(34,197,94,0.25)]"
          >
            {listing.cta} <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};

const notifIcon = (type: string) => {
  switch (type) {
    case 'video':
      return Video;
    case 'photo':
      return Camera;
    case 'document':
      return FileText;
    case 'question':
      return MessageSquare;
    case 'ai':
      return Sparkles;
    default:
      return Activity;
  }
};

export const SellerDashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const tasksByListing = LISTING_TASKS.filter((t) => t.status === 'incomplete');

  return (
    <div className="min-h-screen bg-black text-white">
      <FloorTopBar onNavigate={onNavigate} active="dashboard" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              Seller <span className="text-green-500">Control</span> Center
            </h1>
            <p className="text-sm text-gray-400 mt-1.5 max-w-2xl">
              Manage your listings, respond to floor setter requests, and improve your Trust Score to unlock stronger
              guaranteed offers.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('floor-item')}
              className="inline-flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition"
            >
              <Zap className="w-3.5 h-3.5" /> Open Floor Market
            </button>
            <button
              onClick={() => onNavigate('listing')}
              className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-black text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full transition shadow-[0_0_18px_rgba(34,197,94,0.35)]"
            >
              <Plus className="w-3.5 h-3.5" /> List Vehicle
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-7">
          <SummaryCard icon={Layers} label="Active Listings" value="3" />
          <SummaryCard icon={TrendingUp} label="Highest Floor" value="$21,800" accent="green" sub="On F-150 Lariat" />
          <SummaryCard icon={AlertCircle} label="Pending Requests" value="7" sub="Across 3 vehicles" />
          <SummaryCard icon={ShieldCheck} label="Avg Trust Score" value="72" sub="+8 this week" />
          <SummaryCard icon={Rocket} label="Ready to Launch" value="1" accent="green" sub="Tacoma TRD" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Main column */}
          <div className="space-y-6">
            {/* Listings */}
            <section>
              <SectionHeader title="Your Listings" hint="3 active" />
              <div className="space-y-3">
                {SELLER_LISTINGS.map((l) => (
                  <ListingCard key={l.id} listing={l} onOpen={() => onNavigate('floor-item')} />
                ))}
              </div>
            </section>

            {/* Notification feed */}
            <section>
              <SectionHeader title="Floor Setter Requests" hint={`${NOTIFICATIONS.length} new`} />
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl divide-y divide-white/5">
                {NOTIFICATIONS.map((n) => {
                  const Icon = notifIcon(n.type);
                  const isAI = n.type === 'ai';
                  return (
                    <div key={n.id} className="flex items-start gap-3 p-4 hover:bg-white/[0.02] transition">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isAI ? 'bg-purple-500/15 text-purple-300' : 'bg-green-500/10 text-green-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className={`text-[12px] font-bold ${isAI ? 'text-purple-300' : 'text-white'}`}>
                            {n.user}
                          </span>
                          <ImpactBadge impact={n.impact} />
                        </div>
                        <p className="text-[12px] text-gray-400 leading-snug">
                          <span className="text-gray-300">{n.text}</span>{' '}
                          <span className="text-gray-500">· {n.vehicle}</span>
                        </p>
                      </div>
                      <button className="shrink-0 bg-white/[0.05] hover:bg-green-500 hover:text-black text-white border border-white/10 hover:border-green-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition">
                        Complete task
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Task list grouped by listing */}
            <section>
              <SectionHeader title="Open Tasks · 2012 Ford F-150 Lariat" hint={`${tasksByListing.length} requests`} />
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 md:p-5">
                <div className="space-y-2.5">
                  {tasksByListing.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#0d0d0d] border border-white/5 hover:border-green-500/30 transition group"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-white leading-snug">{t.label}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          Requested by {t.requestedBy} floor {t.requestedBy === 1 ? 'setter' : 'setters'}
                        </div>
                      </div>
                      <ImpactBadge impact={t.impact} />
                      <button className="bg-green-500/10 hover:bg-green-500 hover:text-black text-green-300 border border-green-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition">
                        Complete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Coaching panel */}
          <aside className="space-y-4">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/[0.03] border border-green-500/30 rounded-2xl p-5 sticky top-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-300">
                  Improve your floor offers
                </span>
              </div>
              <ul className="space-y-2.5 text-[12px] text-gray-300 leading-relaxed">
                <CoachItem>Complete high-impact requests first</CoachItem>
                <CoachItem>Upload videos in daylight</CoachItem>
                <CoachItem>Show known issues honestly</CoachItem>
                <CoachItem>Verify title / lien status</CoachItem>
                <CoachItem>Respond quickly to floor setter questions</CoachItem>
              </ul>
              <button
                onClick={() => onNavigate('floor-item')}
                className="mt-5 w-full inline-flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-400 text-black text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full transition shadow-[0_0_18px_rgba(34,197,94,0.35)]"
              >
                Open Floor Market <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Weekly progress</span>
                <span className="text-[10px] font-black text-green-400">+12 trust</span>
              </div>
              <div className="space-y-3">
                <ProgressRow label="Photos uploaded" value="8 / 12" pct={66} />
                <ProgressRow label="Videos uploaded" value="1 / 5" pct={20} />
                <ProgressRow label="Questions answered" value="9 / 11" pct={82} />
                <ProgressRow label="Documents verified" value="2 / 4" pct={50} />
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Live activity</span>
              </div>
              <ul className="space-y-2 text-[11px] text-gray-400 leading-snug">
                <li><span className="text-white font-bold">@prairie_trucks</span> raised floor by $300</li>
                <li><span className="text-white font-bold">@yycauto</span> asked a question on F-150</li>
                <li><span className="text-white font-bold">GarthAI</span> ran condition pass on Tacoma</li>
                <li><span className="text-white font-bold">@fleetbuyer</span> added a conditional bid</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => (
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-sm font-black uppercase tracking-[0.18em] text-gray-300">{title}</h2>
    {hint && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{hint}</span>}
  </div>
);

const CoachItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-2">
    <span className="w-1 h-1 rounded-full bg-green-400 mt-1.5 shrink-0" />
    <span>{children}</span>
  </li>
);

const ProgressRow: React.FC<{ label: string; value: string; pct: number }> = ({ label, value, pct }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] text-gray-400">{label}</span>
      <span className="text-[11px] font-bold text-white tabular-nums">{value}</span>
    </div>
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  </div>
);
