import React, { useState } from 'react';
import { BadgeCheck, Search, Star, ShieldCheck, Zap, MapPin, Calendar, CreditCard, Banknote, Wallet, FileCheck2, Truck, Clock, Eye, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AUCTION_ITEMS, CHANNELS, AuctionChannel, AuctionItem } from './constants';

type Tab = 'live' | 'reviews' | 'previous' | 'payment';

interface PreviousSale {
  id: string;
  title: string;
  image: string;
  hammerPrice: number;
  marketValue: number;
  soldDate: string;
  buyerLocation: string;
  bidCount: number;
}

interface Review {
  id: string;
  reviewer: string;
  avatarSeed: string;
  rating: number;
  date: string;
  itemTitle: string;
  body: string;
  verifiedBuyer: boolean;
}

const PREVIOUS_SALES: PreviousSale[] = [
  {
    id: 'p1',
    title: '2019 Kenworth T880 Dump Truck',
    image: '/auction-pics/0bb30942-605a-4a2d-9b19-8fa92b2f3ffb.jpeg',
    hammerPrice: 138500,
    marketValue: 145000,
    soldDate: '12 days ago',
    buyerLocation: 'Saskatoon, SK',
    bidCount: 47,
  },
  {
    id: 'p2',
    title: 'Bobcat S770 Skid Steer Loader',
    image: '/auction-pics/d531d62f-4871-4f28-b4ea-73f680221eb8.jpeg',
    hammerPrice: 38900,
    marketValue: 42000,
    soldDate: '3 weeks ago',
    buyerLocation: 'Lloydminster, AB',
    bidCount: 62,
  },
  {
    id: 'p3',
    title: '2017 John Deere 644K Wheel Loader',
    image: '/auction-pics/e371f0a9-c035-4d36-8123-94d1bcba5627.jpeg',
    hammerPrice: 187200,
    marketValue: 195000,
    soldDate: '1 month ago',
    buyerLocation: 'Grande Prairie, AB',
    bidCount: 31,
  },
  {
    id: 'p4',
    title: 'Custom 40ft Lowboy Trailer',
    image: '/auction-pics/56aced56-89f1-4449-b1d7-ee75a717ae9c.jpeg',
    hammerPrice: 24400,
    marketValue: 28000,
    soldDate: '1 month ago',
    buyerLocation: 'Calgary, AB',
    bidCount: 28,
  },
  {
    id: 'p5',
    title: '2020 Ford F-550 Service Truck',
    image: '/auction-pics/93dbc8db-7158-49a7-b341-47d88938dd1c.jpeg',
    hammerPrice: 71500,
    marketValue: 78000,
    soldDate: '6 weeks ago',
    buyerLocation: 'Red Deer, AB',
    bidCount: 53,
  },
  {
    id: 'p6',
    title: 'Industrial Shop Real Estate',
    image: '/auction-pics/fde60690-64d3-47a9-b729-712fbd199340.jpeg',
    hammerPrice: 940000,
    marketValue: 985000,
    soldDate: '2 months ago',
    buyerLocation: 'Edmonton, AB',
    bidCount: 19,
  },
];

const REVIEWS: Review[] = [
  {
    id: 'r1',
    reviewer: 'Daniel R.',
    avatarSeed: 'DR',
    rating: 5,
    date: '4 days ago',
    itemTitle: 'CAT 972K Wheel Loader',
    body: 'Walkaround video was honest down to the last hour-meter. Loader arrived clean, no surprises. Inspection report matched the unit perfectly. Would absolutely buy from Garthbid again.',
    verifiedBuyer: true,
  },
  {
    id: 'r2',
    reviewer: 'Marissa T.',
    avatarSeed: 'MT',
    rating: 5,
    date: '2 weeks ago',
    itemTitle: '2019 Kenworth T880',
    body: 'Smooth process from bid to title transfer. Garthbid handled the logistics referral and the truck was on my yard inside a week. Communication was top notch.',
    verifiedBuyer: true,
  },
  {
    id: 'r3',
    reviewer: 'Kyle B.',
    avatarSeed: 'KB',
    rating: 4,
    date: '3 weeks ago',
    itemTitle: 'Bobcat S770',
    body: 'Solid unit, accurate listing. Minor hydraulic seep that was disclosed in the report — repair was minor. Knocked one star only because pickup scheduling took a couple back-and-forths.',
    verifiedBuyer: true,
  },
  {
    id: 'r4',
    reviewer: 'Elena P.',
    avatarSeed: 'EP',
    rating: 5,
    date: '1 month ago',
    itemTitle: 'John Deere 644K',
    body: 'Bought sight unseen on the strength of the inspection report. Machine was every bit as described. The Garthbid team even followed up after delivery to make sure I was happy.',
    verifiedBuyer: true,
  },
  {
    id: 'r5',
    reviewer: 'Trevor M.',
    avatarSeed: 'TM',
    rating: 5,
    date: '1 month ago',
    itemTitle: 'Custom Lowboy Trailer',
    body: 'Unreserved means unreserved. No reserve games, no shill bidding. Won at a real-market price and the trailer was beautifully built. Garthbid is the gold standard for unreserved.',
    verifiedBuyer: true,
  },
  {
    id: 'r6',
    reviewer: 'Aaron S.',
    avatarSeed: 'AS',
    rating: 4,
    date: '6 weeks ago',
    itemTitle: 'Ford F-550 Service Truck',
    body: 'Good experience overall. Truck matched the photos and the title was clean. Recommend.',
    verifiedBuyer: true,
  },
];

