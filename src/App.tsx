import React, { useEffect, useState } from 'react';
import { Gavel, Search, Mic, PlusSquare, Bell, User, LayoutGrid, Home, Clock, History, ThumbsUp, ChevronDown, Award, Heart, MessageSquare, CreditCard, Settings, HelpCircle, MoreVertical, PlaySquare, TrendingUp, Zap, ShieldCheck, Newspaper, Star, AlertTriangle, ExternalLink, Hammer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, AUCTION_ITEMS, CHANNELS, LIVE_TICKER_DATA, AuctionItem, AuctionChannel } from './constants';
import { MOCK_ITEMS } from './mockData';
import { ItemDetailPage } from './ItemDetail';
import { AuctioneerProfile } from './AuctioneerProfile';
import { ListingJourney } from './floor/ListingJourney';
import { SellerDashboard } from './floor/SellerDashboard';
import { FloorMarketItem } from './floor/FloorMarketItem';

type FloorRoute = 'listing' | 'dashboard' | 'floor-item' | null;

const getFloorRoute = (): FloorRoute => {
  const h = window.location.hash.replace('#', '');
  if (h === 'listing' || h === 'dashboard' || h === 'floor-item') return h;
  return null;
};

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

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-3 h-10 rounded-lg transition ${
      active ? 'bg-white/[0.08] text-white' : 'text-white hover:bg-white/[0.04]'
    }`}
  >
    <Icon size={20} strokeWidth={active ? 2.4 : 2} className="text-white shrink-0" />
    <span className="text-sm font-normal">{label}</span>
  </button>
);

const SidebarChannel: React.FC<{ name: string; avatar: string; onClick?: () => void }> = ({ name, avatar, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-5 px-3 h-10 rounded-lg transition text-white hover:bg-white/[0.04]"
  >
    <img src={avatar} alt={name} className="w-6 h-6 rounded-full object-cover shrink-0" />
    <span className="text-sm font-normal truncate">{name}</span>
  </button>
);

type View = 'for-you' | 'ending-soon' | 'native-listings' | 'best-deals' | 'floor-market';

const Sidebar = ({
  activeView,
  onSelect,
  onChannelClick,
}: {
  activeView: View;
  onSelect: (v: View) => void;
  onChannelClick?: (id: string) => void;
}) => (
  <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-[240px] bg-black flex-col py-3 px-3 gap-0.5 shrink-0 overflow-y-auto no-scrollbar">
    <SidebarItem icon={Home} label="Home" active={activeView === 'for-you'} onClick={() => onSelect('for-you')} />
    <SidebarItem icon={Clock} label="Ending Soon" active={activeView === 'ending-soon'} onClick={() => onSelect('ending-soon')} />
    <SidebarItem
      icon={ShieldCheck}
      label="Native Listings"
      active={activeView === 'native-listings'}
      onClick={() => onSelect('native-listings')}
    />
    <SidebarItem icon={Zap} label="Best Deals" active={activeView === 'best-deals'} onClick={() => onSelect('best-deals')} />
    <SidebarItem icon={TrendingUp} label="Floor Market" active={activeView === 'floor-market'} onClick={() => onSelect('floor-market')} />

    <div className="my-3 border-t border-white/10" />

    <div className="px-3 pb-1 pt-2 text-base font-semibold text-white">Sell on Unreserved</div>
    <SidebarItem icon={Hammer} label="List Vehicle" onClick={() => { window.location.hash = 'listing'; }} />
    <SidebarItem icon={LayoutGrid} label="Seller Dashboard" onClick={() => { window.location.hash = 'dashboard'; }} />
    <SidebarItem icon={ShieldCheck} label="Floor Market Item" onClick={() => { window.location.hash = 'floor-item'; }} />

    <div className="my-3 border-t border-white/10" />

    <div className="px-3 pb-1 pt-2 text-base font-semibold text-white">Channels</div>
    {CHANNELS.map((c) => (
      <SidebarChannel key={c.id} name={c.name} avatar={c.avatar} onClick={() => onChannelClick?.(c.id)} />
    ))}

    <div className="my-3 border-t border-white/10" />

    <div className="px-3 pb-1 pt-2 text-base font-semibold text-white">You</div>
    <SidebarItem icon={PlaySquare} label="Watchlist" />
    <SidebarItem icon={History} label="History" />
    <SidebarItem icon={Bell} label="Alerts" />

    <div className="my-3 border-t border-white/10" />

    <SidebarItem icon={Settings} label="Settings" />
    <SidebarItem icon={HelpCircle} label="Help" />
  </aside>
);

const CategoryPills = () => {
  const [active, setActive] = useState(0);
  const chips = ['All', ...CATEGORIES.slice(1)];
  return (
    <div className="sticky top-0 bg-black/95 backdrop-blur-md z-40 px-3 md:px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
      {chips.map((cat, i) => (
        <button
          key={cat}
          onClick={() => setActive(i)}
          className={`px-3 py-1.5 rounded-lg text-sm transition whitespace-nowrap font-medium ${
            i === active
              ? 'bg-white text-black'
              : 'bg-neutral-800 hover:bg-neutral-700 text-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

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
  'floor-market': {
    title: <>The <span className="text-green-500">Floor Market</span></>,
    subtitle: 'Live floor pricing across the network — see where bids are clearing right now.',
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

const AuctionCard: React.FC<{ item: AuctionItem; onClick?: () => void; onChannelClick?: (id: string) => void; variant?: 'default' | 'floor-market' }> = ({ item, onClick, onChannelClick, variant = 'default' }) => {
  const channel = CHANNELS.find(c => c.id === item.channelId);
  const isFloorMarket = variant === 'floor-market';

  return (
    <div onClick={onClick} className="flex flex-col gap-3 group cursor-pointer">
      <div className="relative aspect-video md:rounded-xl overflow-hidden bg-neutral-900">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {isFloorMarket && (
          <span className="absolute top-2 left-2 bg-green-500 text-black text-[11px] font-bold tracking-wide px-2 py-1 rounded">
            CURRENT FLOOR: ${item.currentBid.toLocaleString()}
          </span>
        )}
        <span className="absolute bottom-2 right-2 bg-black/85 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {item.endTime}
        </span>
      </div>

      <div className="flex gap-3 px-3 md:px-0.5">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); if (channel && onChannelClick) onChannelClick(channel.id); }}
          className="shrink-0"
        >
          <img src={channel?.avatar} alt="" className="w-10 h-10 rounded-full object-cover bg-neutral-800" />
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-white leading-snug line-clamp-2">
            {item.title}
          </h3>
          <div className="text-[12px] text-neutral-400 leading-tight mt-0.5">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); if (channel && onChannelClick) onChannelClick(channel.id); }}
              className="hover:text-white transition"
            >
              {channel?.name}
            </button>
            {item.isNative && (
              <svg viewBox="0 0 24 24" width="12" height="12" className="inline-block ml-1 -mt-px text-neutral-500 fill-current align-middle">
                <path d="M12 2 9.4 4.6 6 4l-.6 3.4L2 9l1.6 3L2 15l3.4 1.6L6 20l3.4-.6L12 22l2.6-2.6L18 20l.6-3.4L22 15l-1.6-3L22 9l-3.4-1.6L18 4l-3.4.6Zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9Z" />
              </svg>
            )}
            <span>
              {!isFloorMarket && <> · ${item.currentBid.toLocaleString()}</>}
              {' · '}{item.location}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 w-8 -mr-2 -mt-1 flex items-start justify-center text-neutral-400 hover:text-white rounded-full hover:bg-white/5 transition"
          aria-label="More"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('for-you');
  const [submitOpen, setSubmitOpen] = useState(false);
  const [floorRoute, setFloorRoute] = useState<FloorRoute>(getFloorRoute());

  useEffect(() => {
    const onHash = () => setFloorRoute(getFloorRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigateFloor = (page: string) => {
    if (page === 'home') {
      window.location.hash = '';
      setFloorRoute(null);
      return;
    }
    window.location.hash = page;
    setFloorRoute(page as FloorRoute);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  if (floorRoute === 'listing') return <ListingJourney onNavigate={navigateFloor} />;
  if (floorRoute === 'dashboard') return <SellerDashboard onNavigate={navigateFloor} />;
  if (floorRoute === 'floor-item') return <FloorMarketItem onNavigate={navigateFloor} />;

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
      {!detailItem && <Navbar onOpenSubmit={() => setSubmitOpen(true)} />}

      <div className={`flex flex-1 ${detailItem ? '' : 'pt-14'} pb-14 md:pb-0`}>
        <Sidebar activeView={activeView} onSelect={handleSelectView} onChannelClick={handleSelectChannel} />

        <main className="flex-1 md:ml-[240px] overflow-y-auto min-h-screen no-scrollbar bg-[#050505]">
          {selectedChannel ? (
            <AuctioneerProfile channel={selectedChannel} onBack={() => setSelectedChannelId(null)} />
          ) : detailItem ? (
            <ItemDetailPage item={detailItem} onBack={() => setSelectedItemId(null)} variant={activeView === 'floor-market' ? 'floor-setting' : 'auction'} />
          ) : (
            <>
              <CategoryPills />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 md:gap-y-8 px-0 md:px-6 pt-1 pb-12 md:pt-3 md:pb-20">
                {AUCTION_ITEMS.map((item) => (
                  <AuctionCard key={item.id} item={item} variant={activeView === 'floor-market' ? 'floor-market' : 'default'} onClick={() => handleSelectItem(item.id)} onChannelClick={handleSelectChannel} />
                ))}
                {AUCTION_ITEMS.map((item) => (
                  <AuctionCard key={`${item.id}-dup`} item={item} variant={activeView === 'floor-market' ? 'floor-market' : 'default'} onClick={() => handleSelectItem(item.id)} onChannelClick={handleSelectChannel} />
                ))}
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
