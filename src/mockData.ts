import { AuctionItem } from './types';

// Real auction photography sourced locally from /public/auction-pics
const PIC = (file: string) => `/auction-pics/${file}`;

export const MOCK_ITEMS: AuctionItem[] = [
  {
    id: '3',
    title: '2012 Ford F-150 Lariat EcoBoost',
    category: 'Trucks',
    year: 2012,
    make: 'Ford',
    model: 'F-150 Lariat',
    vin: '1FTFW1ET0CFB12345',
    drivetrain: '4WD',
    engine: '3.5L V6 EcoBoost',
    kms: 148000,
    location: 'Calgary, AB',
    currentBid: 21800,
    endTime: '2026-05-30T20:00:00Z',
    timeLeft: '3d',
    auctionSource: 'Unreserved.net',
    imageUrl: PIC('93dbc8db-7158-49a7-b341-47d88938dd1c.jpeg'),
    imageUrls: [
      PIC('93dbc8db-7158-49a7-b341-47d88938dd1c.jpeg'),
      PIC('0bb30942-605a-4a2d-9b19-8fa92b2f3ffb.jpeg'),
      PIC('56aced56-89f1-4449-b1d7-ee75a717ae9c.jpeg'),
      PIC('d531d62f-4871-4f28-b4ea-73f680221eb8.jpeg'),
      PIC('e371f0a9-c035-4d36-8123-94d1bcba5627.jpeg'),
      PIC('fde60690-64d3-47a9-b729-712fbd199340.jpeg'),
    ],
    status: 'live',
    winningBidder: 'prairie_buyer',
    sellerName: 'Justin Rogers',
    sellerStory: 'I bought this Lariat new in 2012 off the lot in Red Deer and it has been with me through everything since — three moves, two ranch jobs, and the better part of a decade hauling hay, towing the family travel trailer, and getting the kids to hockey in every snowstorm Alberta could throw at it. The EcoBoost has been bulletproof. I changed the oil every 8,000 km on full synthetic, kept all the receipts, and never let a coffee touch the leather. Last year I added new Motorcraft plugs and coils, fresh brakes up front, and a set of Michelin Defenders that still have plenty of life. The reason I am letting her go is simple — I just picked up a half-ton diesel and I cannot justify keeping both. This truck deserves an owner who will use it the way it was meant to be used. If you have any questions at all, I am happy to walk you through the service file and meet you in person to inspect it.',
    keyFeatures: [
      'Heated Seats',
      'Air Conditioning',
      'Power Windows',
      'Alloy Rims',
      'Brand New Tires',
    ],
    views: 1860,
    fairValueRange: [24000, 29000],
    recommendedMaxBid: 27500,
    buyerEdgeScore: 'Strong Buy',
    confidenceScore: 94,
    isNative: true,
    sourceSlug: 'unreserved',
    sourceByline: 'Zero-fee marketplace for unreserved auctions',
    sourceDescription: 'Unreserved.net is a next-generation auction platform with zero buyer fees, transparent pricing, and real-time market intelligence on every listing.',
    currency: 'CAD',
    editorialBadge: 'Cinematic Feature',
    whyWatch: 'Native Lariat with EcoBoost, full walkaround on file, and a clean Alberta title — bidding under market.',
    confidence: 5,
    editorialSections: ['native_listings', 'editor_picks', 'best_under_market', 'cinematic_features'],
    listingType: 'cinematic_feature',
    cinematicTagline: 'A clean Alberta-spec Lariat — captured around the working ranch.',
    cinematicPosterUrl: PIC('93dbc8db-7158-49a7-b341-47d88938dd1c.jpeg'),
    whyWatching: 'This 2012 Ford F-150 Lariat EcoBoost made the front page because it is a native unreserved listing with verified seller notes, a clean presentation, strong buyer demand, and a current bid below comparable market value. We also produced a cinematic walkaround film for this listing.',
    whatToKnow: [
      'Native Unreserved.net listing — fully reviewed pre-launch',
      '3.5L EcoBoost, Lariat trim, leather, sunroof',
      'Cinematic feature: walkaround film + service file on record',
      'Current bid $21,800 CAD vs. $24–29K fair-value band',
      'Verified seller, clean Alberta title, full service history'
    ],
    knownIssues: 'No material concerns flagged. EcoBoost cam phasers and intercooler condensation are standard cohort watch-points; both inspected and noted as healthy.',
    sellerNotes: 'Original owner since new. Trailered ~2,400 lb seasonally, no commercial use. Recent: spark plugs + ignition coils (Motorcraft, 6,000 km ago), brake pads + rotors (front, 4,000 km ago), oil + filter every 8,000 km on full synthetic. Selling to consolidate to a single half-ton.',
    comparableSales: [
      { title: '2012 Ford F-150 Lariat EcoBoost — 142K km', date: '2026-04-12', location: 'Edmonton, AB', price: 26800, source: 'Unreserved.net' },
      { title: '2013 Ford F-150 Lariat EcoBoost — 168K km', date: '2026-03-29', location: 'Saskatoon, SK', price: 24500, source: 'Manheim' },
      { title: '2012 Ford F-150 XLT EcoBoost — 158K km', date: '2026-03-08', location: 'Calgary, AB', price: 22300, source: 'Adesa' }
    ],
    publicQA: [
      { question: 'Any rust on the frame or rockers?', askedBy: 'prairie_buyer', askedAt: '3 days ago', answer: 'No structural rust. Surface flash on a couple of underbody bolts only — visible in photos #14–17.', answeredBy: 'Seller', answeredAt: '3 days ago' },
      { question: 'Cam phaser noise on cold start?', askedBy: 'ecoboost_owner', askedAt: '1 day ago', answer: 'No. Last service noted phasers are within tolerance.', answeredBy: 'Seller', answeredAt: '1 day ago' }
    ],
    auctionTerms: [
      'Bidding closes at the time displayed; auto-extends 2 minutes for any bid in the final 2 minutes.',
      'Buyer pays Alberta provincial taxes on the hammer price.',
      'No buyer fee. Zero commission to Unreserved.net buyers.',
      'Vehicle must be picked up or shipping arranged within 10 days of close.',
      'Inspection by buyer at seller\'s residence by appointment.'
    ],
    comments: [
      { author: 'ecoboost_owner', postedAt: '2h ago', body: 'Beautiful truck. Are the original tow hooks still on it?', likes: 4 },
      { author: 'prairie_buyer', postedAt: '5h ago', body: 'Service file looks legit. Glad to see synthetic every 8K, that EcoBoost will thank you.', likes: 12 },
      { author: 'mountain_rev', postedAt: '1d ago', body: 'Watched it since launch — clean ad, clean photos. Bidding tonight.', likes: 7 },
      { author: 'redneck_ranch', postedAt: '2d ago', body: 'Color is sharp. Lariat with the EcoBoost is the move, especially with documented history like this.', likes: 3 }
    ]
  }
];

export const TREND_DATA = [
  { date: 'Oct', price: 340000 },
  { date: 'Nov', price: 355000 },
  { date: 'Dec', price: 348000 },
  { date: 'Jan', price: 370000 },
  { date: 'Feb', price: 385000 },
  { date: 'Mar', price: 392000 },
];
