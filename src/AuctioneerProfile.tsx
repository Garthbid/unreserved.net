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

const LiveAuctionCard: React.FC<{ item: AuctionItem; fixedWidth?: boolean }> = ({ item, fixedWidth = false }) => {
  return (
    <div className={`flex flex-col gap-3 group cursor-pointer ${fixedWidth ? 'w-[280px] md:w-[320px] shrink-0' : ''}`}>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          Live
        </span>
        <span className="absolute bottom-2 right-2 bg-black/85 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {item.endTime}
        </span>
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        <h3 className="text-[15px] font-semibold text-white leading-snug line-clamp-2">
          {item.title}
        </h3>
        <div className="text-sm text-neutral-400 leading-tight">
          ${item.currentBid.toLocaleString()} · {item.location} · {item.bids} bids
        </div>
      </div>
    </div>
  );
};

const RowAuctionCard: React.FC<{ item: AuctionItem }> = ({ item }) => (
  <div className="flex gap-3 group cursor-pointer">
    <div className="relative w-40 md:w-48 aspect-video rounded-lg overflow-hidden bg-neutral-900 shrink-0">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
        {item.endTime}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-sm md:text-base font-semibold text-white leading-snug line-clamp-2">
        {item.title}
      </h3>
      <div className="text-xs md:text-sm text-neutral-400 mt-1 leading-tight">
        ${item.currentBid.toLocaleString()} · {item.bids} bids
      </div>
      <div className="text-xs md:text-sm text-neutral-400 leading-tight">
        {item.location}
      </div>
    </div>
    <button
      type="button"
      onClick={(e) => e.stopPropagation()}
      className="shrink-0 w-7 h-7 -mr-1 flex items-start justify-center text-neutral-400 hover:text-white"
      aria-label="More"
    >
      ⋮
    </button>
  </div>
);

const PreviousSaleCard: React.FC<{ sale: PreviousSale }> = ({ sale }) => {
  return (
    <div className="flex flex-col gap-3 group cursor-pointer">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900">
        <img
          src={sale.image}
          alt={sale.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
          Sold
        </span>
        <span className="absolute bottom-2 right-2 bg-black/85 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          ${sale.hammerPrice.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        <h3 className="text-[15px] font-semibold text-white leading-snug line-clamp-2">
          {sale.title}
        </h3>
        <div className="text-sm text-neutral-400 leading-tight">
          {sale.buyerLocation} · {sale.bidCount} bids · {sale.soldDate}
        </div>
      </div>
    </div>
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
      <div className="md:px-6 md:pt-4">
        <div className="relative aspect-[16/5] md:rounded-2xl overflow-hidden bg-neutral-900">
          <button
            onClick={onBack}
            className="absolute top-3 left-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 flex items-center justify-center text-white transition z-10"
            aria-label="Back"
          >
            ←
          </button>
          <img
            src="/auction-pics/d531d62f-4871-4f28-b4ea-73f680221eb8.jpeg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Profile header */}
      <div className="px-4 md:px-6 pt-5 md:pt-6">
        <div className="flex items-start gap-4 md:gap-5">
          {/* Avatar */}
          <img
            src={channel.avatar}
            alt={channel.name}
            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shrink-0 bg-neutral-800"
          />

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">{channel.name}</h1>
              <BadgeCheck size={18} className="text-neutral-400 shrink-0" />
            </div>
            <div className="text-sm text-neutral-400 mt-1">
              @{channel.name.toLowerCase().replace(/\s+/g, '')}
            </div>
            <div className="text-sm text-neutral-400 mt-0.5">
              {channel.followers} followers · {PREVIOUS_SALES.length + liveItems.length} auctions
            </div>
          </div>
        </div>

        <p className="text-sm text-neutral-300 leading-snug mt-4 line-clamp-2 md:line-clamp-none md:max-w-2xl">
          Unreserved specialists in {channel.specialty.toLowerCase()}. Independent third-party inspections, transparent reports, no reserve, no buyer fees. <span className="text-white font-semibold hover:underline cursor-pointer">...more</span>
        </p>

        <button
          onClick={() => setFollowing(!following)}
          className={`mt-4 w-full md:w-auto h-10 px-6 rounded-full font-semibold text-sm transition ${
            following
              ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
              : 'bg-white hover:bg-white/90 text-black'
          }`}
        >
          {following ? 'Following' : 'Subscribe'}
        </button>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-black border-b border-white/10 mt-5 md:mt-6">
        <div className="px-4 md:px-6 flex items-center gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative h-12 text-sm whitespace-nowrap transition ${
                tab === t.key ? 'text-white font-bold' : 'text-neutral-400 hover:text-white font-medium'
              }`}
            >
              {t.label}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
            </button>
          ))}
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
              <div className="flex flex-col gap-4">
                {allLiveSpread.map((item) => (
                  <RowAuctionCard key={`row-${item.id}`} item={item} />
                ))}
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

