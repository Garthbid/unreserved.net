// Shared sample data for the Floor Market MVP flow.

export const VEHICLE = {
  id: 'f150-lariat-2012',
  title: '2012 Ford F-150 Lariat EcoBoost',
  year: 2012,
  make: 'Ford',
  model: 'F-150',
  trim: 'Lariat EcoBoost',
  vin: '1FTFW1ET5CFB12345',
  mileage: 186000,
  location: 'Calgary, AB',
  drivetrain: '4x4',
  engine: '3.5L EcoBoost V6',
  transmission: '6-Speed Automatic',
  ownership: 'Owned outright (lien check pending)',
  seller: 'Justin Rogers',
  sellerStatus: 'Verified Seller',
  sellerAuctions: 12,
  aiEstimateLow: 22300,
  aiEstimateHigh: 26800,
  currentTopFloor: 21800,
  views: 1860,
  status: 'Floor Market Active' as const,
  offerExpiry: '41:52',
  trustScore: 64,
  trustScorePotential: 86,
  floorSettersWatching: 7,
  image:
    'https://images.unsplash.com/photo-1605893477799-b99e3b400239?auto=format&fit=crop&w=1600&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1605893477799-b99e3b400239?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583267746897-2cf66319ef97?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1604054094723-3a949e4fca0b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1611016186353-9af58c69a533?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1568844293986-ca4c4dbe1f4c?auto=format&fit=crop&w=1200&q=80',
  ],
};

export type ImpactLevel = 'High' | 'Medium' | 'Low';

export type ListingTask = {
  id: string;
  label: string;
  requestedBy: number;
  impact: ImpactLevel;
  status: 'incomplete' | 'complete';
  category: 'photo' | 'video' | 'document' | 'answer';
};

export const LISTING_TASKS: ListingTask[] = [
  { id: 't1', label: 'Cold-start video', requestedBy: 4, impact: 'High', status: 'incomplete', category: 'video' },
  { id: 't2', label: 'Undercarriage photos', requestedBy: 3, impact: 'High', status: 'incomplete', category: 'photo' },
  { id: 't3', label: 'Lien / title proof', requestedBy: 5, impact: 'High', status: 'incomplete', category: 'document' },
  { id: 't4', label: 'Dash while running', requestedBy: 2, impact: 'Medium', status: 'incomplete', category: 'video' },
  { id: 't5', label: 'Tire tread photos', requestedBy: 1, impact: 'Medium', status: 'complete', category: 'photo' },
  { id: 't6', label: 'Walkaround video', requestedBy: 3, impact: 'High', status: 'complete', category: 'video' },
];

export type FloorBid = {
  id: string;
  user: string;
  amount: number;
  status: 'active' | 'expired' | 'conditional' | 'baseline';
  note?: string;
  expiresIn?: string;
};

export const FLOOR_HISTORY: FloorBid[] = [
  { id: 'b1', user: '@user2345', amount: 21800, status: 'active', expiresIn: '41:52' },
  { id: 'b2', user: '@prairie_trucks', amount: 20500, status: 'expired' },
  { id: 'b3', user: '@fleetbuyer', amount: 19750, status: 'conditional', note: 'Conditional on title proof' },
  { id: 'b4', user: 'Garthbid Fund', amount: 18900, status: 'baseline', note: 'Baseline floor' },
];

export type Comment = {
  id: string;
  user: string;
  badge: 'Verified Floor Setter' | 'Seller' | 'AI';
  text: string;
  ago: string;
};

export const COMMENTS: Comment[] = [
  {
    id: 'c1',
    user: '@prairie_trucks',
    badge: 'Verified Floor Setter',
    text: 'I’d consider raising to $23,000 if the seller uploads a cold-start video and shows the dash with the engine running.',
    ago: '2h ago',
  },
  {
    id: 'c2',
    user: '@yycauto',
    badge: 'Verified Floor Setter',
    text: 'Can you confirm whether there are any active warning lights? Current dash photo is too blurry.',
    ago: '3h ago',
  },
  {
    id: 'c3',
    user: 'Justin Rogers',
    badge: 'Seller',
    text: 'Cold-start video uploaded. No warning lights currently showing. I’ll upload the lien document this afternoon.',
    ago: '2h ago',
  },
  {
    id: 'c4',
    user: '@fleetbuyer',
    badge: 'Verified Floor Setter',
    text: 'Need lien status before I can bid higher. Clean title proof would materially improve this listing.',
    ago: '5h ago',
  },
  {
    id: 'c5',
    user: '@dieselbuyer',
    badge: 'Verified Floor Setter',
    text: 'Please show the underside of the cab corners and rear frame. These trucks can hide rust there.',
    ago: '6h ago',
  },
];

