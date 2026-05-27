import React, { useState } from 'react';
import { Gavel, Search, Mic, PlusSquare, Bell, User, LayoutGrid, Home, Clock, History, ThumbsUp, ChevronDown, Award, Heart, MessageSquare, CreditCard, Settings, HelpCircle, MoreVertical, PlaySquare, TrendingUp, Zap, ShieldCheck, Newspaper, Star, AlertTriangle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, AUCTION_ITEMS, CHANNELS, LIVE_TICKER_DATA, AuctionItem, AuctionChannel } from './constants';
import { MOCK_ITEMS } from './mockData';
import { ItemDetailPage } from './ItemDetail';
import { AuctioneerProfile } from './AuctioneerProfile';

type DealTier = {
  label: string;
  textClass: string;
  dotClass: string;
};

const getDealTier = (score: number): DealTier => {
  if (score >= 90) return { label: 'Rare Deal', textClass: 'text-emerald-300', dotClass: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]' };
  if (score >= 80) return { label: 'Great Deal', textClass: 'text-green-400', dotClass: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.9)]' };
  if (score >= 70) return { label: 'Good Deal', textClass: 'text-lime-300', dotClass: 'bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]' };
  if (score >= 60) return { label: 'Fair Deal', textClass: 'text-yellow-300', dotClass: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]' };
  if (score >= 40) return { label: 'Watch Closely', textClass: 'text-orange-300', dotClass: 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]' };
  return { label: 'High Risk', textClass: 'text-red-400', dotClass: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]' };
};

const Navbar = ({ onOpenSubmit }: { onOpenSubmit: () => void }) => (
  <header className="fixed top-0 left-0 right-0 h-14 bg-black flex items-center justify-between px-3 md:px-4 z-50 border-b border-white/5">
    <div className="flex items-center gap-2 md:gap-3">
      <div className="flex items-baseline cursor-pointer group select-none">
        <span className="font-black text-lg md:text-xl tracking-tight text-white uppercase group-hover:text-white/90 transition-colors">
          UNRESERVED
        </span>
        <span className="ml-1 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-green-500 self-start mt-0.5 group-hover:text-green-400 transition-colors">
          NET
        </span>
      </div>
    </div>

    <div className="hidden md:flex flex-1 max-w-[600px] items-center gap-3 px-8">
      <div className="flex flex-1 items-center bg-[#111111] border border-white/5 rounded-md overflow-hidden focus-within:border-green-500/30 transition-all shadow-inner">
        <input
          type="text"
          placeholder="Search professional assets..."
          className="bg-transparent flex-1 px-4 py-1.5 outline-none text-xs text-white placeholder-gray-600 font-medium"
        />
        <button className="px-4 py-1.5 hover:bg-white/5 transition-colors group">
          <Search className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
        </button>
      </div>
    </div>

    <div className="flex items-center gap-2 md:gap-3">
      <button className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors">
        <Search className="w-[20px] h-[20px] text-white" />
      </button>

      <button onClick={onOpenSubmit} className="flex items-center gap-1.5 bg-white/[0.08] hover:bg-white/[0.14] pl-3 pr-3.5 md:pl-3 md:pr-4 h-9 rounded-full border border-white/10 transition-all">
        <PlusSquare className="w-4 h-4 text-white" strokeWidth={2.25} />
        <span className="text-[12px] md:text-[13px] font-semibold text-white tracking-tight">Submit</span>
      </button>

      <button className="relative w-9 h-9 flex items-center justify-center hover:bg-white/[0.08] rounded-full transition-colors">
        <Bell className="w-[20px] h-[20px] text-white" strokeWidth={2} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full ring-2 ring-black" />
      </button>

      <button className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/15 hover:ring-white/40 transition-all bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
        <span className="text-[12px] font-black text-black tracking-tighter">G</span>
      </button>
    </div>
  </header>
);

