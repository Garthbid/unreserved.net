export interface AuctionItem {
  id: string;
  title: string;
  category: string;
  year: number;
  make: string;
  model: string;
  location: string;
  price?: number;
  currentBid?: number;
  saleDate?: string;
  auctionSource: string;
  imageUrl: string;
  status: 'sold' | 'live' | 'upcoming';
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
