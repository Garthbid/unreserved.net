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

// ---------- Detail page ----------

export const ItemDetailPage = ({
  item,
  onBack,
}: {
  item: AuctionItem;
  onBack: () => void;
}) => {
  const onList = () => {};
  const locationParts = item.location?.split(', ') || [];
  const locationCity = locationParts[0] || '';
  const locationRegion = locationParts[1] || '';

  return (
    <div className="container mx-auto px-4 py-8 pb-32 md:pb-8 max-w-7xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group"
      >
        <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Live Auctions</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        <div className="lg:col-span-7 space-y-6 md:space-y-8">
          <div className="aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 relative group">
            <img
              src={item.imageUrl}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              alt={item.title}
            />
            <div className="absolute top-4 md:top-6 left-4 md:left-6 flex flex-wrap gap-2 md:gap-3">
              {item.status === 'live' ? (
                <Badge
                  variant="accent"
                  className="bg-red-500 text-white border-none font-black px-3 md:px-4 py-1 md:py-1.5 animate-pulse text-[9px] md:text-[10px]"
                >
                  LIVE AUCTION
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="font-black px-3 md:px-4 py-1 md:py-1.5 text-[9px] md:text-[10px]"
                >
                  SOLD RESULT
                </Badge>
              )}
              {item.isNative && (
                <Badge
                  variant="accent"
                  className="bg-accent text-black border-none font-black px-3 md:px-4 py-1 md:py-1.5 text-[9px] md:text-[10px]"
                >
                  UNRESERVED DIRECT
                </Badge>
              )}
            </div>
          </div>

          <section className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3 text-muted-foreground flex-wrap">
                  {item.editorialBadge && <EditorialBadgePill badge={item.editorialBadge} />}
                  <Badge variant="outline" className="font-bold text-[9px] md:text-[10px]">
                    {item.category}
                  </Badge>
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/10" />
                  <div className="flex items-center gap-1 md:gap-1.5 text-[9px] md:text-xs font-bold uppercase tracking-widest">
                    <MapPin size={12} className="text-accent md:w-3.5 md:h-3.5" /> {item.location}
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">{item.title}</h1>
              </div>
              <div className="bg-secondary/20 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 min-w-full md:min-w-[240px]">
                <div className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1 md:mb-2 text-center md:text-left">
                  {item.status === 'live' ? 'Current High Bid' : 'Final Sale Price'}
                </div>
                <div className="text-4xl md:text-5xl font-black text-accent tracking-tighter leading-none mb-3 md:mb-4 text-center md:text-left">
                  {formatCurrency(item.status === 'live' ? item.currentBid! : item.price!)}
                </div>
                {item.status === 'live' && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-red-500 font-bold text-xs md:text-sm">
                    <Timer size={16} className="md:w-[18px] md:h-[18px]" />
                    <span>Ends in {item.timeLeft}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Year', value: item.year },
                { label: 'Make', value: item.make },
                { label: 'Model', value: item.model },
              ].map((spec, i) => (
                <div key={i} className="space-y-0.5 md:space-y-1">
                  <div className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    {spec.label}
                  </div>
                  <div className="text-base md:text-lg font-bold">{spec.value}</div>
                </div>
              ))}
            </div>

            {item.whyWatching && (
              <div className="relative pt-6 md:pt-8 border-t border-white/5">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-accent/[0.05] via-background to-background p-5 md:p-6 space-y-3 md:space-y-4 relative overflow-hidden">
                  <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-accent rounded-full shadow-[0_0_12px_rgba(29,208,88,0.6)]" />
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.22em] text-accent">
                      Editorial Note
                    </span>
                  </div>
                  <h3 className="text-lg md:text-2xl font-black tracking-tight">Why It Made the Front Page</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-medium">
                    {item.whyWatching}
                  </p>
                </div>
              </div>
            )}

            {item.whatToKnow && item.whatToKnow.length > 0 && (
              <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-white/5">
                <h3 className="text-lg md:text-2xl font-black tracking-tight">What To Know</h3>
                <ul className="space-y-2 md:space-y-3">
                  {item.whatToKnow.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm md:text-base text-foreground/90 leading-relaxed"
                    >
                      <CheckCircle2 size={16} className="text-accent mt-1 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.knownIssues && (
              <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <AlertTriangle size={14} className="text-amber-400" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
                    Buyer Caution
                  </span>
                  {item.cautionFlags?.map(flag => (
                    <span
                      key={flag}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-[0.18em] bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg md:text-2xl font-black tracking-tight">Known Issues / Buyer Caution</h3>
                <div className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-amber-500/[0.04] border border-amber-500/20">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{item.knownIssues}</p>
                </div>
              </div>
            )}

            {(item.cinematicVideoUrl || item.cinematicPosterUrl || item.editorialBadge === 'Cinematic Feature') && (
              <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.22em] text-fuchsia-300">
                    Cinematic Film
                  </span>
                </div>
                <h3 className="text-lg md:text-2xl font-black tracking-tight">Walkaround &amp; Feature Video</h3>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black group cursor-pointer">
                  <img
                    src={item.cinematicPosterUrl || item.imageUrl}
                    alt={`${item.title} cinematic poster`}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/95 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {item.cinematicTagline && (
                    <div className="absolute bottom-4 left-4 right-4 text-white/85 text-xs md:text-sm italic leading-snug">
                      "{item.cinematicTagline}"
                    </div>
                  )}
                </div>
                <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
                  Cinematic walkaround on file. Premium native listings receive movie-style treatment alongside the
                  auction page.
                </p>
              </div>
            )}

            {item.comparableSales && item.comparableSales.length > 0 && (
              <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 md:gap-3">
                  <History size={14} className="text-accent" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.22em] text-accent">
                    Comparable Sales
                  </span>
                </div>
                <h3 className="text-lg md:text-2xl font-black tracking-tight">Recent Comparable Sales</h3>
                <div className="rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
                  {item.comparableSales.map((c, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-2 md:gap-4 px-4 md:px-5 py-3 md:py-3.5 items-center bg-secondary/[0.06] hover:bg-secondary/[0.12] transition-colors"
                    >
                      <div className="col-span-12 md:col-span-7 min-w-0">
                        <div className="text-xs md:text-sm font-bold truncate">{c.title}</div>
                        <div className="text-[10px] md:text-[11px] text-muted-foreground font-medium flex items-center gap-2 mt-0.5">
                          <span>{c.date}</span>
                          {c.location && (
                            <>
                              <span className="opacity-30">•</span>
                              <span>{c.location}</span>
                            </>
                          )}
                          {c.source && (
                            <>
                              <span className="opacity-30">•</span>
                              <span className="uppercase tracking-widest text-[9px]">{c.source}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-5 text-left md:text-right">
                        <div className="text-base md:text-lg font-black text-accent tabular-nums leading-none">
                          {formatCurrency(c.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.sellerNotes && (
              <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 md:gap-3">
                  <FileText size={14} className="text-accent" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.22em] text-accent">
                    Seller Notes
                  </span>
                </div>
                <h3 className="text-lg md:text-2xl font-black tracking-tight">From the Seller</h3>
                <div className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-secondary/[0.08] border border-white/5">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line">
                    {item.sellerNotes}
                  </p>
                </div>
              </div>
            )}

            {item.publicQA && item.publicQA.length > 0 && (
              <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 md:gap-3">
                  <Info size={14} className="text-accent" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.22em] text-accent">
                    Public Q&amp;A
                  </span>
                </div>
                <h3 className="text-lg md:text-2xl font-black tracking-tight">Buyer Questions</h3>
                <div className="space-y-3 md:space-y-4">
                  {item.publicQA.map((q, i) => (
                    <div
                      key={i}
                      className="rounded-xl md:rounded-2xl border border-white/5 bg-secondary/[0.06] p-4 md:p-5 space-y-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-muted-foreground font-bold">
                          <span>{q.askedBy}</span>
                          <span className="opacity-30">•</span>
                          <span>{q.askedAt}</span>
                        </div>
                        <p className="text-sm md:text-base font-bold mt-1">{q.question}</p>
                      </div>
                      {q.answer ? (
                        <div className="pt-3 border-t border-white/5">
                          <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-accent font-black uppercase tracking-widest">
                            <span>{q.answeredBy || 'Seller'}</span>
                            {q.answeredAt && (
                              <>
                                <span className="opacity-30">•</span>
                                <span>{q.answeredAt}</span>
                              </>
                            )}
                          </div>
                          <p className="text-sm md:text-[15px] text-foreground/85 mt-1.5 leading-relaxed">{q.answer}</p>
                        </div>
                      ) : (
                        <div className="pt-3 border-t border-white/5 text-[11px] md:text-xs text-muted-foreground italic">
                          Awaiting seller response.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.auctionTerms && item.auctionTerms.length > 0 && (
              <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 md:gap-3">
                  <Gavel size={14} className="text-accent" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.22em] text-accent">
                    Auction Terms
                  </span>
                </div>
                <h3 className="text-lg md:text-2xl font-black tracking-tight">Auction Terms</h3>
                <ul className="space-y-2 md:space-y-2.5">
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
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            {item.status === 'live' && <NativeBiddingPanel item={item} />}
            <div className="rounded-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-40 bg-accent/[0.05] rounded-full blur-[80px] pointer-events-none" />

              <div className="relative px-6 pt-6 pb-5 text-center">
                <div className="inline-flex flex-col items-center">
                  <span className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-[0.25em] mb-4">
                    Price Score
                  </span>
                  <div className="relative w-[104px] h-[104px] mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="5"
                        strokeDasharray={`${82 * 2.64} ${100 * 2.64}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgb(29,208,88)" stopOpacity="1" />
                          <stop offset="100%" stopColor="rgb(29,208,88)" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[32px] font-black text-foreground tracking-tighter leading-none">82</span>
                      <span className="text-[8px] font-bold text-muted-foreground/40 uppercase mt-0.5">/100</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/[0.08] border border-green-500/20 text-[9px] font-black text-green-400 uppercase tracking-wider">
                    <Zap size={8} fill="currentColor" /> {item.buyerEdgeScore || 'Strong Buy'}
                  </span>
                </div>
              </div>

              <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              <div className="px-6 py-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-[7px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-1.5">
                    Location
                  </div>
                  <div className="text-[11px] font-bold text-foreground/70 truncate">
                    {locationCity}
                    {locationRegion ? `, ${locationRegion}` : ''}
                  </div>
                </div>
                <div className="border-x border-white/[0.06]">
                  <div className="text-[7px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-1.5">
                    Category
                  </div>
                  <div className="text-[11px] font-bold text-foreground/70 truncate">{item.category}</div>
                </div>
                <div>
                  <div className="text-[7px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-1.5">
                    Confidence
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-0.5">
                    <div className="flex gap-[3px]">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className={cn(
                            'w-2 h-2 rounded-full',
                            i <= (item.confidence ?? 4) ? 'bg-accent/70' : 'bg-white/[0.06]',
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              <div className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-accent/[0.08] flex items-center justify-center">
                      <BarChart3 size={12} className="text-accent/70" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/70">
                      Intelligence Report
                    </span>
                  </div>
                  <span className="text-[7px] font-bold text-muted-foreground/40 uppercase tracking-[0.15em] flex items-center gap-1">
                    <Lock size={7} /> Locked
                  </span>
                </div>

                <div className="space-y-1.5 relative">
                  {[
                    { icon: <DollarSign size={12} />, label: 'Market value estimate' },
                    { icon: <History size={12} />, label: 'Comparable sales' },
                    { icon: <ArrowDownRight size={12} />, label: 'Price gap analysis' },
                    { icon: <Gavel size={12} />, label: 'Bid strategy notes' },
                    { icon: <ShieldCheck size={12} />, label: 'Seller / auctioneer confidence' },
                    { icon: <Globe size={12} />, label: 'Transport considerations' },
                    { icon: <Timer size={12} />, label: 'Similar auctions ending soon' },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center gap-3 py-2 px-3 rounded-lg transition-all',
                        i >= 3 && 'opacity-40',
                      )}
                    >
                      <div className="text-accent/30 flex-shrink-0">{row.icon}</div>
                      <span className="text-[11px] font-medium text-foreground/45">{row.label}</span>
                      <div className="ml-auto w-12 h-1.5 rounded-full bg-white/[0.05]" />
                    </div>
                  ))}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 space-y-3">
                <button
                  onClick={onList}
                  className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-black font-black text-[13px] tracking-tight transition-all shadow-[0_0_20px_rgba(29,208,88,0.15)] hover:shadow-[0_0_30px_rgba(29,208,88,0.25)] flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Lock size={13} /> Unlock Full Intelligence Report
                </button>

                <p className="text-center text-[10px] text-muted-foreground/70 leading-relaxed px-2">
                  Get price scores, comparable sales, buyer notes, and weekly curated auction picks.
                </p>

                <div className="flex items-center justify-center gap-3">
                  <span className="text-[9px] text-muted-foreground/40 font-medium">
                    From <span className="text-accent/60 font-bold">$9/mo</span>
                  </span>
                  <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
                  <button
                    onClick={onList}
                    className="text-[9px] text-muted-foreground/50 hover:text-foreground/70 font-medium transition-colors underline underline-offset-2 decoration-white/10"
                  >
                    Download sample report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {item.status === 'live' && (
        <div className="fixed bottom-14 left-0 right-0 z-[90] md:hidden p-4 bg-background/80 backdrop-blur-xl border-t border-white/5 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">
                Current Bid
              </div>
              <div className="text-xl font-black text-accent">{formatCurrency(item.currentBid || 0)}</div>
            </div>
            <button
              onClick={onList}
              className="flex-[2] h-12 rounded-xl font-black text-xs uppercase tracking-widest bg-accent text-black flex items-center justify-center gap-1.5"
            >
              <Lock size={13} /> Unlock Access
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