const BottomNav = ({ onOpenSubmit }: { onOpenSubmit: () => void }) => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-black border-t border-white/10 flex items-center justify-around px-2 z-50 pb-[env(safe-area-inset-bottom)]">
    <button className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-white">
      <Home className="w-5 h-5" />
      <span className="text-[9px] font-bold tracking-tight">Home</span>
    </button>
    <button className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-gray-400">
      <Zap className="w-5 h-5" />
      <span className="text-[9px] font-bold tracking-tight">Live</span>
    </button>
    <button onClick={onOpenSubmit} className="flex flex-col items-center justify-center flex-1 h-full text-gray-300">
      <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center -mt-1">
        <PlusSquare className="w-[18px] h-[18px]" />
      </div>
    </button>
    <button className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-gray-400 relative">
      <PlaySquare className="w-5 h-5" />
      <span className="absolute top-1.5 right-[28%] w-1.5 h-1.5 bg-green-500 rounded-full" />
      <span className="text-[9px] font-bold tracking-tight">Watchlist</span>
    </button>
    <button className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-gray-400">
      <User className="w-5 h-5" />
      <span className="text-[9px] font-bold tracking-tight">You</span>
    </button>
  </nav>
);

const SubmitModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [vin, setVin] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const merged = [...files, ...Array.from(incoming)].slice(0, 5);
    setFiles(merged);
  };

  const removeFile = (i: number) => setFiles(files.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const close = () => {
    setSubmitted(false);
    setTitle('');
    setVin('');
    setFiles([]);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-4"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-lg bg-[#0a0a0a] border border-white/10 rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-start justify-between px-5 md:px-6 pt-5 pb-3 border-b border-white/5">
          <div className="space-y-1.5 pr-4">
            <h2 className="text-base md:text-lg font-black uppercase tracking-tight text-white leading-tight">
              Submit Your Item For Review
            </h2>
            <p className="text-[11px] md:text-xs text-gray-400 leading-snug font-medium">
              If we feel your item is a good fit, we'll reach out with a detailed report and optimal selling strategy.
            </p>
          </div>
          <button
            onClick={close}
            className="shrink-0 w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {submitted ? (
          <div className="px-5 md:px-6 py-10 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
              <span className="text-green-400 text-xl font-black">✓</span>
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-white">Submission received</h3>
            <p className="text-xs text-gray-400 max-w-xs">
              Thanks — our team will review your item and follow up via email within 48 hours.
            </p>
            <button
              onClick={close}
              className="mt-3 bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-[11px] uppercase tracking-widest px-5 py-2 rounded-full border border-white/10"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 md:px-6 py-5 overflow-y-auto">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="2011 BMW Z4 sDrive35is"
                className="bg-[#111] border border-white/10 focus:border-green-500/40 focus:ring-2 focus:ring-green-500/15 outline-none text-sm font-medium text-white placeholder-gray-600 rounded-lg px-3 py-2.5 transition-all"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">VIN / Serial #</span>
              <input
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                required
                placeholder="WBALM7C58BE375293"
                className="bg-[#111] border border-white/10 focus:border-green-500/40 focus:ring-2 focus:ring-green-500/15 outline-none text-sm font-mono tracking-wide text-white placeholder-gray-600 rounded-lg px-3 py-2.5 transition-all"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                Best 5 Photos
                <span className="text-gray-600 font-medium normal-case tracking-normal ml-1.5">({files.length}/5)</span>
              </span>
              <div className="border border-dashed border-white/10 hover:border-green-500/40 transition-colors rounded-lg bg-[#0d0d0d] px-3 py-4 flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="text-[11px] text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-white/[0.08] file:text-white hover:file:bg-white/[0.14] file:cursor-pointer cursor-pointer"
                />
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {files.map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 bg-white/[0.05] border border-white/10 rounded-md pl-2 pr-1 py-1 text-[10px] text-gray-300 max-w-[180px]"
                      >
                        <span className="truncate">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="w-4 h-4 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </label>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={close}
                className="flex-1 h-11 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-bold text-[11px] uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title || !vin || files.length === 0}
                className="flex-[2] h-11 rounded-full bg-green-500 hover:bg-green-400 disabled:bg-white/[0.06] disabled:text-gray-600 text-black font-black text-[11px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,197,94,0.25)] disabled:shadow-none"
              >
                Submit For Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const LiveBidTicker = () => (
  <div className="bg-[#050505] border-b border-white/5 h-8 flex items-center overflow-hidden whitespace-nowrap">
    <div className="flex items-center gap-1.5 px-4 h-full bg-black border-r border-white/5 z-10">
      <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse" />
      <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] italic">Live Bids</span>
    </div>
    <div className="flex items-center gap-10 animate-scroll pl-4">
      {LIVE_TICKER_DATA.map((bid, i) => (
        <div key={i} className="flex items-center gap-2 group cursor-default">
          <span className="text-[9px] font-bold text-gray-600 group-hover:text-white transition-colors">{bid.item}</span>
          <span className="text-[9px] font-black text-white italic">${bid.price.toLocaleString()}</span>
          {bid.increase ? (
            <span className="text-[9px] font-black text-green-500">+{bid.increase}</span>
          ) : (
             <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">{bid.status}</span>
          )}
        </div>
      ))}
      {/* Duplicate for seamless scrolling */}
      {LIVE_TICKER_DATA.map((bid, i) => (
        <div key={`dup-${i}`} className="flex items-center gap-2 group cursor-default">
          <span className="text-[9px] font-bold text-gray-600 group-hover:text-white transition-colors">{bid.item}</span>
          <span className="text-[9px] font-black text-white italic">${bid.price.toLocaleString()}</span>
          {bid.increase ? (
            <span className="text-[9px] font-black text-green-500">+{bid.increase}</span>
          ) : (
             <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">{bid.status}</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 h-9 rounded-md transition-all mb-0.5 group ${active ? 'bg-white/5 text-white shadow-lg' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}>
    <Icon className={`w-3.5 h-3.5 ${active ? 'text-green-500' : 'text-gray-700 group-hover:text-gray-400'}`} />
    <span className={`text-[11px] uppercase tracking-widest font-black ${active ? '' : 'italic opacity-50 group-hover:opacity-100'}`}>{label}</span>
  </button>
);

type View = 'for-you' | 'ending-soon' | 'native-listings' | 'best-deals';

const Sidebar = ({ activeView, onSelect }: { activeView: View, onSelect: (v: View) => void }) => (
  <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-[220px] bg-black flex-col py-4 px-3 gap-0.5 shrink-0 border-r border-white/5 overflow-y-auto no-scrollbar">
    <div className="mb-4">
      <div className="px-3 py-1.5 text-[8px] font-black text-gray-700 uppercase tracking-[0.3em] mb-1">Navigation</div>
      <SidebarItem icon={LayoutGrid} label="For You" active={activeView === 'for-you'} onClick={() => onSelect('for-you')} />
      <SidebarItem icon={Clock} label="Ending Soon" active={activeView === 'ending-soon'} onClick={() => onSelect('ending-soon')} />
      <SidebarItem icon={ShieldCheck} label="Native Listings" active={activeView === 'native-listings'} onClick={() => onSelect('native-listings')} />
      <SidebarItem icon={Zap} label="Best Deals" active={activeView === 'best-deals'} onClick={() => onSelect('best-deals')} />
    </div>

    <div className="mb-4">
      <div className="px-3 py-1.5 text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] mb-1">Account</div>
      <SidebarItem icon={PlaySquare} label="Watchlist" />
      <SidebarItem icon={Bell} label="Alerts" />
      <SidebarItem icon={History} label="History" />
    </div>

    <div className="mt-auto pt-4 border-t border-white/5">
       <SidebarItem icon={Settings} label="Config" />
    </div>
  </aside>
);

const CategoryPills = () => (
  <div className="sticky top-0 bg-black/95 backdrop-blur-md z-40 px-3 md:px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 border-b border-white/5">
    <button className="bg-green-500 text-black px-4 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.15em] italic">All Market</button>
    {CATEGORIES.slice(1).map((cat) => (
      <button 
        key={cat} 
        className="bg-white/5 hover:bg-white/10 px-4 py-1 rounded-md text-[9px] transition-all whitespace-nowrap text-gray-500 hover:text-white font-black uppercase tracking-[0.1em]"
      >
        {cat}
      </button>
    ))}
  </div>
);

const BANNER_COPY: Record<View, { title: React.ReactNode; subtitle: string; cta: string }> = {
  'for-you': {
    title: <>The Home Of <span className="text-green-500">Unreserved</span> Auctions</>,
    subtitle: 'All of the best unreserved deals on the internet, all in one place — ranked by price, trust and time remaining.',
    cta: 'Sign Up Now',
  },
  'ending-soon': {
    title: <>Welcome To The <span className="text-green-500">Ending Soon</span> Page!</>,
    subtitle: 'These items are ranked strictly by time remaining.',
    cta: 'Sign Up Now',
  },
  'native-listings': {
    title: <><span className="text-green-500">Native</span> Listings</>,
    subtitle: 'Auctions hosted directly on Unreserved — verified sellers, zero buyer fees.',
    cta: 'Sign Up Now',
  },
  'best-deals': {
    title: <>The <span className="text-green-500">Best Deals</span> On The Internet</>,
    subtitle: 'Ranked by deal score — biggest gaps between current bid and fair market value.',
    cta: 'Sign Up Now',
  },
};

const HeroBanner = ({ view }: { view: View }) => {
  const copy = BANNER_COPY[view];
  return (
    <div className="px-3 md:px-6 mb-6">
      <div className="relative h-24 md:h-28 rounded-2xl overflow-hidden group bg-neutral-900 border border-white/5 shadow-xl">
        <img
          src="/auction-pics/2011_bmw_z4-sdrive35is_77_ext_2011-z4-auction-engine-31658.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-[20s] group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />

        <div className="relative h-full flex items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex flex-col gap-1 min-w-0">
            <h1 className="text-base md:text-2xl font-black text-white leading-tight tracking-tight uppercase">
              {copy.title}
            </h1>
            <p className="text-[10px] md:text-[12px] text-gray-400 leading-snug font-medium max-w-md truncate md:whitespace-normal md:truncate-none">
              {copy.subtitle}
            </p>
          </div>

          <button className="shrink-0 bg-green-500 hover:bg-green-400 text-black px-4 md:px-6 py-2 md:py-2.5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.15em] hover:scale-[1.03] transition-all shadow-[0_0_24px_rgba(34,197,94,0.35)] active:scale-95 whitespace-nowrap">
            {copy.cta}
          </button>
        </div>
      </div>
    </div>
  );
};

const AuctionCard: React.FC<{ item: AuctionItem; onClick?: () => void; onChannelClick?: (id: string) => void }> = ({ item, onClick, onChannelClick }) => {
  const channel = CHANNELS.find(c => c.id === item.channelId);
  const discount = Math.round((1 - item.currentBid/item.marketValue)*100);
  const tier = getDealTier(item.priceScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="flex flex-col gap-2 group cursor-pointer"
    >
      <div className="relative aspect-[16/9.5] rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-xl transition-all duration-300 group-hover:border-white/10">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {/* Subtle Bottom Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-3 left-3 scale-[0.9] origin-top-left">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-2.5 py-1.5 rounded-md flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${tier.dotClass}`} />
            <span className={`text-[10px] font-black uppercase tracking-tight leading-none italic ${tier.textClass}`}>
              {tier.label}
            </span>
          </div>
        </div>

      </div>

      <div className="flex gap-2.5 px-0.5">
        <div
          onClick={(e) => { e.stopPropagation(); if (channel && onChannelClick) onChannelClick(channel.id); }}
          className="relative cursor-pointer shrink-0 mt-0.5 hover:scale-105 transition-transform"
        >
          <div className="w-7 h-7 rounded-md bg-neutral-900 border border-white/5 p-0.5 overflow-hidden shadow-lg">
            <img src={channel?.avatar} alt="" className="w-full h-full rounded-[3px] object-cover" />
          </div>
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex flex-col gap-1 mb-3">
            <h3 className="font-black text-[12px] text-white leading-none tracking-tight uppercase group-hover:text-green-500 transition-colors truncate italic">
              {item.title}
            </h3>

            <div className="flex items-center">
              <span
                onClick={(e) => { e.stopPropagation(); if (channel && onChannelClick) onChannelClick(channel.id); }}
                className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic hover:text-white transition-colors cursor-pointer leading-none"
              >
                {channel?.name} <span className="opacity-30 mx-1 text-white text-[8px]">·</span> {item.location}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between pt-1.5 border-t border-white/5">
            <div className="flex flex-col">
               <span className="text-[7px] font-black text-gray-700 uppercase tracking-[0.2em] mb-0.5 italic leading-none">Current Bid</span>
               <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-white italic tracking-tighter leading-none">${item.currentBid.toLocaleString()}</span>
                  <span className="text-[9px] font-black text-green-600 leading-none">-{discount}% MARKET</span>
               </div>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[7px] font-black text-gray-700 uppercase tracking-[0.2em] mb-1 italic leading-none">Time Left</span>
               <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse" />
                 <span className="text-[11px] font-black uppercase tracking-tight leading-none italic text-red-400">{item.endTime}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('for-you');
  const [submitOpen, setSubmitOpen] = useState(false);

  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
    setSelectedChannelId(null);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleSelectChannel = (id: string) => {
    setSelectedChannelId(id);
    setSelectedItemId(null);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleSelectView = (v: View) => {
    setActiveView(v);
    setSelectedItemId(null);
    setSelectedChannelId(null);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // Map any clicked card to a rich detail item. Falls back to BMW Z4 (id '1')
  // for cards whose ids don't exist in MOCK_ITEMS yet.
  const detailItem = selectedItemId
    ? MOCK_ITEMS.find(m => m.id === selectedItemId) || MOCK_ITEMS[0]
    : null;

  const selectedChannel = selectedChannelId
    ? CHANNELS.find(c => c.id === selectedChannelId) || CHANNELS[0]
    : null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-green-500 selection:text-black">
      <Navbar onOpenSubmit={() => setSubmitOpen(true)} />

      <div className="flex flex-1 pt-14 pb-14 md:pb-0">
        <Sidebar activeView={activeView} onSelect={handleSelectView} />

        <main className="flex-1 md:ml-[220px] overflow-y-auto min-h-screen no-scrollbar bg-[#050505]">
          {selectedChannel ? (
            <AuctioneerProfile channel={selectedChannel} onBack={() => setSelectedChannelId(null)} />
          ) : detailItem ? (
            <ItemDetailPage item={detailItem} onBack={() => setSelectedItemId(null)} />
          ) : (
            <>
              <LiveBidTicker />
              <CategoryPills />

              <div className="py-4 md:py-6">
                <HeroBanner view={activeView} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 md:gap-y-12 px-3 md:px-6 pb-12 md:pb-20">
                  {AUCTION_ITEMS.map((item) => (
                    <AuctionCard key={item.id} item={item} onClick={() => handleSelectItem(item.id)} onChannelClick={handleSelectChannel} />
                  ))}
                  {/* Duplication for density test */}
                  {AUCTION_ITEMS.map((item) => (
                    <AuctionCard key={`${item.id}-dup`} item={item} onClick={() => handleSelectItem(item.id)} onChannelClick={handleSelectChannel} />
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <BottomNav onOpenSubmit={() => setSubmitOpen(true)} />

      <SubmitModal open={submitOpen} onClose={() => setSubmitOpen(false)} />
      
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
