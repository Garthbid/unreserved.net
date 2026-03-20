/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Filter, 
  ArrowUpRight, 
  Lock, 
  Plus, 
  LayoutGrid, 
  List as ListIcon,
  Zap,
  ShieldCheck,
  History,
  Info,
  Camera,
  Eye,
  AlertTriangle,
  Timer,
  CheckCircle2,
  ArrowRight,
  Home,
  PlusCircle,
  Bell,
  Settings,
  BrainCircuit,
  ArrowDownRight,
  Gavel,
  Grid,
  ChevronDown,
  Download,
  Share2,
  ArrowLeft,
  User,
  Bot,
  Upload,
  Link,
  DollarSign,
  Hash,
  Gauge,
  Globe,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn, formatCurrency } from './utils';
import { getMarketInsight } from './services/geminiService';
import { MOCK_ITEMS, TREND_DATA } from './mockData';
import { AuctionItem, IntelligenceReport } from './types';

// --- Hooks ---

interface PriceEntry {
  price: number;
  starts_at: string;
  ends_at: string;
  bids: number;
  status: 'upcoming' | 'live' | 'sold';
}

interface PricesData {
  updated_at: string;
  source: string;
  item_count: number;
  items: Record<string, PriceEntry>;
}

function usePrices() {
  const [prices, setPrices] = useState<PricesData | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const prevData = useRef<PricesData | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch('/prices.json?t=' + Date.now());
      if (!res.ok) return;
      const data: PricesData = await res.json();
      prevData.current = data;
      setPrices(data);
      setLastFetched(Date.now());
    } catch {
      // Keep last known data on error
      if (prevData.current) {
        setPrices(prevData.current);
      }
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, 30_000);
    return () => clearInterval(id);
  }, [fetchPrices]);

  // Look up by source_url — extract UUID from the last path segment
  const getPrice = useCallback((sourceUrl?: string): PriceEntry | null => {
    if (!prices || !sourceUrl) return null;
    const segments = sourceUrl.replace(/\/+$/, '').split('/');
    const uuid = segments[segments.length - 1];
    return prices.items[uuid] || null;
  }, [prices]);

  return { prices, lastFetched, getPrice };
}

function formatCountdown(diff: number): string {
  if (diff <= 0) return 'ENDED';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
  return `${mins}m ${secs}s`;
}

// Countdown timer that ticks every second, supports upcoming→live auto-transition
const LiveCountdown = ({ startsAt, endsAt, status, onStatusChange }: {
  startsAt?: string;
  endsAt: string;
  status: 'upcoming' | 'live' | 'sold';
  onStatusChange?: (newStatus: 'live' | 'sold') => void;
}) => {
  const [display, setDisplay] = useState('');
  const [label, setLabel] = useState('');
  const currentStatus = useRef(status);

  useEffect(() => {
    currentStatus.current = status;
  }, [status]);

  useEffect(() => {
    const tick = () => {
      if (currentStatus.current === 'sold') {
        setDisplay('');
        setLabel('SOLD');
        return;
      }

      if (currentStatus.current === 'upcoming' && startsAt) {
        const diff = new Date(startsAt).getTime() - Date.now();
        if (diff <= 0) {
          // Auto-transition to live
          currentStatus.current = 'live';
          onStatusChange?.('live');
        } else {
          setLabel('Starts in');
          setDisplay(formatCountdown(diff));
          return;
        }
      }

      // Live
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setLabel('');
        setDisplay('ENDED');
        onStatusChange?.('sold');
        return;
      }
      setLabel('Ends in');
      setDisplay(formatCountdown(diff));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startsAt, endsAt, onStatusChange]);

  if (!display && !label) return null;
  return <>{label ? `${label} ${display}` : display}</>;
};

// --- Components ---

const SubscriptionModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-secondary/40 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-accent/10"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest mb-4">
                  Premium Access
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-tight uppercase">
                  UNRESERVED CLUB
                </h2>
                <p className="text-muted-foreground text-sm mt-2 font-medium">
                  Unlock the full market and move first.
                </p>
              </div>

              <div className="space-y-6 mb-10">
                {[
                  "Buy & sell items unreserved on the platform with zero fees",
                  "View auctions across the globe and get an edge like never before",
                  "Access to the most advanced pricing and intelligence reports ever created"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-colors duration-300">
                      <CheckCircle2 size={12} />
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-xl font-black tracking-tight text-foreground">
                    Subscribe now for only <span className="text-accent text-2xl">$9/m</span>
                  </p>
                </div>
                
                <Button 
                  className="w-full h-16 rounded-2xl bg-accent text-black font-black text-lg hover:bg-accent/90 shadow-xl shadow-accent/20 transition-all active:scale-[0.98]"
                  onClick={onClose}
                >
                  Join Now
                </Button>
                
                <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  Cancel anytime • Secure payment
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const BottomNav = ({ activePage, setActivePage, onSearch, onListClick }: { activePage: string, setActivePage: (p: any) => void, onSearch: (q: string) => void, onListClick: () => void }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'search', label: 'Search', icon: <Search size={20} /> },
    { id: 'live', label: 'Live', icon: <Zap size={20} /> },
    { id: 'list', label: 'Sell', icon: <PlusCircle size={20} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-black via-black/95 to-transparent">
      <div className="bg-secondary/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] h-16 flex items-center justify-around px-2 relative overflow-hidden">
        {/* Active Indicator Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-50" />
        </div>
        
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'search') onSearch('');
                else if (item.id === 'list') onListClick();
                else setActivePage(item.id as any);
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-2xl transition-all duration-300 relative",
                isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn("transition-all duration-300", isActive && "drop-shadow-[0_0_8px_rgba(242,125,38,0.5)]")}>
                {item.icon}
              </div>
              <span className={cn("text-[9px] font-black uppercase tracking-widest transition-all duration-300", isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="bottomNavTab"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-accent shadow-[0_0_10px_#1dd058]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AuctionCard: React.FC<{
  item: AuctionItem,
  onClick: () => void,
  viewMode?: 'grid' | 'list',
  livePrice?: PriceEntry | null,
}> = ({ item, onClick, viewMode = 'grid', livePrice }) => {
  const getBuyerEdgeColor = (score: string) => {
    if (score === 'Strong Buy') return 'success';
    if (score === 'Moderate Edge') return 'accent';
    if (score === 'Fair Market') return 'default';
    return 'destructive';
  };

  // Determine display values — live price overlay wins if available
  const displayPrice = livePrice ? livePrice.price : (item.status === 'live' ? item.currentBid || 0 : item.price || 0);
  const [liveStatus, setLiveStatus] = useState<'upcoming' | 'live' | 'sold'>(
    livePrice ? livePrice.status : (item.status === 'live' ? 'live' : item.status === 'sold' ? 'sold' : 'upcoming')
  );

  // Sync with new price data from fetch
  useEffect(() => {
    if (livePrice) setLiveStatus(livePrice.status);
  }, [livePrice]);

  const displayStatus = livePrice ? liveStatus : (item.status === 'live' ? 'live' : 'sold');

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer overflow-hidden border-white/5 hover:border-accent/30 transition-all duration-500",
        item.isNative ? "bg-accent/5 ring-1 ring-accent/20" : "bg-secondary/10",
        viewMode === 'list' ? "flex flex-row h-40 md:h-48" : "flex flex-col"
      )}
    >
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden",
        viewMode === 'list' ? "w-32 md:w-72 shrink-0" : "aspect-[16/10]"
      )}>
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 md:top-3 left-2 md:left-3 flex flex-col gap-1 md:gap-2">
          {displayStatus === 'upcoming' && (
            <Badge variant="warning" className="bg-yellow-500/90 text-black border-none font-black text-[8px] md:text-[10px]">UPCOMING</Badge>
          )}
          {displayStatus === 'live' && (
            <Badge variant="accent" className="bg-red-500 text-white border-none font-black animate-pulse text-[8px] md:text-[10px]">LIVE</Badge>
          )}
          {displayStatus === 'sold' && (
            <Badge variant="secondary" className="font-bold text-[8px] md:text-[10px]">SOLD</Badge>
          )}
          {item.isNative && (
            <Badge variant="accent" className="bg-accent text-black border-none font-black text-[8px] md:text-[10px]">DIRECT</Badge>
          )}
        </div>
        {/* Timer overlay for upcoming and live */}
        {livePrice && (displayStatus === 'upcoming' || displayStatus === 'live') && (
          <div className={cn(
            "absolute bottom-2 md:bottom-3 right-2 md:right-3 px-1.5 md:px-2 py-0.5 md:py-1 bg-black/80 backdrop-blur-md rounded-lg text-[8px] md:text-[10px] font-black text-white flex items-center gap-1 md:gap-1.5 border border-white/10",
          )}>
            <Timer size={10} className={cn("md:w-3 md:h-3", displayStatus === 'upcoming' ? "text-yellow-500" : "text-accent")} />
            <LiveCountdown
              startsAt={livePrice.starts_at}
              endsAt={livePrice.ends_at}
              status={liveStatus}
              onStatusChange={setLiveStatus}
            />
          </div>
        )}
        {/* Fallback timer for items without livePrice */}
        {!livePrice && item.status === 'live' && (
          <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 px-1.5 md:px-2 py-0.5 md:py-1 bg-black/80 backdrop-blur-md rounded-lg text-[8px] md:text-[10px] font-black text-white flex items-center gap-1 md:gap-1.5 border border-white/10">
            <Timer size={10} className="text-accent md:w-3 md:h-3" />
            {item.timeLeft}
          </div>
        )}
        {/* SOLD overlay */}
        {displayStatus === 'sold' && livePrice && (
          <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 px-1.5 md:px-2 py-0.5 md:py-1 bg-black/80 backdrop-blur-md rounded-lg text-[8px] md:text-[10px] font-black text-muted-foreground flex items-center gap-1 md:gap-1.5 border border-white/10">
            SOLD
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 md:p-5 flex-1 flex flex-col min-w-0">
        <div className="flex items-start justify-between mb-1 md:mb-2">
          <div className="space-y-0.5 md:space-y-1 min-w-0">
            <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
              <span>{item.auctionSource}</span>
              <span className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-border" />
              <span>{item.location}</span>
            </div>
            <h3 className="font-bold text-sm md:text-lg leading-tight group-hover:text-accent transition-colors line-clamp-1">{item.title}</h3>
          </div>
        </div>

        <div className="mt-auto pt-2 md:pt-4 border-t border-white/5 flex items-end justify-between">
          <div className="space-y-0.5 md:space-y-1">
            <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {livePrice ? (livePrice.bids > 0 ? `${livePrice.bids} bid${livePrice.bids !== 1 ? 's' : ''}` : 'Starting at') : 'Market Value'}
            </span>
            <div className="text-base md:text-2xl font-black tracking-tighter">
              {formatCurrency(displayPrice)}
            </div>
          </div>

          <div className="text-right space-y-1 md:space-y-2">
            <div className="flex flex-col items-end">
              <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5 md:mb-1">Buyer Edge</span>
              <Badge variant={getBuyerEdgeColor(item.buyerEdgeScore || '')} className="text-[8px] md:text-[10px] font-black px-1.5 md:px-2 py-0.5">
                {item.buyerEdgeScore}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-border bg-transparent hover:bg-secondary text-foreground',
      ghost: 'bg-transparent hover:bg-secondary text-muted-foreground hover:text-foreground',
    };
    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-8 text-lg',
    };
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-95',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

const Badge = ({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'accent' | 'outline' | 'success' | 'warning' | 'destructive' | 'secondary' }) => {
  const variants = {
    default: 'bg-secondary text-secondary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent/20 text-accent border border-accent/30',
    outline: 'border border-border text-muted-foreground',
    success: 'bg-green-500/10 text-green-500 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
    destructive: 'bg-red-500/10 text-red-500 border border-red-500/20',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider', variants[variant], className)}>
      {children}
    </span>
  );
};

const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    {...props}
    className={cn('rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:border-accent/50 group cursor-pointer', className)}
  >
    {children}
  </motion.div>
);

const MarketInsight = ({ category, itemTitle }: { category: string, itemTitle?: string }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    const result = await getMarketInsight(category, itemTitle);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    if (category || itemTitle) {
      fetchInsight();
    }
  }, [category, itemTitle]);

  // Helper to parse AI insights into scannable sections
  const parsedInsight = useMemo(() => {
    if (!insight) return null;
    
    const sections = insight.split('\n\n').filter(Boolean);
    return sections.map(section => {
      const [title, ...content] = section.split(':');
      return {
        title: title.trim(),
        content: content.join(':').trim()
      };
    });
  }, [insight]);

  return (
    <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20 space-y-4">
      <div className="flex items-center gap-2 text-accent">
        <Zap size={16} fill="currentColor" />
        <h4 className="text-xs font-black uppercase tracking-[0.2em]">AI Intelligence</h4>
      </div>
      
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-3 bg-secondary/50 rounded w-full" />
          <div className="h-3 bg-secondary/50 rounded w-5/6" />
          <div className="h-3 bg-secondary/50 rounded w-4/6" />
        </div>
      ) : parsedInsight ? (
        <div className="space-y-4">
          {parsedInsight.map((section, i) => (
            <div key={i} className="space-y-1">
              <div className="text-[10px] font-black text-accent/70 uppercase tracking-widest">{section.title}</div>
              <p className="text-xs text-foreground leading-relaxed font-medium">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">No insights available for this market.</p>
      )}
    </div>
  );
};

// --- Pages ---

const HomePage = ({ onSearch, setActivePage, handleSelectItem, onListClick, items }: { onSearch: (q: string) => void, setActivePage: (p: any) => void, handleSelectItem: (item: AuctionItem) => void, onListClick: () => void, items: AuctionItem[] }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="flex flex-col gap-8 md:gap-20 pb-24 md:pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 md:pt-24 md:pb-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 intelligence-gradient opacity-30 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-accent/5 blur-[120px] -z-10 rounded-full" />
        
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 md:space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              107,423 ITEMS LIVE NOW
            </div>
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[1.05] max-w-4xl uppercase">
                The Home of <span className="text-accent">Unreserved</span> Auctions.
              </h1>
            </div>
            <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto leading-relaxed opacity-80">
              Browse the market, track live bidding, and list directly in front of serious buyers.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-6 md:space-y-8 mt-8 md:mt-12"
          >
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-center">
              <div className="relative group flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input 
                  type="text"
                  placeholder="Search the market..."
                  className="w-full h-14 md:h-16 pl-12 pr-4 bg-secondary/30 border border-border rounded-xl md:rounded-2xl text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all glass"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button 
                  variant="outline"
                  className="h-14 md:h-16 px-6 md:px-8 rounded-xl md:rounded-2xl flex-1 md:flex-none text-sm md:text-lg font-black border-accent/50 text-accent hover:bg-accent/10"
                  onClick={() => onSearch(query)}
                >
                  Search Market
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-6 text-[9px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest overflow-x-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar">
              <div className="flex items-center gap-2 shrink-0 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <CheckCircle2 size={10} className="text-accent" />
                All Auctions
              </div>
              <div className="flex items-center gap-2 shrink-0 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <CheckCircle2 size={10} className="text-accent" />
                Pricing Intelligence
              </div>
              <div className="flex items-center gap-2 shrink-0 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <CheckCircle2 size={10} className="text-accent" />
                Direct Listing
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile-First Priority Sections */}
      <section className="container mx-auto px-4 -mt-8 md:-mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Ending Soon - Priority 1 on Mobile */}
          <Card className="p-4 md:p-6 space-y-4 md:space-y-5 bg-background/60 backdrop-blur-xl border-white/5 order-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer size={16} className="text-red-500" />
                <h3 className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">Ending Soon</h3>
              </div>
              <span className="text-[8px] md:text-[9px] text-muted-foreground font-black tracking-widest">LIVE PULSE</span>
            </div>
            <div className="space-y-2 md:space-y-3">
              {items.filter(i => i.status === 'live').slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 md:gap-4 group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors" onClick={() => handleSelectItem(item)}>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden shrink-0 border border-white/5">
                    <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs md:text-sm truncate group-hover:text-accent transition-colors">{item.title}</h4>
                    <div className="flex items-center justify-between mt-0.5 md:mt-1">
                      <span className="text-accent font-black text-xs md:text-sm">{formatCurrency(item.currentBid || 0)}</span>
                      <span className="text-red-500 text-[9px] md:text-[10px] font-black flex items-center gap-1">
                        <Clock size={10} /> 14m
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full text-[9px] md:text-[10px] font-black uppercase tracking-widest h-10 md:h-11" onClick={() => setActivePage('live')}>
              View Live Feed <ArrowRight size={14} className="ml-2" />
            </Button>
          </Card>

          {/* Sell Direct - Priority 2 on Mobile */}
          <Card className="p-6 md:p-8 space-y-6 bg-accent text-black border-none order-2 lg:order-3 flex flex-col justify-center">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">SELL DIRECT.</h3>
              <p className="text-sm md:text-base font-bold opacity-90 leading-tight">Skip the middleman. Reach serious buyers with market-truth data.</p>
            </div>
            <div className="grid grid-cols-1 gap-2 md:gap-3">
              {[
                'Zero listing fees',
                'Verified buyers',
                'Market-truth pricing',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-tight">
                  <CheckCircle2 size={14} className="md:w-4 md:h-4" />
                  {text}
                </div>
              ))}
            </div>
            <Button className="w-full bg-black text-white hover:bg-black/90 border-none h-14 text-base font-black rounded-xl shadow-xl mt-2" onClick={onListClick}>
              List My Item Now
            </Button>
          </Card>

          {/* Market Momentum - Priority 3 on Mobile */}
          <Card className="p-4 md:p-6 space-y-4 md:space-y-5 bg-background/60 backdrop-blur-xl border-white/5 order-3 lg:order-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-accent" />
                <h3 className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">Market Momentum</h3>
              </div>
              <span className="text-[8px] md:text-[9px] text-muted-foreground font-black tracking-widest">REAL-TIME</span>
            </div>
            <div className="space-y-2">
              {[
                { title: 'Excavator Demand', change: '+18.4%', trend: 'up' },
                { title: 'Pickup Truck Supply', change: '-4.2%', trend: 'down' },
                { title: 'Ag Equipment Index', change: '+2.1%', trend: 'up' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-tight">{item.title}</span>
                  <span className={cn("text-[10px] md:text-xs font-black", item.trend === 'up' ? 'text-green-500' : 'text-red-500')}>
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 text-accent mb-1">
                <Zap size={12} className="md:w-3.5 md:h-3.5" fill="currentColor" />
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">AI Alert</span>
              </div>
              <p className="text-[10px] md:text-[11px] text-muted-foreground leading-relaxed font-medium">
                Significant price jump detected in <span className="text-foreground font-bold">Mid-size Tractors</span>.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section - Lower Priority on Mobile */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'Auction Sources', value: '450+' },
            { label: 'Sale Results', value: '2.4M+' },
            { label: 'Daily Updates', value: '12k+' },
            { label: 'Active Users', value: '85k+' },
          ].map((s, i) => (
            <div key={i} className="p-5 md:p-6 rounded-2xl bg-secondary/10 border border-white/5 text-center group hover:border-accent/30 transition-colors">
              <div className="text-2xl md:text-3xl font-black text-accent mb-1 group-hover:scale-110 transition-transform">{s.value}</div>
              <div className="text-[9px] md:text-xs text-muted-foreground uppercase tracking-widest font-black">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Market Trends Section */}
      <section className="container mx-auto px-4">
        <div className="p-6 md:p-8 rounded-[2rem] bg-secondary/10 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none hidden md:block">
            <TrendingUp size={200} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="accent" className="font-black">Market Intelligence</Badge>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">Real-time market <span className="text-accent italic">forecasting</span>.</h2>
              <p className="text-muted-foreground text-base md:text-lg font-medium leading-relaxed">
                Our proprietary GarthAI algorithms analyze millions of data points to give you accurate pricing intelligence.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Zap size={18} />, title: 'Predictive Analytics', desc: 'Forecast future values based on seasonal trends.' },
                  { icon: <BarChart3 size={18} />, title: 'Regional Variations', desc: 'See how prices differ across regions.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight">{item.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="w-full md:w-auto h-14 rounded-xl font-black text-base" onClick={() => setActivePage('pricing')}>Unlock Pro Insights</Button>
            </div>
            <div className="h-64 md:h-80 bg-background/40 rounded-2xl border border-white/5 p-5 md:p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-xs uppercase tracking-widest">Heavy Equipment Index</h3>
                <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                  <TrendingUp size={14} /> +12.4% YoY
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA}>
                  <defs>
                    <linearGradient id="colorPriceHome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1dd058" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1dd058" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={8} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '1px solid #27272a', borderRadius: '12px', fontSize: '10px' }}
                    itemStyle={{ color: '#1dd058' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#1dd058" fillOpacity={1} fill="url(#colorPriceHome)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter">Browse Categories</h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">Explore the most active markets right now.</p>
          </div>
          <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest">View All</Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { name: 'Agriculture', count: '45,201', img: 'https://images.unsplash.com/photo-1594494424758-091c1d30bb24?auto=format&fit=crop&w=400&q=80' },
            { name: 'Construction', count: '32,150', img: 'https://images.unsplash.com/photo-1579154273821-09c113f27af0?auto=format&fit=crop&w=400&q=80' },
            { name: 'Trucks & Trailers', count: '18,400', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80' },
            { name: 'Industrial Tools', count: '12,900', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=80' },
          ].map((c, i) => (
            <Card key={i} className="relative h-40 md:h-48 group rounded-2xl overflow-hidden border-white/5">
              <img src={c.img} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" alt={c.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-base md:text-xl font-black tracking-tight">{c.name}</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground font-bold uppercase tracking-widest">{c.count} items</p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="p-2 rounded-full bg-accent text-black shadow-lg">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

const SearchResultsPage = ({ query, onSelectItem, onList, items }: { query: string, onSelectItem: (item: AuctionItem) => void, onList: () => void, items: AuctionItem[] }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const filteredItems = useMemo(() => {
    if (!query) return items;
    return items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, items]);

  const categories = ['All Categories', 'Excavators', 'Tractors', 'Pickup Trucks', 'Trailers', 'Combines', 'Industrial'];

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 pb-24 md:pb-12">
      {/* Mobile Category Scroll */}
      <div className="flex md:hidden overflow-x-auto pb-4 gap-2 scrollbar-hide no-scrollbar -mx-4 px-4">
        {categories.map(cat => (
          <button 
            key={cat} 
            className="px-4 py-2 rounded-full bg-secondary/30 border border-white/5 text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-accent hover:text-black transition-all"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters (Desktop Only) */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Market Intelligence</h3>
            <MarketInsight category={query || 'General'} itemTitle={query || 'Market Overview'} />
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Filters</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-bold">Category</label>
              <div className="space-y-2">
                {categories.slice(0, 5).map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 rounded border border-border group-hover:border-accent transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold">Price Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Min" className="w-full h-10 px-3 bg-secondary/30 border border-border rounded-lg text-sm focus:outline-none focus:border-accent" />
                <input type="text" placeholder="Max" className="w-full h-10 px-3 bg-secondary/30 border border-border rounded-lg text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold">Listing Type</label>
              <div className="space-y-2">
                {['All Listings', 'Unreserved Direct', 'External Auctions'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 rounded border border-border group-hover:border-accent transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-3">
              <h4 className="text-sm font-bold">Have something to sell?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">List your asset on Unreserved.net and reach thousands of buyers.</p>
              <Button variant="outline" size="sm" className="w-full border-accent/50 text-accent hover:bg-accent/10" onClick={onList}>
                List Your Item
              </Button>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full md:w-auto">
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">
                  {query ? `Results for "${query}"` : 'Market Listings'}
                </h2>
                <p className="text-[10px] md:text-sm text-muted-foreground font-medium uppercase tracking-widest">{filteredItems.length} opportunities found</p>
              </div>
              
              {/* Mobile Filter Trigger */}
              <button 
                onClick={() => setIsFilterDrawerOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
              >
                <Filter size={14} />
                Filters
              </button>
            </div>
            
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center bg-secondary/30 rounded-xl p-1 border border-white/5">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-background shadow-sm text-accent" : "text-muted-foreground hover:text-foreground")}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-background shadow-sm text-accent" : "text-muted-foreground hover:text-foreground")}
                >
                  <ListIcon size={18} />
                </button>
              </div>
              
              <select 
                className="flex-1 md:flex-none h-11 px-4 bg-secondary/30 border border-white/5 rounded-xl text-xs md:text-sm font-bold focus:outline-none focus:border-accent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="ending-soon">Ending Soon</option>
              </select>
            </div>
          </div>

          <div className={cn(
            "grid gap-4 md:gap-6",
            viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AuctionCard 
                  item={item} 
                  viewMode={viewMode} 
                  onClick={() => onSelectItem(item)} 
                />
              </motion.div>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                  <Search size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black">No results found</h3>
                  <p className="text-muted-foreground text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
                <Button variant="outline" onClick={() => onSelectItem(items[0])}>Browse All Items</Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[80vh] bg-background border-t border-white/10 z-[120] md:hidden rounded-t-[2.5rem] flex flex-col overflow-hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <h3 className="text-lg font-black tracking-tight uppercase">Filters</h3>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <button key={cat} className="p-3 rounded-xl bg-secondary/20 border border-white/5 text-xs font-bold text-left hover:border-accent transition-all">
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Price Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Min Price</span>
                      <input type="text" placeholder="$0" className="w-full h-12 px-4 bg-secondary/30 border border-border rounded-xl text-sm focus:border-accent outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Max Price</span>
                      <input type="text" placeholder="No Limit" className="w-full h-12 px-4 bg-secondary/30 border border-border rounded-xl text-sm focus:border-accent outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Listing Type</label>
                  <div className="space-y-2">
                    {['All Listings', 'Unreserved Direct', 'External Auctions'].map(type => (
                      <button key={type} className="w-full p-4 rounded-xl bg-secondary/20 border border-white/5 text-sm font-bold text-left flex items-center justify-between group hover:border-accent transition-all">
                        {type}
                        <div className="w-5 h-5 rounded-full border border-white/10 group-hover:border-accent" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pb-10 border-t border-white/5 bg-background/80 backdrop-blur-xl">
                <Button 
                  className="w-full h-14 rounded-2xl text-lg font-black bg-accent text-black"
                  onClick={() => setIsFilterDrawerOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ItemDetailPage = ({ item, onBack, onList, items }: { item: AuctionItem, onBack: () => void, onList: () => void, items: AuctionItem[] }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const getBuyerEdgeColor = (score: string) => {
    if (score === 'Strong Buy') return 'success';
    if (score === 'Moderate Edge') return 'accent';
    if (score === 'Fair Market') return 'default';
    return 'destructive';
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-32 md:pb-8 max-w-7xl">
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group">
        <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> 
        <span className="text-xs font-bold uppercase tracking-widest">Back to Market Results</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left: Item Info (8 cols) */}
        <div className="lg:col-span-7 space-y-8 md:space-y-12">
          <section className="space-y-4 md:space-y-6">
            <div className="aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 relative group">
              <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={item.title} />
              <div className="absolute top-4 md:top-6 left-4 md:left-6 flex flex-wrap gap-2 md:gap-3">
                {item.status === 'live' ? (
                  <Badge variant="accent" className="bg-red-500 text-white border-none font-black px-3 md:px-4 py-1 md:py-1.5 animate-pulse text-[9px] md:text-[10px]">LIVE AUCTION</Badge>
                ) : (
                  <Badge variant="secondary" className="font-black px-3 md:px-4 py-1 md:py-1.5 text-[9px] md:text-[10px]">SOLD RESULT</Badge>
                )}
                {item.isNative && (
                  <Badge variant="accent" className="bg-accent text-black border-none font-black px-3 md:px-4 py-1 md:py-1.5 text-[9px] md:text-[10px]">UNRESERVED DIRECT</Badge>
                )}
              </div>
              <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 flex gap-2 md:gap-3">
                <div className="glass px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-1.5 md:gap-2 text-[9px] md:text-xs font-bold border border-white/10">
                  <Eye size={14} className="text-accent md:w-4 md:h-4" /> {item.views} watchers
                </div>
                <div className="glass px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-1.5 md:gap-2 text-[9px] md:text-xs font-bold border border-white/10">
                  <TrendingUp size={14} className="text-green-500 md:w-4 md:h-4" /> Trending
                </div>
              </div>
            </div>
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-24 md:w-32 aspect-video rounded-lg md:rounded-xl overflow-hidden border border-white/5 hover:border-accent transition-all cursor-pointer shrink-0 opacity-60 hover:opacity-100">
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt="thumb" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3 text-muted-foreground">
                  <Badge variant="outline" className="font-bold text-[9px] md:text-[10px]">{item.category}</Badge>
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
                { label: 'Source', value: item.auctionSource },
              ].map((spec, i) => (
                <div key={i} className="space-y-0.5 md:space-y-1">
                  <div className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{spec.label}</div>
                  <div className="text-base md:text-lg font-bold">{spec.value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-white/5">
              <h3 className="text-lg md:text-xl font-black tracking-tight">Market Description</h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-lg font-medium">
                This {item.year} {item.make} {item.model} represents a high-liquidity asset in the current market. 
                Features include high-performance hydraulics, advanced operator comfort package, and full service history. 
                Recently inspected and verified by our team of experts.
              </p>
            </div>

            {/* Comparable Sales Section */}
            <div className="space-y-6 pt-8 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <History size={20} className="text-accent" /> Comparable Sales
                </h3>
                <Badge variant="outline" className="font-bold">Last 12 Months</Badge>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-secondary/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Asset</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {items.filter(i => i.category === item.category && i.status === 'sold').slice(0, 4).map((comp, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group cursor-pointer">
                        <td className="px-4 py-4 font-bold group-hover:text-accent">{comp.year} {comp.make} {comp.model}</td>
                        <td className="px-4 py-4 text-muted-foreground">{comp.saleDate}</td>
                        <td className="px-4 py-4 text-muted-foreground">{comp.location}</td>
                        <td className="px-4 py-4 text-right font-black text-accent">{formatCurrency(comp.price || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="ghost" size="sm" className="w-full text-xs font-bold uppercase tracking-widest">
                View 24+ More Comparables <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>

            {/* Bid History Section (Live only) */}
            {item.status === 'live' && (
              <div className="space-y-6 pt-8 border-t border-white/5">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <TrendingUp size={20} className="text-red-500" /> Bid History
                </h3>
                <div className="space-y-3">
                  {[
                    { bidder: 'B***8', amount: item.currentBid!, time: '2m ago' },
                    { bidder: 'K***2', amount: item.currentBid! - 2500, time: '14m ago' },
                    { bidder: 'J***5', amount: item.currentBid! - 5000, time: '1h ago' },
                  ].map((bid, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                          {bid.bidder[0]}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{bid.bidder}</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">{bid.time}</div>
                        </div>
                      </div>
                      <div className="text-lg font-black text-foreground">{formatCurrency(bid.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right: Intelligence Panel (5 cols) */}
        <aside className="lg:col-span-5 space-y-4 md:space-y-6">
          <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] intelligence-gradient border border-accent/20 shadow-2xl shadow-accent/5 space-y-6 md:space-y-8 sticky top-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3 text-accent">
                <Zap size={20} className="md:w-6 md:h-6" fill="currentColor" />
                <h2 className="text-lg md:text-xl font-black tracking-tight uppercase">Intelligence</h2>
              </div>
              <Badge variant="accent" className="font-black px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[10px]">UNRESERVED AI</Badge>
            </div>

            {/* Main Intelligence Blocks */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 space-y-0.5 md:space-y-1">
                <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Est. Fair Value</span>
                <div className="text-sm md:text-xl font-black text-foreground">
                  {item.fairValueRange ? `${formatCurrency(item.fairValueRange[0])} - ${formatCurrency(item.fairValueRange[1])}` : 'N/A'}
                </div>
              </div>
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-accent/10 border border-accent/20 space-y-0.5 md:space-y-1">
                <span className="text-[8px] md:text-[10px] font-bold text-accent uppercase tracking-widest">Rec. Max Bid</span>
                <div className="text-sm md:text-xl font-black text-accent">{formatCurrency(item.recommendedMaxBid || 0)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 space-y-1 md:space-y-2">
                <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Buyer Edge</span>
                <div className="flex items-center gap-2">
                  <Badge variant={getBuyerEdgeColor(item.buyerEdgeScore || '')} className="font-black text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1">
                    {item.buyerEdgeScore}
                  </Badge>
                </div>
              </div>
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 space-y-0.5 md:space-y-1">
                <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Confidence</span>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="flex-1 h-1 md:h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${item.confidenceScore}%` }} />
                  </div>
                  <span className="text-xs md:text-sm font-black">{item.confidenceScore}%</span>
                </div>
              </div>
            </div>

            {/* Risk Flags */}
            <div className="space-y-3">
              <h3 className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Market Risk Flags</h3>
              <div className="flex flex-wrap gap-2">
                {item.riskFlags?.map((flag, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] md:text-[10px] font-bold">
                    <AlertTriangle size={10} className="md:w-3 md:h-3" />
                    {flag}
                  </div>
                ))}
                {(!item.riskFlags || item.riskFlags.length === 0) && (
                  <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[8px] md:text-[10px] font-bold">
                    <CheckCircle2 size={10} className="md:w-3 md:h-3" />
                    No major risks detected
                  </div>
                )}
              </div>
            </div>

            {/* AI Insights */}
            <MarketInsight category={item.category} itemTitle={item.title} />

            {/* Pricing Chart */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">90-Day Market Trend</h3>
              <div className="h-24 md:h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TREND_DATA}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1dd058" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1dd058" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="price" stroke="#1dd058" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Paywall / CTA */}
            {!isSubscribed ? (
              <div className="relative pt-2 md:pt-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent -top-20 pointer-events-none" />
                <div className="relative bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 text-center space-y-3 md:space-y-4">
                  <div className="flex justify-center text-accent"><Lock size={24} className="md:w-8 md:h-8" /></div>
                  <div className="space-y-1">
                    <h4 className="font-black text-base md:text-lg">Unlock Full Market Report</h4>
                    <p className="text-[10px] md:text-xs text-muted-foreground">Get access to 24 comparable sales, regional price heatmaps, and AI-driven bidding strategies.</p>
                  </div>
                  <Button className="w-full h-10 md:h-12 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm" onClick={() => setIsSubscribed(true)}>Upgrade to Pro — $9/mo</Button>
                </div>
              </div>
            ) : (
              <div className="pt-4 md:pt-6 border-t border-white/10 space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 md:gap-3 text-green-500 text-xs md:text-sm font-black">
                  <ShieldCheck size={16} className="md:w-5 md:h-5" /> Pro Intelligence Active
                </div>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <Button variant="outline" className="text-[8px] md:text-[10px] font-bold h-8 md:h-10 rounded-lg md:rounded-xl">Download PDF</Button>
                  <Button variant="outline" className="text-[8px] md:text-[10px] font-bold h-8 md:h-10 rounded-lg md:rounded-xl">Share Insight</Button>
                </div>
              </div>
            )}

            <div className="pt-2 md:pt-4">
              <Button 
                variant="outline" 
                className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border-accent/50 text-accent hover:bg-accent/10 font-bold text-xs md:text-sm"
                onClick={onList}
              >
                <Plus size={16} className="mr-2 md:w-5 md:h-5" /> List your item like this
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky Action Bar (Mobile Only) */}
      {item.status === 'live' && (
        <div className="fixed bottom-[92px] left-0 right-0 z-[90] md:hidden p-4 bg-background/80 backdrop-blur-xl border-t border-white/5 animate-in slide-in-from-bottom duration-500 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Current Bid</div>
              <div className="text-xl font-black text-accent">{formatCurrency(item.currentBid || 0)}</div>
            </div>
            <Button className="flex-[2] h-12 rounded-xl font-black text-sm bg-accent text-black">
              Place Bid Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const LastUpdatedIndicator = ({ lastFetched }: { lastFetched: number | null }) => {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    if (!lastFetched) return;
    const tick = () => setSecondsAgo(Math.floor((Date.now() - lastFetched) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastFetched]);

  if (!lastFetched) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
      <span className="relative flex h-1.5 w-1.5">
        <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", secondsAgo < 35 ? "bg-accent animate-ping" : "bg-yellow-500 animate-ping")} />
        <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", secondsAgo < 35 ? "bg-accent" : "bg-yellow-500")} />
      </span>
      Last updated: {secondsAgo}s ago
    </div>
  );
};

const LiveFeedPage = ({ onSelectItem, items }: { onSelectItem: (item: AuctionItem) => void, items: AuctionItem[] }) => {
  const { lastFetched, getPrice } = usePrices();

  return (
    <div className="flex flex-col gap-6 md:gap-12 pb-24 md:pb-12">
      {/* Live Ticker */}
      <div className="w-full h-12 bg-accent/10 border-y border-accent/20 overflow-hidden flex items-center">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-accent">NEW BID:</span>
              <span className="text-foreground">2021 JD 8R 370</span>
              <span className="text-accent font-black">$385,000</span>
              <span className="text-muted-foreground opacity-30">|</span>
              <span className="text-red-500">ENDING SOON:</span>
              <span className="text-foreground">CAT 320 GC</span>
              <span className="text-red-500 font-black">14m left</span>
              <span className="text-muted-foreground opacity-30">|</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Live Market Feed
              </div>
              <LastUpdatedIndicator lastFetched={lastFetched} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">Live Auctions</h1>
            <p className="text-muted-foreground text-sm md:text-lg font-medium max-w-xl">Real-time bidding across all major North American auction houses.</p>
          </div>
          <div className="flex gap-2 md:gap-3">
            <Button variant="outline" size="sm" className="flex-1 md:flex-none rounded-xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-white/10"><Filter size={16} className="mr-2" /> Filter</Button>
            <Button variant="outline" size="sm" className="flex-1 md:flex-none rounded-xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-white/10">Ending Soon</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.filter(i => i.status === 'live').map((item) => (
            <AuctionCard
              key={item.id}
              item={item}
              onClick={() => onSelectItem(item)}
              livePrice={getPrice(item.sourceUrl)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PricingPage = ({ setActivePage }: { setActivePage: (p: any) => void }) => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 pb-32 md:pb-24">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-4 md:space-y-6">
        <Badge variant="accent" className="font-black">Pricing Intelligence</Badge>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9]">Simple, data-driven <span className="text-accent italic">pricing</span>.</h1>
        <p className="text-muted-foreground text-sm md:text-xl font-medium leading-relaxed">Choose the plan that fits your business needs. No hidden fees, cancel anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="p-8 md:p-12 rounded-[2rem] bg-secondary/10 border border-white/5 space-y-8 md:space-y-12 flex flex-col">
          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Free</h3>
            <p className="text-muted-foreground text-xs md:text-sm font-medium">Basic market awareness for casual buyers.</p>
          </div>
          <div className="text-4xl md:text-6xl font-black tracking-tighter">$0 <span className="text-lg md:text-xl text-muted-foreground font-bold tracking-normal">/mo</span></div>
          <ul className="space-y-4 md:space-y-6 flex-1">
            {['Search 2.4M+ results', 'Basic average pricing', '2 recent comps per item', 'Live auction feed'].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-xs md:text-sm font-bold">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/5 flex items-center justify-center text-accent shrink-0"><CheckCircle2 size={14} /></div>
                {f}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest border-white/10" onClick={() => setActivePage('home')}>Get Started</Button>
        </div>

        {/* Pro Plan */}
        <div className="p-8 md:p-12 rounded-[2rem] intelligence-gradient border border-accent/50 space-y-8 md:space-y-12 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 bg-accent text-black px-6 py-2 rounded-bl-2xl text-[10px] font-black tracking-widest">RECOMMENDED</div>
          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Intelligence Pro</h3>
            <p className="text-muted-foreground text-xs md:text-sm font-medium">The ultimate tool for serious dealers and buyers.</p>
          </div>
          <div className="text-4xl md:text-6xl font-black tracking-tighter text-accent">$9 <span className="text-lg md:text-xl text-muted-foreground font-bold tracking-normal">/mo</span></div>
          <ul className="space-y-4 md:space-y-6 flex-1">
            {[
              'Full historical comp data',
              'Regional price differences',
              'Trend analytics & forecasting',
              'Custom price alerts',
              'PDF market reports',
              'Priority support'
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-xs md:text-sm font-bold">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0"><CheckCircle2 size={14} /></div>
                {f}
              </li>
            ))}
          </ul>
          <Button className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest bg-accent text-black hover:bg-accent/90 shadow-xl shadow-accent/20" onClick={() => setActivePage('home')}>Upgrade to Pro</Button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const ListYourItemPage = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    make: '',
    model: '',
    year: '',
    condition: 'Excellent',
    hours: '',
    location: '',
    price: '',
    description: '',
  });

  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(step + 1);
  };
  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen pt-8 md:pt-24 pb-32 md:pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8 md:mb-12 text-center space-y-2 md:space-y-4">
          <Badge variant="accent" className="font-black">Direct Marketplace</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">SELL YOUR <span className="text-accent italic">ASSET</span></h1>
          <p className="text-muted-foreground text-sm md:text-base font-medium">Reach thousands of active buyers across North America.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 md:mb-12 flex justify-between items-center relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 -z-10" />
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s}
              className={cn(
                "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black border-2 transition-all duration-500",
                step >= s ? "bg-accent border-accent text-black scale-110 shadow-lg shadow-accent/20" : "bg-background border-white/10 text-muted-foreground"
              )}
            >
              {s}
            </div>
          ))}
        </div>

        <Card className="p-6 md:p-10 bg-secondary/10 border-white/5 rounded-[2rem]">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Item Details</h2>
                <p className="text-xs text-muted-foreground font-medium">Start with the basics of your asset.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                  <select 
                    className="w-full h-14 bg-background border border-white/10 rounded-2xl px-4 outline-none focus:border-accent transition-all font-bold appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option value="Tractors">Tractors</option>
                    <option value="Combines">Combines</option>
                    <option value="Excavators">Excavators</option>
                    <option value="Trucks">Trucks</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Make</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Deere"
                      className="w-full h-14 bg-background border border-white/10 rounded-2xl px-4 outline-none focus:border-accent transition-all font-bold"
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Model</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 9320"
                      className="w-full h-14 bg-background border border-white/10 rounded-2xl px-4 outline-none focus:border-accent transition-all font-bold"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Year</label>
                  <input 
                    type="number" 
                    placeholder="2024"
                    className="w-full h-14 bg-background border border-white/10 rounded-2xl px-4 outline-none focus:border-accent transition-all font-bold"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  />
                </div>
              </div>
              <Button className="w-full h-16 rounded-2xl text-lg font-black bg-accent text-black hover:bg-accent/90 shadow-xl shadow-accent/20" onClick={nextStep}>Continue</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Condition & Specs</h2>
                <p className="text-xs text-muted-foreground font-medium">Be as detailed as possible for better intelligence.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Condition</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Excellent', 'Good', 'Fair'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setFormData({ ...formData, condition: c })}
                        className={cn(
                          "h-12 rounded-xl border text-xs font-black uppercase tracking-widest transition-all",
                          formData.condition === c ? "bg-accent border-accent text-black" : "bg-background border-white/10 hover:border-accent/50"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Hours / Mileage</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1,200 hrs"
                    className="w-full h-14 bg-background border border-white/10 rounded-2xl px-4 outline-none focus:border-accent transition-all font-bold"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your item's features, maintenance history, and any issues..."
                    className="w-full bg-background border border-white/10 rounded-2xl p-4 outline-none focus:border-accent transition-all font-bold resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 rounded-2xl font-black border-white/10" onClick={prevStep}>Back</Button>
                <Button className="h-16 rounded-2xl font-black bg-accent text-black" onClick={nextStep}>Continue</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Photos & Pricing</h2>
                <p className="text-xs text-muted-foreground font-medium">Visuals are key to market-truth pricing.</p>
              </div>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-12 text-center hover:border-accent/50 transition-all cursor-pointer bg-background group">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  <p className="font-black uppercase tracking-widest text-xs">Upload Photos</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-medium">Drag and drop or click to browse. Up to 20 photos.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asking Price (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full h-14 bg-background border border-white/10 rounded-2xl pl-8 pr-4 outline-none focus:border-accent transition-all font-black text-lg"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="City, State/Province"
                      className="w-full h-14 bg-background border border-white/10 rounded-2xl pl-10 pr-4 outline-none focus:border-accent transition-all font-bold"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 rounded-2xl font-black border-white/10" onClick={prevStep}>Back</Button>
                <Button className="h-16 rounded-2xl font-black bg-accent text-black" onClick={nextStep}>Review</Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Review & Submit</h2>
                <p className="text-xs text-muted-foreground font-medium">Final check before going live.</p>
              </div>
              <div className="space-y-4 bg-background p-6 rounded-[1.5rem] border border-white/5">
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Item</span>
                  <span className="font-bold text-sm">{formData.year} {formData.make} {formData.model}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</span>
                  <span className="font-bold text-sm">{formData.category}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Condition</span>
                  <span className="font-bold text-sm">{formData.condition}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</span>
                  <span className="font-bold text-sm">{formData.location}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asking Price</span>
                  <span className="font-black text-lg text-accent">{formData.price ? formatCurrency(Number(formData.price)) : 'Unreserved'}</span>
                </div>
              </div>
              
              <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20 flex gap-4">
                <ShieldCheck className="text-accent shrink-0" size={20} />
                <p className="text-[10px] leading-relaxed font-medium text-muted-foreground">
                  By listing your item, you agree to our <span className="text-foreground font-bold">Terms of Service</span>. Your listing will be reviewed by our intelligence team before going live.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 rounded-2xl font-black border-white/10" onClick={prevStep}>Back</Button>
                <Button onClick={onComplete} className="h-16 rounded-2xl font-black bg-accent text-black hover:bg-accent/90 shadow-xl shadow-accent/20">Submit Listing</Button>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
};

const AGENTIC_CATEGORIES = [
  'Tractors', 'Excavators', 'Trucks', 'Trailers', 'Loaders', 'Cranes',
  'Forklifts', 'Compactors', 'Generators', 'Vehicles', 'Farm Equipment',
  'Attachments', 'Other'
];

const AGENTIC_CURRENCIES = ['CAD', 'USD'];

const AGENTIC_PLATFORMS = [
  'Ritchie Bros.', 'Purple Wave', 'IronPlanet', 'GovPlanet',
  'Proxibid', 'BigIron', 'AuctionTime', 'Machinery Trader', 'Other'
];

const BULK_PLACEHOLDER = `[
  {
    "source_platform": "Garthbid",
    "source_url": "https://www.garthbid.com/en/auction/abc123",
    "category": "Vehicles",
    "title": "2017 Ford Expedition Platinum Max",
    "year": 2017,
    "make": "Ford",
    "model": "Expedition Platinum Max",
    "location": "Westlock, AB",
    "description": "Great looking Large SUV...",
    "photos": ["https://example.com/photo1.jpg"],
    "vin": "1FMJK1MT9HEA71393",
    "km_hours": "255000 km",
    "currency": "CAD",
    "starting_price": 250
  }
]`;

const AgenticListingForm = ({ onSubmitListing, onBulkImport, onNavigateToLive }: { onSubmitListing: (formData: any) => void, onBulkImport: (items: any[]) => number, onNavigateToLive: () => void }) => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('bulk');
  const [isExpanded, setIsExpanded] = useState(false);

  // Single item form state
  const [formData, setFormData] = useState({
    sourcePlatform: '',
    sourceUrl: '',
    category: '',
    title: '',
    year: '',
    make: '',
    model: '',
    location: '',
    description: '',
    photoUrls: '',
    vinSerial: '',
    hoursKms: '',
    currency: 'CAD',
    startingPrice: '',
  });
  const [singleSubmitted, setSingleSubmitted] = useState(false);

  // Bulk import state
  const [bulkJson, setBulkJson] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [bulkItemCount, setBulkItemCount] = useState(0);
  const [bulkSuccess, setBulkSuccess] = useState<number | null>(null);

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  // Parse bulk JSON on change
  const handleBulkChange = (value: string) => {
    setBulkJson(value);
    setBulkError('');
    setBulkSuccess(null);
    if (!value.trim()) {
      setBulkItemCount(0);
      return;
    }
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        setBulkError('JSON must be an array of items');
        setBulkItemCount(0);
        return;
      }
      setBulkItemCount(parsed.length);
    } catch {
      setBulkError('Invalid JSON — check syntax');
      setBulkItemCount(0);
    }
  };

  const handleBulkImport = () => {
    setBulkError('');
    if (!bulkJson.trim()) {
      setBulkError('Paste your JSON array first');
      return;
    }
    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) {
        setBulkError('JSON must be an array of items');
        return;
      }
      if (parsed.length === 0) {
        setBulkError('Array is empty — nothing to import');
        return;
      }
      const count = onBulkImport(parsed);
      setBulkSuccess(count);
      setBulkJson('');
      setBulkItemCount(0);
      setTimeout(() => {
        setBulkSuccess(null);
        setIsExpanded(false);
        onNavigateToLive();
      }, 2500);
    } catch {
      setBulkError('Invalid JSON — check syntax');
    }
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitListing(formData);
    setSingleSubmitted(true);
    setTimeout(() => {
      setSingleSubmitted(false);
      setFormData({
        sourcePlatform: '', sourceUrl: '', category: '', title: '', year: '',
        make: '', model: '', location: '', description: '', photoUrls: '',
        vinSerial: '', hoursKms: '', currency: 'CAD', startingPrice: '',
      });
      setIsExpanded(false);
      onNavigateToLive();
    }, 3000);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all";
  const selectClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all appearance-none cursor-pointer";
  const labelClass = "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2";

  return (
    <section className="border-t border-accent/20 bg-gradient-to-b from-accent/5 via-background to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header — always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Bot size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase">
                Agentic Listing
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Post it. Forget it. Our scrapers handle the rest.
              </p>
            </div>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-accent/30 group-hover:bg-accent/10",
            isExpanded && "rotate-180"
          )}>
            <ChevronDown size={18} className="text-muted-foreground group-hover:text-accent transition-colors" />
          </div>
        </button>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              {/* Tabs */}
              <div className="mt-8 flex gap-2">
                <button
                  onClick={() => setActiveTab('single')}
                  className={cn(
                    "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    activeTab === 'single'
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground"
                  )}
                >
                  <PlusCircle size={14} className="inline mr-2 -mt-0.5" />
                  Single Item
                </button>
                <button
                  onClick={() => setActiveTab('bulk')}
                  className={cn(
                    "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    activeTab === 'bulk'
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground"
                  )}
                >
                  <Upload size={14} className="inline mr-2 -mt-0.5" />
                  Bulk Import
                </button>
              </div>

              {/* ── BULK IMPORT TAB ── */}
              {activeTab === 'bulk' && (
                <div className="mt-6 space-y-4">
                  {bulkSuccess !== null ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-12 rounded-3xl border border-accent/20 bg-accent/5 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-accent" />
                      </div>
                      <h4 className="text-xl font-black uppercase tracking-tight">{bulkSuccess} Items Imported</h4>
                      <p className="text-sm text-muted-foreground mt-2">Redirecting to Live Auctions...</p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          <FileText size={12} /> Paste JSON Array
                        </label>
                        <div className="flex items-center gap-3">
                          {bulkItemCount > 0 && (
                            <span className="text-xs font-black text-accent">
                              {bulkItemCount} item{bulkItemCount !== 1 ? 's' : ''} detected
                            </span>
                          )}
                          {bulkError && (
                            <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                              <AlertTriangle size={12} /> {bulkError}
                            </span>
                          )}
                        </div>
                      </div>
                      <textarea
                        value={bulkJson}
                        onChange={e => handleBulkChange(e.target.value)}
                        placeholder={BULK_PLACEHOLDER}
                        className={cn(
                          "w-full bg-black/60 border rounded-2xl px-5 py-4 text-sm text-foreground font-mono leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 transition-all resize-y",
                          bulkError
                            ? "border-red-500/50 focus:border-red-500/80 focus:ring-red-500/30"
                            : "border-white/10 focus:border-accent/50 focus:ring-accent/30"
                        )}
                        style={{ minHeight: '400px' }}
                      />
                      <div className="flex justify-end pt-2">
                        <Button
                          onClick={handleBulkImport}
                          disabled={bulkItemCount === 0}
                          className={cn(
                            "h-14 px-10 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]",
                            bulkItemCount > 0
                              ? "bg-accent text-black hover:bg-accent/90 shadow-accent/20"
                              : "bg-white/10 text-muted-foreground cursor-not-allowed shadow-none"
                          )}
                        >
                          <Upload size={16} className="mr-2" />
                          Paste & Import{bulkItemCount > 0 ? ` (${bulkItemCount})` : ''}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── SINGLE ITEM TAB ── */}
              {activeTab === 'single' && (
                <>
                  {singleSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 p-12 rounded-3xl border border-accent/20 bg-accent/5 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-accent" />
                      </div>
                      <h4 className="text-xl font-black uppercase tracking-tight">Listing Posted</h4>
                      <p className="text-sm text-muted-foreground mt-2">Set it and forget it. Your listing is live.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSingleSubmit} className="mt-6 space-y-8">
                      {/* Source Section */}
                      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock size={12} className="text-accent" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Source (Paywalled)</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}><Globe size={12} /> Source Platform</label>
                            <select
                              value={formData.sourcePlatform}
                              onChange={e => update('sourcePlatform', e.target.value)}
                              className={selectClass}
                              required
                            >
                              <option value="" className="bg-background">Select platform...</option>
                              {AGENTIC_PLATFORMS.map(p => (
                                <option key={p} value={p} className="bg-background">{p}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}><Link size={12} /> Source URL</label>
                            <input
                              type="url"
                              value={formData.sourceUrl}
                              onChange={e => update('sourceUrl', e.target.value)}
                              placeholder="https://..."
                              className={inputClass}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className={labelClass}><Filter size={12} /> Category</label>
                          <select
                            value={formData.category}
                            onChange={e => update('category', e.target.value)}
                            className={selectClass}
                            required
                          >
                            <option value="" className="bg-background">Select...</option>
                            {AGENTIC_CATEGORIES.map(c => (
                              <option key={c} value={c} className="bg-background">{c}</option>
                            ))}
                          </select>
                        </div>
                        <div className="lg:col-span-3">
                          <label className={labelClass}><FileText size={12} /> Title</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={e => update('title', e.target.value)}
                            placeholder="2021 John Deere 8R 370"
                            className={inputClass}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className={labelClass}><Clock size={12} /> Year</label>
                          <input
                            type="number"
                            value={formData.year}
                            onChange={e => update('year', e.target.value)}
                            placeholder="2021"
                            min="1900"
                            max="2030"
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Make</label>
                          <input
                            type="text"
                            value={formData.make}
                            onChange={e => update('make', e.target.value)}
                            placeholder="John Deere"
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Model</label>
                          <input
                            type="text"
                            value={formData.model}
                            onChange={e => update('model', e.target.value)}
                            placeholder="8R 370"
                            className={inputClass}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}><MapPin size={12} /> Location</label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={e => update('location', e.target.value)}
                            placeholder="Saskatoon, SK"
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}><Hash size={12} /> VIN / Serial #</label>
                          <input
                            type="text"
                            value={formData.vinSerial}
                            onChange={e => update('vinSerial', e.target.value)}
                            placeholder="1HGBH41JXMN109186"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}><Info size={12} /> Description</label>
                        <textarea
                          value={formData.description}
                          onChange={e => update('description', e.target.value)}
                          placeholder="Condition, features, service history..."
                          rows={3}
                          className={cn(inputClass, "resize-none")}
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass}><Camera size={12} /> Photo URLs (one per line)</label>
                        <textarea
                          value={formData.photoUrls}
                          onChange={e => update('photoUrls', e.target.value)}
                          placeholder={"https://images.example.com/photo1.jpg\nhttps://images.example.com/photo2.jpg"}
                          rows={3}
                          className={cn(inputClass, "resize-none font-mono text-xs")}
                          required
                        />
                      </div>

                      {/* Bottom row: Hours/KMs, Currency, Starting Price */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className={labelClass}><Gauge size={12} /> Hours / KMs</label>
                          <input
                            type="text"
                            value={formData.hoursKms}
                            onChange={e => update('hoursKms', e.target.value)}
                            placeholder="3,200 hrs"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}><DollarSign size={12} /> Currency</label>
                          <select
                            value={formData.currency}
                            onChange={e => update('currency', e.target.value)}
                            className={selectClass}
                          >
                            {AGENTIC_CURRENCIES.map(c => (
                              <option key={c} value={c} className="bg-background">{c}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}><DollarSign size={12} /> Starting Price</label>
                          <input
                            type="number"
                            value={formData.startingPrice}
                            onChange={e => update('startingPrice', e.target.value)}
                            placeholder="50000"
                            min="0"
                            className={inputClass}
                            required
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          className="h-14 px-10 rounded-2xl bg-accent text-black font-black text-sm uppercase tracking-widest hover:bg-accent/90 shadow-xl shadow-accent/20 transition-all active:scale-[0.98]"
                        >
                          <Upload size={16} className="mr-2" />
                          Post Listing
                        </Button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'search' | 'detail' | 'live' | 'pricing' | 'list'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [items, setItems] = useState<AuctionItem[]>(MOCK_ITEMS);

  const handleAgenticListing = (formData: {
    sourcePlatform: string;
    sourceUrl: string;
    category: string;
    title: string;
    year: string;
    make: string;
    model: string;
    location: string;
    description: string;
    photoUrls: string;
    vinSerial: string;
    hoursKms: string;
    currency: string;
    startingPrice: string;
  }) => {
    const newItem: AuctionItem = {
      id: `agentic-${Date.now()}`,
      title: `${formData.year} ${formData.make} ${formData.model}`,
      category: formData.category,
      year: parseInt(formData.year),
      make: formData.make,
      model: formData.model,
      location: formData.location,
      price: parseFloat(formData.startingPrice),
      currentBid: parseFloat(formData.startingPrice),
      auctionSource: formData.sourcePlatform,
      imageUrl: formData.photoUrls.split('\n').filter(Boolean)[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      status: 'live',
      timeLeft: '23h 59m',
      views: 0,
      fairValueRange: [parseFloat(formData.startingPrice) * 0.9, parseFloat(formData.startingPrice) * 1.1],
      recommendedMaxBid: parseFloat(formData.startingPrice) * 1.05,
      buyerEdgeScore: 'Strong Buy',
      confidenceScore: 85,
      riskFlags: ['New listing — limited market data'],
      isNative: true,
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleBulkImport = (rawItems: any[]): number => {
    const newItems: AuctionItem[] = rawItems.map((raw, i) => ({
      id: `bulk-${Date.now()}-${i}`,
      sourceUrl: raw.source_url || '',
      title: raw.title || `${raw.year} ${raw.make} ${raw.model}`,
      category: raw.category || 'Other',
      year: typeof raw.year === 'number' ? raw.year : parseInt(raw.year) || 0,
      make: raw.make || '',
      model: raw.model || '',
      location: raw.location || '',
      price: typeof raw.starting_price === 'number' ? raw.starting_price : parseFloat(raw.starting_price) || 0,
      currentBid: typeof raw.starting_price === 'number' ? raw.starting_price : parseFloat(raw.starting_price) || 0,
      auctionSource: raw.source_platform || 'Unknown',
      imageUrl: (Array.isArray(raw.photos) && raw.photos[0]) || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      status: 'live' as const,
      timeLeft: '23h 59m',
      views: 0,
      fairValueRange: [
        (typeof raw.starting_price === 'number' ? raw.starting_price : parseFloat(raw.starting_price) || 0) * 0.9,
        (typeof raw.starting_price === 'number' ? raw.starting_price : parseFloat(raw.starting_price) || 0) * 1.1
      ],
      recommendedMaxBid: (typeof raw.starting_price === 'number' ? raw.starting_price : parseFloat(raw.starting_price) || 0) * 1.05,
      buyerEdgeScore: 'Strong Buy' as const,
      confidenceScore: 85,
      riskFlags: ['New listing — limited market data'],
      isNative: true,
    }));
    setItems(prev => [...newItems, ...prev]);
    return newItems.length;
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setActivePage('search');
    window.scrollTo(0, 0);
  };

  const handleSelectItem = (item: AuctionItem) => {
    setShowSubscriptionModal(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <button onClick={() => setActivePage('home')} className="flex items-start group">
              <span className="text-2xl font-black tracking-tighter text-foreground leading-none">
                UNRESERVED
              </span>
              <span className="text-[8px] font-black text-accent ml-0.5 tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity relative -top-[3px]">
                NET
              </span>
            </button>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setActivePage('live')} className={cn('text-xs font-bold uppercase tracking-widest transition-colors hover:text-accent', activePage === 'live' ? 'text-accent' : 'text-muted-foreground')}>Live Auctions</button>
              <button onClick={() => handleSearch('')} className={cn('text-xs font-bold uppercase tracking-widest transition-colors hover:text-accent', activePage === 'search' ? 'text-accent' : 'text-muted-foreground')}>Market Results</button>
              <button onClick={() => setActivePage('pricing')} className={cn('text-xs font-bold uppercase tracking-widest transition-colors hover:text-accent', activePage === 'pricing' ? 'text-accent' : 'text-muted-foreground')}>Pricing</button>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest">Sign In</Button>
              <Button size="sm" className="rounded-xl px-6 bg-accent text-black font-bold h-10" onClick={() => setShowSubscriptionModal(true)}>List Item</Button>
            </div>
            <button 
              className="md:hidden p-2 text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col md:hidden"
          >
            <div className="p-6 flex justify-between items-center border-b border-white/5">
              <div className="flex items-start group">
                <span className="text-xl font-black tracking-tighter text-foreground leading-none">
                  UNRESERVED
                </span>
                <span className="text-[8px] font-black text-accent ml-0.5 tracking-[0.2em] relative -top-[3px]">
                  NET
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="rounded-full hover:bg-white/5">
                <X size={24} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-12">
              <nav className="space-y-6">
                {[
                  { id: 'home', label: 'Marketplace', icon: <LayoutGrid size={20} /> },
                  { id: 'live', label: 'Live Auctions', icon: <Zap size={20} /> },
                  { id: 'pricing', label: 'Intelligence Pro', icon: <TrendingUp size={20} /> },
                  { id: 'list', label: 'Sell Direct', icon: <PlusCircle size={20} /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { 
                      if (item.id === 'search') handleSearch('');
                      else if (item.id === 'list') setShowSubscriptionModal(true);
                      else setActivePage(item.id as any); 
                      setIsMobileMenuOpen(false); 
                    }}
                    className="flex items-center gap-6 w-full group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                      {item.icon}
                    </div>
                    <span className="text-2xl font-black tracking-tight group-hover:text-accent transition-colors">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="space-y-6 pt-12 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Account & Support</p>
                <div className="grid grid-cols-1 gap-4">
                  <Button variant="outline" className="h-14 rounded-2xl justify-start px-6 font-black text-sm uppercase tracking-widest border-white/10">
                    <User size={18} className="mr-4 text-accent" /> My Profile
                  </Button>
                  <Button variant="outline" className="h-14 rounded-2xl justify-start px-6 font-black text-sm uppercase tracking-widest border-white/10">
                    <Bell size={18} className="mr-4 text-accent" /> Notifications
                  </Button>
                  <Button variant="outline" className="h-14 rounded-2xl justify-start px-6 font-black text-sm uppercase tracking-widest border-white/10">
                    <Settings size={18} className="mr-4 text-accent" /> Settings
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-secondary/5">
              <Button className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest bg-accent text-black hover:bg-accent/90 shadow-xl shadow-accent/20">
                Sign Out
              </Button>
              <p className="text-center mt-6 text-[10px] font-medium text-muted-foreground">Version 2.4.0 • Unreserved Intelligence</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <main>
        {activePage === 'home' && <HomePage onSearch={handleSearch} setActivePage={setActivePage} handleSelectItem={handleSelectItem} onListClick={() => setShowSubscriptionModal(true)} items={items} />}
        {activePage === 'search' && (
          <SearchResultsPage
            query={searchQuery}
            onSelectItem={handleSelectItem}
            onList={() => setShowSubscriptionModal(true)}
            items={items}
          />
        )}
        {activePage === 'detail' && selectedItem && (
          <ItemDetailPage
            item={selectedItem}
            onBack={() => setActivePage('search')}
            onList={() => setShowSubscriptionModal(true)}
            items={items}
          />
        )}
        {activePage === 'live' && <LiveFeedPage onSelectItem={handleSelectItem} items={items} />}
        {activePage === 'pricing' && <PricingPage setActivePage={setActivePage} />}
        {activePage === 'list' && <ListYourItemPage onComplete={() => setActivePage('home')} />}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNav activePage={activePage} setActivePage={setActivePage} onSearch={handleSearch} onListClick={() => setShowSubscriptionModal(true)} />

      {/* Subscription Modal */}
      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} />

      {/* Agentic Listing Form */}
      <AgenticListingForm onSubmitListing={handleAgenticListing} onBulkImport={handleBulkImport} onNavigateToLive={() => { setActivePage('live'); window.scrollTo(0, 0); }} />

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-xl font-black tracking-tighter text-foreground leading-none">
                  UNRESERVED
                </span>
                <span className="text-[7px] font-black text-accent ml-0.5 tracking-[0.2em] opacity-80 relative -top-[2px]">
                  NET
                </span>
              </div>
              <p className="text-sm text-muted-foreground">The definitive market intelligence platform for physical assets in North America.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => handleSearch('')} className="hover:text-accent">Search Results</button></li>
                <li><button onClick={() => setActivePage('live')} className="hover:text-accent">Live Auctions</button></li>
                <li><button className="hover:text-accent">Intelligence Reports</button></li>
                <li><button onClick={() => setShowSubscriptionModal(true)} className="hover:text-accent">Sell an Item</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-accent">About Us</button></li>
                <li><button className="hover:text-accent">Careers</button></li>
                <li><button className="hover:text-accent">Contact</button></li>
                <li><button className="hover:text-accent">Press</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-accent">Privacy Policy</button></li>
                <li><button className="hover:text-accent">Terms of Service</button></li>
                <li><button className="hover:text-accent">Cookie Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <div>© 2026 Unreserved.net. All rights reserved.</div>
            <div className="flex gap-6">
              <button className="hover:text-foreground">Twitter</button>
              <button className="hover:text-foreground">LinkedIn</button>
              <button className="hover:text-foreground">Instagram</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