export type SellerListing = {
  id: string;
  title: string;
  image: string;
  status: 'Draft' | 'In Floor Market' | 'Floor Accepted' | 'Auction Live' | 'Sold';
  trustScore: number;
  topFloor: number | null;
  aiEstimateLow: number;
  aiEstimateHigh: number;
  watching: number;
  requestsPending: number;
  expiry?: string;
  cta: string;
};

export const SELLER_LISTINGS: SellerListing[] = [
  {
    id: 'f150-lariat-2012',
    title: '2012 Ford F-150 Lariat EcoBoost',
    image:
      'https://images.unsplash.com/photo-1605893477799-b99e3b400239?auto=format&fit=crop&w=900&q=80',
    status: 'In Floor Market',
    trustScore: 64,
    topFloor: 21800,
    aiEstimateLow: 22300,
    aiEstimateHigh: 26800,
    watching: 7,
    requestsPending: 4,
    expiry: '41:52',
    cta: 'Improve Listing',
  },
  {
    id: 'tacoma-2019',
    title: '2019 Toyota Tacoma TRD Off-Road',
    image:
      'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=900&q=80',
    status: 'Floor Accepted',
    trustScore: 88,
    topFloor: 34250,
    aiEstimateLow: 32800,
    aiEstimateHigh: 36400,
    watching: 11,
    requestsPending: 1,
    cta: 'Launch Auction',
  },
  {
    id: 'wrangler-2015',
    title: '2015 Jeep Wrangler Unlimited Sahara',
    image:
      'https://images.unsplash.com/photo-1612825173281-9a193378527e?auto=format&fit=crop&w=900&q=80',
    status: 'Draft',
    trustScore: 38,
    topFloor: null,
    aiEstimateLow: 18900,
    aiEstimateHigh: 22500,
    watching: 0,
    requestsPending: 0,
    cta: 'Continue Listing',
  },
];

export type Notification = {
  id: string;
  type: 'video' | 'photo' | 'question' | 'document' | 'ai';
  user: string;
  vehicle: string;
  text: string;
  impact: ImpactLevel;
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'video',
    user: '@prairie_trucks',
    vehicle: '2012 Ford F-150 Lariat',
    text: 'requested a cold-start video.',
    impact: 'High',
  },
  {
    id: 'n2',
    type: 'photo',
    user: '@dieselbuyer',
    vehicle: '2012 Ford F-150 Lariat',
    text: 'requested undercarriage photos near the rear frame.',
    impact: 'High',
  },
  {
    id: 'n3',
    type: 'question',
    user: '@yycauto',
    vehicle: '2012 Ford F-150 Lariat',
    text: 'asked if the timing chain has been replaced.',
    impact: 'Medium',
  },
  {
    id: 'n4',
    type: 'document',
    user: '@fleetbuyer',
    vehicle: '2012 Ford F-150 Lariat',
    text: 'says uploading lien proof could raise their floor offer.',
    impact: 'High',
  },
  {
    id: 'n5',
    type: 'ai',
    user: 'GarthAI',
    vehicle: '2012 Ford F-150 Lariat',
    text: 'detected the odometer photo is blurry. Retake recommended.',
    impact: 'Medium',
  },
  {
    id: 'n6',
    type: 'photo',
    user: '@truckhunter',
    vehicle: '2019 Toyota Tacoma TRD',
    text: 'requested skid plate close-ups.',
    impact: 'Low',
  },
  {
    id: 'n7',
    type: 'video',
    user: '@offroad_alex',
    vehicle: '2019 Toyota Tacoma TRD',
    text: 'requested a 4x4 engagement demo video.',
    impact: 'Medium',
  },
];
