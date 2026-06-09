import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  MapPin,
  Timer,
  AlertTriangle,
  History,
  FileText,
  Info,
  Gavel,
  Zap,
  BarChart3,
  Lock,
  DollarSign,
  ArrowDownRight,
  ShieldCheck,
  Globe,
  CheckCircle2,
  Eye,
  Plus,
  ExternalLink,
  Play,
  Crown,
  BadgeCheck,
  MessageCircle,
  Phone,
  Sparkles,
  ChevronDown,
  Heart,
  Send,
  MessageSquare,
  Forward,
  Bookmark,
} from 'lucide-react';
import { AuctionItem } from './types';
import { cn, formatCurrency } from './lib/utils';

// ---------- Pills / badges ----------

const Badge = ({
  children,
  className,
  variant = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'outline' | 'secondary';
}) => {
  const variants = {
    default: 'bg-secondary text-secondary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent/20 text-accent border border-accent/30',
    outline: 'border border-border text-muted-foreground',
  } as const;
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};

const editorialBadgeStyle = (badge?: string) => {
  switch (badge) {
    case 'Editor Pick':
      return { className: 'bg-accent text-black border-transparent shadow-md shadow-accent/30' };
    case 'Strong Buy':
      return { className: 'bg-accent text-black border-transparent shadow-md shadow-accent/30' };
    case 'Under Market':
      return { className: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' };
    case 'Ending Soon':
      return { className: 'bg-red-500/15 text-red-300 border border-red-500/30' };
    case 'Native Listing':
      return { className: 'bg-accent text-black border-transparent shadow-md shadow-accent/30' };
    case 'High Trust':
      return { className: 'bg-sky-500/15 text-sky-300 border border-sky-500/30' };
    case 'Needs Caution':
      return { className: 'bg-amber-500/15 text-amber-300 border border-amber-500/30' };
    case 'Low Info':
      return { className: 'bg-zinc-500/15 text-zinc-300 border border-zinc-500/30' };
    case 'Hidden Gem':
      return { className: 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30' };
    case 'Cinematic Feature':
      return {
        className:
          'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30 shadow-md shadow-fuchsia-500/20',
      };
    default:
      return { className: 'bg-white/5 text-foreground/80 border border-white/10' };
  }
};

const EditorialBadgePill: React.FC<{ badge?: string; className?: string }> = ({ badge, className }) => {
  if (!badge) return null;
  const { className: style } = editorialBadgeStyle(badge);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] md:text-[9px] font-black uppercase tracking-[0.18em] whitespace-nowrap',
        style,
        className,
      )}
    >
      <Eye size={10} />
      {badge}
    </span>
  );
};

// ---------- Native bidding panel ----------

