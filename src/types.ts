export type EditorialBadge =
  | 'Editor Pick'
  | 'Strong Buy'
  | 'Under Market'
  | 'Ending Soon'
  | 'Native Listing'
  | 'High Trust'
  | 'Needs Caution'
  | 'Low Info'
  | 'Hidden Gem'
  | 'Cinematic Feature';

export type ListingType =
  | 'native'
  | 'curated_external'
  | 'source_auction'
  | 'cinematic_feature';

export type EditorialSection =
  | 'editor_picks'
  | 'best_under_market'
  | 'native_listings'
  | 'cinematic_features'
  | 'needs_caution'
  | 'hidden_gems';

export interface ComparableSale {
  title: string;
  date: string; // ISO or display string
  location?: string;
  price: number;
  source?: string;
}

export interface PublicQuestion {
  question: string;
  askedBy: string;
  askedAt: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
}

export interface Comment {
  author: string;
  postedAt: string;
  body: string;
  likes?: number;
}

export interface AuctionItem {
  id: string;
  title: string;
  category: string;
  year: number;
  make: string;
  model: string;
  vin?: string;
  drivetrain?: string;
  engine?: string;
  kms?: number;
  location: string;
  price?: number;
  currentBid?: number;
  saleDate?: string;
  auctionSource: string;
  imageUrl: string;
  imageUrls?: string[];
  status: 'sold' | 'live' | 'upcoming';
  winningBidder?: string;
  sellerName?: string;
  sellerStory?: string;
  keyFeatures?: string[];
  endTime?: string;
  timeLeft?: string;
  views?: number;
  // Intelligence fields
  fairValueRange?: [number, number];
  recommendedMaxBid?: number;
  buyerEdgeScore?: 'Strong Buy' | 'Moderate Edge' | 'Fair Market' | 'Risky Buy';
  confidenceScore?: number; // 0-100
  riskFlags?: string[];
  isNative?: boolean; // True if listed directly on Unreserved.net
  sourceUrl?: string; // Original listing URL (for price matching)
  // Source panel fields
  sourceSlug?: string;
  sourceLogoUrl?: string;
  sourceByline?: string;
  sourceDescription?: string;
  currency?: 'CAD' | 'USD';
  // Editorial fields (Unreserved.net curation layer)
  editorialBadge?: EditorialBadge;
  whyWatch?: string; // one-line editorial reason
  confidence?: 1 | 2 | 3 | 4 | 5; // 5-point intel confidence
  editorialSections?: EditorialSection[]; // home-page placement
  listingType?: ListingType; // native | curated_external | source_auction | cinematic_feature
  // Detail-page editorial copy
  whyWatching?: string; // long-form "Why It Made the Front Page"
  whatToKnow?: string[]; // bullet summary
  knownIssues?: string; // buyer caution paragraph
  cautionFlags?: string[]; // small badges next to the buyer-caution heading
  // Native + cinematic extras
  cinematicVideoUrl?: string;
  cinematicPosterUrl?: string;
  cinematicTagline?: string; // short editorial pitch for the cinematic card
  sellerNotes?: string;
  comparableSales?: ComparableSale[];
  publicQA?: PublicQuestion[];
  auctionTerms?: string[];
  comments?: Comment[];
}

export interface IntelligenceReport {
  averagePrice: number;
  lowPrice: number;
  highPrice: number;
  trendData: { date: string; price: number }[];
  comparableSales: AuctionItem[];
  isPremium: boolean;
  marketInsight?: string;
}