const Stars = ({ rating, size = 12 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-white/15'}
        strokeWidth={1.5}
      />
    ))}
  </div>
);

const LiveAuctionCard: React.FC<{ item: AuctionItem }> = ({ item }) => {
  const discount = Math.round((1 - item.currentBid / item.marketValue) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col gap-2 group cursor-pointer w-[280px] md:w-[320px] shrink-0"
    >
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-xl transition-all duration-300 group-hover:border-white/10">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-red-600 px-2 py-1 rounded-md">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white italic">Live</span>
        </div>

        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xl border border-white/10 px-2 py-1 rounded-md flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-black italic tracking-tight text-red-400">{item.endTime}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        <h3 className="font-black text-[13px] text-white leading-tight tracking-tight uppercase italic line-clamp-2 group-hover:text-green-500 transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500 italic">
          <span>{item.location}</span>
          <span className="opacity-30">·</span>
          <span>{item.bids} bids</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-black text-white italic tracking-tighter">${item.currentBid.toLocaleString()}</span>
          <span className="text-[9px] font-black text-green-600">-{discount}% MARKET</span>
        </div>
      </div>
    </motion.div>
  );
};

const PreviousSaleCard: React.FC<{ sale: PreviousSale }> = ({ sale }) => {
  const savings = sale.marketValue - sale.hammerPrice;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col gap-2 group cursor-pointer"
    >
      <div className="relative aspect-[16/9.5] rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-xl">
        <img
          src={sale.image}
          alt={sale.title}
          className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110 grayscale-[0.1]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

        <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xl border border-white/10 px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <FileCheck2 size={10} className="text-green-400" />
          <span className="text-[10px] font-black uppercase tracking-tight text-green-400 italic">Sold</span>
        </div>

        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-2 py-1 rounded-md">
            <span className="text-[8px] font-black uppercase tracking-[0.15em] text-gray-500 italic">Hammer</span>
            <div className="text-[14px] font-black text-white italic tracking-tighter leading-none">${sale.hammerPrice.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        <h3 className="font-black text-[13px] text-white leading-tight tracking-tight uppercase italic line-clamp-1 group-hover:text-green-500 transition-colors">
          {sale.title}
        </h3>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500 italic">
          <span>{sale.soldDate}</span>
          <span className="opacity-30">·</span>
          <span>{sale.bidCount} bids</span>
          <span className="opacity-30">·</span>
          <span>{sale.buyerLocation}</span>
        </div>
        <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-white/5">
          <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.15em] italic">Market ${sale.marketValue.toLocaleString()}</span>
          <span className="text-[10px] font-black text-green-500 italic">Saved ${savings.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div className="flex gap-3 py-5 border-b border-white/5">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center shrink-0">
      <span className="text-[11px] font-black text-white tracking-tight">{review.avatarSeed}</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[12px] font-black text-white tracking-tight">{review.reviewer}</span>
        {review.verifiedBuyer && (
          <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded">
            <ShieldCheck size={9} className="text-green-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.15em] text-green-400 italic">Verified Buyer</span>
          </span>
        )}
        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">{review.date}</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <Stars rating={review.rating} />
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">on {review.itemTitle}</span>
      </div>
      <p className="text-[12px] text-gray-300 leading-relaxed mt-2 font-medium">{review.body}</p>
    </div>
  </div>
);

const PaymentRow = ({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: boolean }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-white/5">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-center">
        <Icon size={14} className="text-gray-400" />
      </div>
      <span className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 italic">{label}</span>
    </div>
    <span className={`text-[12px] font-black tracking-tight italic ${accent ? 'text-green-400' : 'text-white'}`}>{value}</span>
  </div>
);

export const AuctioneerProfile = ({ channel, onBack }: { channel: AuctionChannel; onBack: () => void }) => {
  const [tab, setTab] = useState<Tab>('live');
  const [following, setFollowing] = useState(false);

  const liveItems = AUCTION_ITEMS.filter((i) => i.channelId === channel.id);
  const allLiveSpread = liveItems.length > 0 ? liveItems : AUCTION_ITEMS.slice(0, 4);
  const avgRating = REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length;
  const ratingDist = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: REVIEWS.filter((r) => r.rating === stars).length,
  }));
  const maxRatingCount = Math.max(...ratingDist.map((r) => r.count), 1);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'live', label: 'Live Now' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'previous', label: 'Previous Sales' },
    { key: 'payment', label: 'Payment Details' },
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Banner */}
      <div className="px-3 md:px-6 pt-3 md:pt-6">
        <div className="relative h-32 md:h-48 lg:h-56 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5">
          <img
            src="/auction-pics/d531d62f-4871-4f28-b4ea-73f680221eb8.jpeg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <button
            onClick={onBack}
            className="absolute top-3 left-3 bg-black/70 hover:bg-black border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white italic transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Profile header */}
      <div className="px-3 md:px-6 pt-6 md:pt-8">
        <div className="flex flex-col md:flex-row gap-5 md:gap-8 md:items-end">
          {/* Avatar */}
          <div className="relative shrink-0 -mt-12 md:-mt-20 md:ml-4">
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-black bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-2xl">
              <span className="text-3xl md:text-5xl font-black text-black tracking-tighter italic">{channel.name.charAt(0)}</span>
            </div>
            <div className="absolute bottom-1 right-1 w-7 h-7 md:w-9 md:h-9 bg-green-500 rounded-full ring-4 ring-black flex items-center justify-center">
              <BadgeCheck size={14} className="text-black" strokeWidth={3} />
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic">{channel.name}</h1>
              <BadgeCheck size={20} className="text-green-500 shrink-0" />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
              <span>@{channel.name.toLowerCase().replace(/\s+/g, '')}</span>
              <span className="opacity-30">·</span>
              <span>{channel.followers} followers</span>
              <span className="opacity-30">·</span>
              <span>{PREVIOUS_SALES.length + liveItems.length} auctions</span>
              <span className="opacity-30">·</span>
              <span className="text-green-400">{channel.sellThroughRate} sell-through</span>
            </div>

            <p className="text-[12px] md:text-sm text-gray-400 font-medium max-w-2xl">
              Unreserved specialists in {channel.specialty.toLowerCase()}. Independent third-party inspections, transparent reports, no reserve, no buyer fees. <span className="text-white hover:underline cursor-pointer">...more</span>
            </p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <button
                onClick={() => setFollowing(!following)}
                className={`px-5 h-9 rounded-full font-black text-[11px] uppercase tracking-widest italic transition-all ${
                  following
                    ? 'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10'
                    : 'bg-white text-black hover:bg-white/90 shadow-[0_0_24px_rgba(255,255,255,0.15)]'
                }`}
              >
                {following ? '✓ Following' : 'Follow'}
              </button>
              <button className="px-5 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-black text-[11px] uppercase tracking-widest italic transition-all">
                Message
              </button>
              <button className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white flex items-center justify-center transition-all">
                <Bell size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-white/10 mt-6 md:mt-8">
        <div className="px-3 md:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative h-12 px-4 text-[11px] font-black uppercase tracking-widest italic whitespace-nowrap transition-colors ${
                tab === t.key ? 'text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              {t.label}
              {tab === t.key && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-white rounded-full" />}
            </button>
          ))}
          <button className="ml-auto w-9 h-9 rounded-full hover:bg-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white transition-colors">
            <Search size={14} />
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="px-3 md:px-6 py-6 md:py-8 pb-20">
        <AnimatePresence mode="wait">
          {tab === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {/* Featured live row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight italic uppercase">For You</h2>
                </div>
                <button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest italic">View All →</button>
              </div>

              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-3 md:-mx-6 px-3 md:px-6">
                {allLiveSpread.map((item) => (
                  <LiveAuctionCard key={item.id} item={item} />
                ))}
              </div>

              {/* Live grid */}
              <div className="mt-10">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={16} className="text-green-500" />
                  <h2 className="text-base md:text-lg font-black text-white tracking-tight italic uppercase">All Live Auctions</h2>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">({allLiveSpread.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                  {allLiveSpread.map((item) => (
                    <LiveAuctionCard key={`grid-${item.id}`} item={item} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8"
            >
              {/* Rating summary */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 h-fit">
                <div className="text-center pb-4 border-b border-white/5">
                  <div className="text-5xl font-black text-white italic tracking-tighter">{avgRating.toFixed(1)}</div>
                  <div className="mt-2 flex justify-center">
                    <Stars rating={avgRating} size={16} />
                  </div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic mt-2">
                    {REVIEWS.length} verified reviews
                  </div>
                </div>
                <div className="space-y-2 pt-4">
                  {ratingDist.map((r) => (
                    <div key={r.stars} className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-gray-500 w-3 italic">{r.stars}</span>
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${(r.count / maxRatingCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-gray-500 w-4 text-right italic">{r.count}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-base font-black text-white italic">{channel.sellThroughRate}</div>
                    <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic mt-1">Sell-Through</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-green-400 italic">100%</div>
                    <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic mt-1">Title Clean</div>
                  </div>
                </div>
              </div>

              {/* Review list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg md:text-xl font-black text-white tracking-tight italic uppercase">Buyer Reviews</h2>
                  <button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest italic">Most Recent ▾</button>
                </div>
                <div>
                  {REVIEWS.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'previous' && (
            <motion.div
              key="previous"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileCheck2 size={16} className="text-green-500" />
                  <h2 className="text-lg md:text-xl font-black text-white tracking-tight italic uppercase">Previous Sales</h2>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">({PREVIOUS_SALES.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-[10px] font-black text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest italic">All</button>
                  <button className="text-[10px] font-black text-gray-500 hover:text-white bg-transparent hover:bg-white/[0.06] border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest italic">This Year</button>
                  <button className="text-[10px] font-black text-gray-500 hover:text-white bg-transparent hover:bg-white/[0.06] border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest italic">Last 90 Days</button>
                </div>
              </div>

              {/* Headline stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                {[
                  { label: 'Lifetime Sales', value: `$${(PREVIOUS_SALES.reduce((a, s) => a + s.hammerPrice, 0) / 1_000_000).toFixed(2)}M` },
                  { label: 'Lots Sold', value: PREVIOUS_SALES.length.toString() },
                  { label: 'Avg. Bids / Lot', value: Math.round(PREVIOUS_SALES.reduce((a, s) => a + s.bidCount, 0) / PREVIOUS_SALES.length).toString() },
                  { label: 'Avg. vs Market', value: `${Math.round((PREVIOUS_SALES.reduce((a, s) => a + s.hammerPrice / s.marketValue, 0) / PREVIOUS_SALES.length) * 100)}%` },
                ].map((s) => (
                  <div key={s.label} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 md:p-4">
                    <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic mb-1">{s.label}</div>
                    <div className="text-lg md:text-2xl font-black text-white italic tracking-tighter">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                {PREVIOUS_SALES.map((sale) => (
                  <PreviousSaleCard key={sale.id} sale={sale} />
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 md:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard size={16} className="text-green-500" />
                  <h2 className="text-base font-black text-white tracking-tight italic uppercase">Accepted Payment Methods</h2>
                </div>
                <PaymentRow icon={Banknote} label="Wire Transfer" value="Preferred" accent />
                <PaymentRow icon={Wallet} label="Certified Cheque" value="Accepted" />
                <PaymentRow icon={CreditCard} label="Credit Card" value="Up to $25,000" />
                <PaymentRow icon={ShieldCheck} label="Unreserved Escrow" value="Available" accent />
                <PaymentRow icon={Banknote} label="Financing Partners" value="3 partners" />
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 md:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <FileCheck2 size={16} className="text-green-500" />
                  <h2 className="text-base font-black text-white tracking-tight italic uppercase">Fees & Terms</h2>
                </div>
                <PaymentRow icon={Banknote} label="Buyer Fee" value="$0" accent />
                <PaymentRow icon={Wallet} label="Seller Commission" value="6.0%" />
                <PaymentRow icon={Clock} label="Settlement Window" value="48 hours" />
                <PaymentRow icon={CreditCard} label="Deposit Required" value="10% on win" />
                <PaymentRow icon={ShieldCheck} label="Refund Policy" value="48hr inspection" />
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 md:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Truck size={16} className="text-green-500" />
                  <h2 className="text-base font-black text-white tracking-tight italic uppercase">Logistics & Pickup</h2>
                </div>
                <PaymentRow icon={MapPin} label="Pickup Location" value="Edmonton, AB" />
                <PaymentRow icon={Truck} label="Shipping Partners" value="Uship · Roadrunner" />
                <PaymentRow icon={Calendar} label="Pickup Window" value="14 days post-sale" />
                <PaymentRow icon={Eye} label="Pre-Inspection" value="By appointment" />
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 md:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <ShieldCheck size={16} className="text-green-500" />
                  <h2 className="text-base font-black text-white tracking-tight italic uppercase">Trust & Guarantees</h2>
                </div>
                <PaymentRow icon={ShieldCheck} label="Title Guarantee" value="Clean & lien-free" accent />
                <PaymentRow icon={FileCheck2} label="Inspection Report" value="3rd-party verified" />
                <PaymentRow icon={Eye} label="Walkaround Video" value="Required on all lots" />
                <PaymentRow icon={Calendar} label="Member Since" value="March 2022" />
                <PaymentRow icon={Star} label="Trust Score" value={`${channel.trustScore} / 5.0`} accent />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