const NativeBiddingPanel: React.FC<{ item: AuctionItem }> = ({ item }) => {
  const initialBid = item.currentBid ?? 0;
  const increment = useMemo(() => {
    if (initialBid < 5000) return 100;
    if (initialBid < 25000) return 500;
    if (initialBid < 100000) return 1000;
    return 2500;
  }, [initialBid]);

  const [currentBid, setCurrentBid] = useState(initialBid);
  const [bidInput, setBidInput] = useState<number>(initialBid + increment);
  const [bidCount, setBidCount] = useState(() => 8 + Math.floor((item.confidenceScore ?? 80) / 6));
  const [watchers] = useState(() => 80 + Math.floor((item.views ?? 100) / 4));
  const [justBid, setJustBid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(item.timeLeft ?? '—');

  useEffect(() => {
    if (!item.endTime) return;
    const fmt = () => {
      const ms = new Date(item.endTime!).getTime() - Date.now();
      if (ms <= 0) return null;
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms / 3600000) % 24);
      const m = Math.floor((ms / 60000) % 60);
      const s = Math.floor((ms / 1000) % 60);
      if (d > 0) return `${d}d ${h}h ${m}m`;
      if (h > 0) return `${h}h ${m}m ${s}s`;
      return `${m}m ${s}s`;
    };
    const tick = () => {
      const v = fmt();
      if (v) setTimeLeft(v);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [item.endTime]);

  const minNext = currentBid + increment;
  const canBid = bidInput >= minNext;

  const placeBid = () => {
    if (!canBid) return;
    setCurrentBid(bidInput);
    setBidInput(bidInput + increment);
    setBidCount(c => c + 1);
    setJustBid(true);
    setTimeout(() => setJustBid(false), 1400);
  };

  return (
    <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/[0.05] via-background to-background overflow-hidden relative shadow-[0_0_50px_rgba(29,208,88,0.12)]">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-accent/15 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative px-5 py-3.5 bg-accent/[0.08] border-b border-accent/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent shadow-[0_0_8px_rgba(29,208,88,0.9)]"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-accent">
            Bid Live · {item.isNative ? 'Native Auction' : 'External Auction'}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/85">
          <Timer size={11} />
          {timeLeft}
        </span>
      </div>

      <div className="relative px-6 pt-5 pb-4">
        <div className="flex items-end justify-between mb-1.5">
          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground">
            Current Bid
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 tabular-nums">
            {bidCount} bid{bidCount !== 1 ? 's' : ''}
          </span>
        </div>
        <motion.div
          key={currentBid}
          initial={{ scale: 1 }}
          animate={{ scale: justBid ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-[44px] font-black text-accent tracking-tighter tabular-nums leading-none"
          style={{ textShadow: '0 0 24px rgba(29,208,88,0.25)' }}
        >
          {formatCurrency(currentBid)}
        </motion.div>
        <p className="text-[10px] text-muted-foreground/85 mt-2.5 tabular-nums">
          Min. next bid <span className="text-foreground font-bold">{formatCurrency(minNext)}</span>
          <span className="text-muted-foreground/40 mx-1.5">·</span>
          Increment <span className="text-foreground font-bold">{formatCurrency(increment)}</span>
        </p>
      </div>

      <div className="relative px-6 pt-1 pb-5 space-y-3">
        {item.isNative && (
          <div className="space-y-1.5">
            <div className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground">Your Bid</div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black">$</span>
              <input
                type="number"
                value={Number.isFinite(bidInput) ? bidInput : ''}
                onChange={(e) => setBidInput(parseInt(e.target.value, 10) || 0)}
                min={minNext}
                step={increment}
                className={cn(
                  'w-full py-3 bg-background border rounded-xl pl-8 pr-4 outline-none transition-all font-black text-xl tabular-nums',
                  canBid
                    ? 'border-accent/40 focus:border-accent focus:ring-2 focus:ring-accent/20'
                    : 'border-red-500/40 focus:border-red-500/60',
                )}
              />
            </div>
            {!canBid && (
              <p className="text-[10px] text-red-400 font-bold">Bid must be at least {formatCurrency(minNext)}</p>
            )}
          </div>
        )}

        {item.isNative ? (
          <button
            onClick={placeBid}
            disabled={!canBid}
            className={cn(
              'w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all',
              canBid
                ? 'bg-accent hover:bg-accent/90 text-black shadow-[0_0_24px_rgba(29,208,88,0.25)] hover:shadow-[0_0_32px_rgba(29,208,88,0.45)] active:scale-[0.99]'
                : 'bg-white/5 text-muted-foreground/50 cursor-not-allowed',
            )}
          >
            <Gavel size={14} strokeWidth={3} />
            Place Bid
          </button>
        ) : (
          <a
            href={item.sourceUrl || '#'}
            target={item.sourceUrl ? '_blank' : undefined}
            rel="noreferrer"
            className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-accent hover:bg-accent/90 text-black shadow-[0_0_24px_rgba(29,208,88,0.25)] hover:shadow-[0_0_32px_rgba(29,208,88,0.45)] active:scale-[0.99]"
          >
            <ExternalLink size={14} strokeWidth={3} />
            View Bidding Link
          </a>
        )}

        <button className="w-full h-10 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/30 text-foreground/85 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5">
          <Plus size={12} strokeWidth={3} />
          To Watchlist
        </button>
      </div>

      <div className="relative px-4 py-3 bg-black/40 border-t border-white/5 flex items-center justify-around text-[9px] font-black uppercase tracking-widest text-muted-foreground/85">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={10} className="text-accent" /> Zero buyer fees
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={10} className="text-accent" /> Verified seller
        </span>
        <span className="flex items-center gap-1.5">
          <Eye size={10} className="text-accent" /> {watchers} watching
        </span>
      </div>
    </div>
  );
};

// ---------- Floor-setter panel ----------

const FLOOR_BID_TTL_MS = 60 * 60 * 1000;

const useNowTick = (intervalMs = 1000) => {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
};

const formatCountdown = (ms: number) => {
  if (!Number.isFinite(ms) || ms <= 0) return '00:00';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

type FloorBidStatus = 'active' | 'expired' | 'accepted';
type FloorHistoryEntry = {
  user: string;
  offset: number;
  minutesAgo: number;
  status: FloorBidStatus;
};

const FLOOR_HISTORY_BASE: FloorHistoryEntry[] = [
  { user: 'user2345',      offset:     0, minutesAgo:    18, status: 'active' },
  { user: 'prairie_buyer', offset:  -100, minutesAgo:   240, status: 'expired' },
  { user: 'kls_holdings',  offset:  -200, minutesAgo:   480, status: 'expired' },
  { user: 'truckguy_88',   offset:  -300, minutesAgo:   660, status: 'expired' },
  { user: 'lariat_fan',    offset:  -400, minutesAgo:  1440, status: 'expired' },
  { user: 'shopfloor',     offset:  -600, minutesAgo:  1680, status: 'expired' },
  { user: 'mtn_motors',    offset:  -700, minutesAgo:  2880, status: 'expired' },
];

const formatTimestamp = (minutesAgo: number) => {
  const d = new Date(Date.now() - minutesAgo * 60 * 1000);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const FloorSetterPanel: React.FC<{ item: AuctionItem }> = ({ item }) => {
  const initialBid = item.currentBid ?? 0;
  const FLOOR_RAISE_INCREMENT = 100;
  const minNext = initialBid + FLOOR_RAISE_INCREMENT;
  const [floorInput, setFloorInput] = useState<number>(minNext);
  const reward = Math.max(0, Math.round(floorInput * 0.01));

  const estLow = useMemo(() => Math.round((initialBid * 1.025) / 100) * 100, [initialBid]);
  const estHigh = useMemo(() => Math.round((initialBid * 1.23) / 100) * 100, [initialBid]);

  const topEntry = FLOOR_HISTORY_BASE.find((e) => e.status === 'active') ?? FLOOR_HISTORY_BASE[0];
  const topFloorAmount = initialBid + topEntry.offset;
  const topPlacedAt = useMemo(() => Date.now() - topEntry.minutesAgo * 60 * 1000, [topEntry.minutesAgo]);
  const now = useNowTick(1000);
  const topRemaining = topPlacedAt + FLOOR_BID_TTL_MS - now;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-secondary/[0.04] px-4 md:px-5 py-4">
          <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-2">
            Top Floor Bid
          </div>
          <div className="text-2xl md:text-3xl font-black text-accent tabular-nums leading-none">
            {formatCurrency(initialBid)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-2">1 floor bid</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-secondary/[0.04] px-4 md:px-5 py-4">
          <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-2">
            AI Estimate
          </div>
          <div className="text-base md:text-xl font-black tabular-nums leading-none">
            {formatCurrency(estLow)} – {formatCurrency(estHigh)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-2">Based on market comps</div>
        </div>
      </div>

      <div className="relative rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/[0.05] via-background to-background overflow-hidden shadow-[0_0_50px_rgba(29,208,88,0.12)]">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-accent/15 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative px-5 md:px-6 py-5 space-y-5">
          <div className="flex items-center justify-between gap-3 -mt-1 pb-3 border-b border-white/[0.06] tabular-nums">
            <div className="text-[12px] text-foreground/85 truncate">
              Top floor:{' '}
              <span className="font-bold text-foreground">{formatCurrency(topFloorAmount)}</span>{' '}
              <span className="text-muted-foreground">by</span>{' '}
              <span className="font-bold">@{topEntry.user}</span>
            </div>
            {topRemaining > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-[10px] font-black uppercase tracking-[0.14em] shrink-0 tabular-nums">
                <Timer size={10} />
                Expires in {formatCountdown(topRemaining)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.04] border border-white/10 text-muted-foreground text-[10px] font-black uppercase tracking-[0.14em] shrink-0">
                Expired
              </span>
            )}
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
              <DollarSign size={18} className="text-accent" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base md:text-lg font-black tracking-tight leading-tight">
                Set the floor. Get paid instantly.
              </h3>
              <p className="text-[13px] text-foreground/85 mt-1.5 leading-snug">
                Earn <span className="text-accent font-black">1% cash reward</span> if seller accepts.
              </p>
              <p className="text-[12px] text-muted-foreground mt-1 leading-snug">
                If the auction doesn't beat your floor, you buy it.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground">
              Your Floor Bid
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black">$</span>
              <input
                type="number"
                value={Number.isFinite(floorInput) ? floorInput : ''}
                onChange={(e) => setFloorInput(parseInt(e.target.value, 10) || 0)}
                className="w-full py-3 bg-background border border-accent/40 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl pl-8 pr-4 outline-none transition-all font-black text-xl tabular-nums"
              />
            </div>
            <p className="text-[11px] text-muted-foreground tabular-nums flex items-center gap-1.5">
              Minimum floor raise: <span className="text-foreground font-bold">{formatCurrency(minNext)}</span>
            </p>
          </div>

          <div className="text-[11px] text-muted-foreground tabular-nums">
            Instant reward if accepted:{' '}
            <span className="text-accent font-black">
              {formatCurrency(floorInput >= minNext ? reward : Math.round(minNext * 0.01))}
            </span>
          </div>

          <button
            className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-accent hover:bg-accent/90 text-black shadow-[0_0_24px_rgba(29,208,88,0.25)] hover:shadow-[0_0_32px_rgba(29,208,88,0.45)] active:scale-[0.99]"
          >
            <Lock size={14} strokeWidth={3} />
            Place 1-Hour Floor Bid
          </button>

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            Binding if accepted — otherwise expires in 1 hour.
          </p>
        </div>
      </div>

      <FloorHistory currentFloor={initialBid} activeRemaining={topRemaining} />
    </div>
  );
};

const FloorHistory: React.FC<{ currentFloor: number; activeRemaining: number }> = ({ currentFloor, activeRemaining }) => {
  const [expanded, setExpanded] = useState(false);
  const entries = useMemo(
    () => FLOOR_HISTORY_BASE.map((e) => ({ ...e, amount: Math.max(0, currentFloor + e.offset) })),
    [currentFloor],
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-secondary/[0.04] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition"
      >
        <div className="flex items-center gap-2">
          <History size={16} className="text-accent" />
          <h3 className="text-base font-black tracking-tight">Floor History</h3>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-[12px] font-bold text-muted-foreground tabular-nums">
            {entries.length} bids
          </span>
        </div>
        <ChevronDown
          size={18}
          className={cn(
            'text-muted-foreground transition-transform duration-200',
            expanded && 'rotate-180',
          )}
        />
      </button>

      {expanded && (
        <ul className="divide-y divide-white/[0.05] border-t border-white/[0.06]">
          {entries.map((e, i) => {
            const effectiveStatus: FloorBidStatus =
              e.status === 'active' && activeRemaining <= 0 ? 'expired' : e.status;
            const isActive = effectiveStatus === 'active';
            const isAccepted = effectiveStatus === 'accepted';
            const isExpired = effectiveStatus === 'expired';
            return (
              <li
                key={`${e.user}-${i}`}
                className={cn(
                  'flex items-center gap-3 px-5 py-3 transition',
                  isActive && 'bg-accent/[0.06]',
                  isAccepted && 'bg-accent/[0.04]',
                )}
              >
                <img
                  src={`https://i.pravatar.cc/80?u=${encodeURIComponent(e.user)}`}
                  alt=""
                  className={cn(
                    'w-8 h-8 rounded-full object-cover border shrink-0',
                    isExpired ? 'border-white/10 grayscale opacity-70' : 'border-white/10',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        'text-sm font-bold',
                        isExpired ? 'text-muted-foreground' : 'text-foreground/90',
                      )}
                    >
                      @{e.user}
                    </span>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-full bg-amber-500/15 text-amber-300 text-[9px] font-black uppercase tracking-widest tabular-nums">
                        <Timer size={9} /> Active · {formatCountdown(activeRemaining)} left
                      </span>
                    )}
                    {isAccepted && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-full bg-accent/15 text-accent text-[9px] font-black uppercase tracking-widest">
                        <CheckCircle2 size={9} /> Accepted
                      </span>
                    )}
                    {isExpired && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">
                        Expired
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
                    {formatTimestamp(e.minutesAgo)}
                  </div>
                </div>
                <div
                  className={cn(
                    'text-base font-black tabular-nums shrink-0',
                    isActive || isAccepted
                      ? 'text-accent'
                      : 'text-muted-foreground line-through decoration-muted-foreground/40',
                  )}
                >
                  {formatCurrency(e.amount)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const FloorHowItWorks: React.FC = () => (
  <div id="what-is-floor-market" className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4 scroll-mt-20">
    <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-secondary/[0.04] p-5 md:p-6">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-5">
        How It Works
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: DollarSign, title: '1. You set the floor', body: 'Place a binding floor bid on an asset you would gladly buy at that price.' },
          { icon: CheckCircle2, title: '2. Seller accepts', body: 'You earn an instant 1% cash reward the moment the seller accepts.' },
          { icon: Gavel, title: '3. Auction goes live', body: 'Launches unreserved at one increment above your floor. If no one outbids you, the asset is yours — and the 1% reward stays yours.' },
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
              <step.icon size={16} className="text-accent" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black leading-tight">{step.title}</div>
              <div className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{step.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="rounded-2xl border border-white/10 bg-secondary/[0.04] p-5 md:p-6">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-5">
        Why Floor Bidders Win
      </div>
      <ul className="space-y-3">
        {[
          'Get paid for creating certainty',
          'Access to quality assets first',
          'Data-driven pricing insights',
          'Binding floor protects the seller',
        ].map((line, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
            <span className="text-foreground/85 leading-snug">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// ---------- Detail page ----------

export const ItemDetailPage = ({
  item,
  onBack,
  variant = 'auction',
}: {
  item: AuctionItem;
  onBack: () => void;
  variant?: 'auction' | 'floor-setting';
}) => {
  const onList = () => {};
  const locationParts = item.location?.split(', ') || [];
  const locationCity = locationParts[0] || '';
  const locationRegion = locationParts[1] || '';

  const galleryImages = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : [item.imageUrl];
  const [selectedImage, setSelectedImage] = useState(0);
  const hasCinematic = !!(item.cinematicVideoUrl || item.cinematicPosterUrl || item.editorialBadge === 'Cinematic Feature');
  const scrollToCinematic = () => {
    document.getElementById('cinematic-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [subscribed, setSubscribed] = useState(false);
  const [saved, setSaved] = useState(false);

  const topEntry = FLOOR_HISTORY_BASE.find((e) => e.status === 'active') ?? FLOOR_HISTORY_BASE[0];
  const topFloorAmount = (item.currentBid ?? 0) + topEntry.offset;
  const topPlacedAt = useMemo(() => Date.now() - topEntry.minutesAgo * 60 * 1000, [topEntry.minutesAgo]);
  const nowTick = useNowTick(1000);
  const topRemaining = topPlacedAt + FLOOR_BID_TTL_MS - nowTick;
  const isFloorVariant = variant === 'floor-setting';
  const toggleSection = (key: string) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  const [countdown, setCountdown] = useState(item.timeLeft ?? '');
  useEffect(() => {
    if (!item.endTime) return;
    const fmt = () => {
      const ms = new Date(item.endTime!).getTime() - Date.now();
      if (ms <= 0) return 'Ended';
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms / 3600000) % 24);
      const m = Math.floor((ms / 60000) % 60);
      const s = Math.floor((ms / 1000) % 60);
      if (d > 0) return `${d}d ${h}h ${m}m`;
      if (h > 0) return `${h}h ${m}m ${s}s`;
      return `${m}m ${s}s`;
    };
    const tick = () => setCountdown(fmt());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [item.endTime]);

  return (
    <div className="container mx-auto px-4 pt-0 md:pt-3 pb-32 md:pb-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        <div className="lg:col-span-7 space-y-4 md:space-y-6">
          <div className="-mx-4 md:mx-0 aspect-[4/3] md:aspect-video md:rounded-3xl overflow-hidden md:border md:border-white/5 relative group">
            <img
              src={galleryImages[selectedImage]}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              alt={item.title}
            />
            <button
              type="button"
              onClick={onBack}
              className="absolute top-3 md:top-4 left-3 md:left-4 flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs md:text-sm font-bold hover:bg-black/85 transition"
            >
              <ArrowRight size={14} className="rotate-180" />
              <span>Go Back</span>
            </button>
            {hasCinematic && (
              <button
                type="button"
                onClick={scrollToCinematic}
                aria-label="Play cinematic walkaround"
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="relative">
                  <span className="absolute -inset-3 rounded-2xl bg-accent/25 blur-2xl" />
                  <span className="relative w-20 h-14 md:w-24 md:h-16 rounded-2xl bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border-2 border-accent flex items-center justify-center shadow-[0_0_28px_rgba(29,208,88,0.6),inset_0_0_12px_rgba(29,208,88,0.2)] group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 md:w-8 md:h-8 text-accent fill-accent ml-0.5 drop-shadow-[0_0_10px_rgba(29,208,88,0.9)]" />
                  </span>
                </span>
              </button>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar -mt-2 md:-mt-4 pb-1">
              {galleryImages.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={cn(
                    'shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all',
                    selectedImage === i
                      ? 'border-accent shadow-[0_0_0_2px_rgba(29,208,88,0.25)]'
                      : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                  )}
                >
                  <img src={src} alt={`${item.title} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <section className="space-y-3 md:space-y-4">
            <h1 className="text-lg md:text-2xl font-bold tracking-tight leading-snug">
              {item.title}
            </h1>

            <div className="text-[13px] text-neutral-400 leading-snug flex flex-wrap items-center gap-x-1.5 gap-y-1 tabular-nums">
              {item.location && <span>{item.location}</span>}
              {item.views != null && (
                <>
                  <span className="text-neutral-500">·</span>
                  <span>{item.views.toLocaleString()} views</span>
                </>
              )}
              {isFloorVariant ? (
                <>
                  <span className="text-neutral-500">·</span>
                  <span className="text-accent font-semibold">Floor Market</span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-amber-300 font-medium">
                    Offer expires in {formatCountdown(topRemaining)}
                  </span>
                </>
              ) : (
                item.endTime && (
                  <>
                    <span className="text-neutral-500">·</span>
                    <span className="text-red-400 font-medium">Ends in {countdown}</span>
                  </>
                )
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 pt-1">
              {item.sellerName && (
                <button
                  type="button"
                  className="shrink-0 flex items-center gap-3 group min-w-0"
                  aria-label={`${item.sellerName} profile`}
                >
                  <img
                    src={`https://i.pravatar.cc/100?u=${encodeURIComponent(item.sellerName)}`}
                    alt={item.sellerName}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                  <div className="flex flex-col items-start leading-tight min-w-0">
                    <span className="text-[15px] font-semibold text-white group-hover:underline truncate">
                      {item.sellerName}
                    </span>
                    <span className="text-[12px] text-neutral-400 flex items-center gap-1.5 truncate">
                      <BadgeCheck size={12} className="text-accent shrink-0" />
                      Verified Seller
                      <span className="text-neutral-500">·</span>
                      12 auctions
                    </span>
                  </div>
                </button>
              )}

              <div className="flex items-center gap-2 md:ml-auto overflow-x-auto md:overflow-visible no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                {(() => {
                  const neonBtn =
                    'shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-black border border-accent/45 text-accent text-sm font-semibold hover:border-accent hover:bg-accent/[0.06] transition shadow-[0_0_14px_rgba(29,208,88,0.22)] hover:shadow-[0_0_22px_rgba(29,208,88,0.4)]';
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => setSubscribed((s) => !s)}
                        className={neonBtn}
                      >
                        <Plus size={15} strokeWidth={2.75} />
                        {subscribed ? 'Following' : 'Follow'}
                      </button>

                      <button type="button" className={neonBtn}>
                        <Phone size={15} strokeWidth={2.5} />
                        Contact
                      </button>

                      <button type="button" className={neonBtn}>
                        <Forward size={17} strokeWidth={2.25} />
                        Share
                      </button>

                      <button
                        type="button"
                        onClick={() => setSaved((s) => !s)}
                        className={neonBtn}
                      >
                        <Plus size={15} strokeWidth={2.75} />
                        {saved ? 'On Watchlist' : 'To Watchlist'}
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>

            {isFloorVariant ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] tabular-nums rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">
                  Top Floor Bid
                </span>
                <span className="font-bold text-white">{formatCurrency(topFloorAmount)}</span>
                <span className="text-neutral-500">by</span>
                <span className="font-medium text-neutral-300">@{topEntry.user}</span>
                <span className="text-neutral-500">·</span>
                {topRemaining > 0 ? (
                  <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
                    <Timer size={12} />
                    Expires in {formatCountdown(topRemaining)}
                  </span>
                ) : (
                  <span className="text-neutral-500 font-medium">Offer expired</span>
                )}
              </div>
            ) : (
              item.winningBidder && (
                <div className="flex items-center gap-2 text-[13px] text-neutral-400">
                  <Crown size={14} className="text-accent" />
                  <span>
                    <span className="font-medium text-neutral-300">@{item.winningBidder}</span>{' '}
                    {item.status === 'live' ? 'is currently leading' : 'won this auction'}
                  </span>
                  {item.status === 'live' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-full bg-red-500/15 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
              )
            )}

            {item.comments && item.comments.length > 0 && (
              <div className="rounded-xl bg-secondary/[0.06] px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold">
                    Comments <span className="text-neutral-400 font-normal">· {item.comments.length}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!openSections.has('comments')) toggleSection('comments');
                      setTimeout(() => {
                        document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 50);
                    }}
                    className="text-[12px] font-semibold text-neutral-400 hover:text-white hover:underline transition"
                  >
                    View all comments
                  </button>
                </div>
                <div className="flex gap-2.5 mt-2.5">
                  <img
                    src={`https://i.pravatar.cc/60?u=${encodeURIComponent(item.comments[0].author)}`}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="text-[13px] text-foreground/90 leading-snug line-clamp-2">
                    <span className="text-neutral-400">@{item.comments[0].author}:</span>{' '}
                    {item.comments[0].body}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 md:space-y-3 pt-6 md:pt-8 border-t border-white/5">
              {/* Item Details */}
              <div className="rounded-2xl border border-white/10 bg-secondary/[0.04] overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('details')}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center gap-2">
                    <Info size={16} className="text-accent" />
                    <h3 className="text-base font-black tracking-tight">Item Details</h3>
                  </div>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'text-muted-foreground transition-transform duration-200',
                      openSections.has('details') && 'rotate-180',
                    )}
                  />
                </button>
                {openSections.has('details') && (
                  <div className="px-5 pb-5 pt-1">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {[
                        { label: 'Year', value: item.year },
                        { label: 'Make', value: item.make },
                        { label: 'Model', value: item.model },
                        { label: 'VIN', value: item.vin },
                        { label: 'Drivetrain', value: item.drivetrain },
                        { label: 'Engine', value: item.engine },
                        { label: 'Kms', value: item.kms != null ? item.kms.toLocaleString() : undefined },
                      ]
                        .filter((spec) => spec.value !== undefined && spec.value !== null && spec.value !== '')
                        .map((spec, i) => (
                          <div key={i} className="space-y-0.5 md:space-y-1">
                            <div className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                              {spec.label}
                            </div>
                            <div className="text-base md:text-lg font-bold">{spec.value}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Seller Story */}
              {item.sellerStory && (
                <div className="rounded-2xl border border-white/10 bg-secondary/[0.04] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('story')}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-accent" />
                      <h3 className="text-base font-black tracking-tight">Seller Story</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.sellerName && (
                        <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          By {item.sellerName}
                        </span>
                      )}
                      <ChevronDown
                        size={18}
                        className={cn(
                          'text-muted-foreground transition-transform duration-200',
                          openSections.has('story') && 'rotate-180',
                        )}
                      />
                    </div>
                  </button>
                  {openSections.has('story') && (
                    <div className="px-5 pb-5 pt-1">
                      <p className="text-sm md:text-[15px] text-foreground/85 leading-relaxed whitespace-pre-line">
                        {item.sellerStory}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Key Features */}
              {item.keyFeatures && item.keyFeatures.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-secondary/[0.04] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('features')}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-accent" />
                      <h3 className="text-base font-black tracking-tight">Key Features</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {item.keyFeatures.length} Included
                      </span>
                      <ChevronDown
                        size={18}
                        className={cn(
                          'text-muted-foreground transition-transform duration-200',
                          openSections.has('features') && 'rotate-180',
                        )}
                      />
                    </div>
                  </button>
                  {openSections.has('features') && (
                    <div className="px-5 pb-5 pt-1">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                        {item.keyFeatures.map((feature, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-br from-accent/[0.06] to-accent/[0.02] border border-accent/15 transition"
                          >
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/15 shrink-0">
                              <CheckCircle2 size={13} className="text-accent" />
                            </span>
                            <span className="text-xs md:text-sm font-bold text-foreground/90 leading-tight">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Intelligence Report */}
              <div className="rounded-2xl border border-white/10 bg-secondary/[0.04] overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('intel')}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-accent" />
                    <h3 className="text-base font-black tracking-tight">Intelligence Report</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Lock size={10} /> Locked
                    </span>
                    <ChevronDown
                      size={18}
                      className={cn(
                        'text-muted-foreground transition-transform duration-200',
                        openSections.has('intel') && 'rotate-180',
                      )}
                    />
                  </div>
                </button>
                {openSections.has('intel') && (
                  <div className="px-5 pb-5 pt-1 space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-black text-accent leading-none">82</div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">Score</div>
                      </div>
                      <div className="border-x border-white/[0.06]">
                        <div className="text-sm font-black text-accent leading-none pt-1">{item.buyerEdgeScore || 'Strong Buy'}</div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2">Verdict</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 pt-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={cn(
                                'w-1.5 h-1.5 rounded-full',
                                i <= (item.confidence ?? 4) ? 'bg-accent' : 'bg-white/10',
                              )}
                            />
                          ))}
                        </div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2">Confidence</div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed text-center">
                      Unlock to see market value, comparable sales, bid strategy, Carproof, and lien search.
                    </p>

                    <button
                      onClick={onList}
                      className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-black font-black text-sm tracking-tight transition flex items-center justify-center gap-2"
                    >
                      <Lock size={14} /> Unlock Full Report
                    </button>
                  </div>
                )}
              </div>

              {/* Auction Terms */}
              {item.auctionTerms && item.auctionTerms.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-secondary/[0.04] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('terms')}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition"
                  >
                    <div className="flex items-center gap-2">
                      <Gavel size={16} className="text-accent" />
                      <h3 className="text-base font-black tracking-tight">Auction Terms</h3>
                    </div>
                    <ChevronDown
                      size={18}
                      className={cn(
                        'text-muted-foreground transition-transform duration-200',
                        openSections.has('terms') && 'rotate-180',
                      )}
                    />
                  </button>
                  {openSections.has('terms') && (
                    <div className="px-5 pb-5 pt-1">
                      <ul className="space-y-2.5">
                        {item.auctionTerms.map((t, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm md:text-[15px] text-foreground/85 leading-relaxed"
                          >
                            <span className="text-accent/70 font-black mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Comments */}
              <div id="comments-section" className="rounded-2xl border border-white/10 bg-secondary/[0.04] overflow-hidden scroll-mt-4">
                <button
                  type="button"
                  onClick={() => toggleSection('comments')}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-accent" />
                    <h3 className="text-base font-black tracking-tight">Comments</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {item.comments?.length ?? 0}
                    </span>
                    <ChevronDown
                      size={18}
                      className={cn(
                        'text-muted-foreground transition-transform duration-200',
                        openSections.has('comments') && 'rotate-180',
                      )}
                    />
                  </div>
                </button>
                {openSections.has('comments') && (
                  <div className="px-5 pb-5 pt-1 space-y-5">
                    <div className="space-y-4">
                      {(item.comments ?? []).map((c, i) => (
                        <div key={i} className="flex gap-3">
                          <img
                            src={`https://i.pravatar.cc/80?u=${encodeURIComponent(c.author)}`}
                            alt={c.author}
                            className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-sm font-black">@{c.author}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {c.postedAt}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/85 leading-relaxed mt-1">{c.body}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <button
                                type="button"
                                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition"
                              >
                                <Heart size={12} /> {c.likes ?? 0}
                              </button>
                              <button
                                type="button"
                                className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(item.comments?.length ?? 0) === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-3">
                          No comments yet. Be the first to say something.
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-white/5">
                      <img
                        src="https://i.pravatar.cc/80?u=current-user"
                        alt="You"
                        className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 flex items-stretch gap-2 rounded-xl border border-white/10 bg-background/40 focus-within:border-accent/50 transition overflow-hidden">
                        <input
                          type="text"
                          placeholder="Add a comment…"
                          className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                        />
                        <button
                          type="button"
                          className="flex items-center justify-center w-12 bg-accent text-black hover:bg-accent/90 transition"
                          aria-label="Post comment"
                        >
                          <Send size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            {variant === 'floor-setting' ? (
              <div className="hidden lg:block">
                <FloorSetterPanel item={item} />
              </div>
            ) : (
              item.status === 'live' && (
                <div className="hidden lg:block">
                  <NativeBiddingPanel item={item} />
                </div>
              )
            )}
          </div>
        </aside>
      </div>

      {variant === 'floor-setting' && <FloorHowItWorks />}

      {variant === 'floor-setting' && (
        <div className="lg:hidden mt-6">
          <FloorSetterPanel item={item} />
        </div>
      )}

      {variant !== 'floor-setting' && item.status === 'live' && (() => {
        const cur = item.currentBid || 0;
        const inc = cur < 5000 ? 100 : cur < 25000 ? 500 : cur < 100000 ? 1000 : 2500;
        const nextBid = cur + inc;
        return (
          <div className="fixed bottom-14 left-0 right-0 z-[90] md:hidden p-4 bg-background/80 backdrop-blur-xl border-t border-white/5 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">
                  Current Bid
                </div>
                <div className="text-xl font-black text-accent">{formatCurrency(cur)}</div>
              </div>
              <button
                onClick={onList}
                className="flex-[2] h-12 rounded-xl font-black text-2xl uppercase tracking-tight bg-accent text-black flex items-center justify-center"
              >
                Bid: {formatCurrency(nextBid)}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
