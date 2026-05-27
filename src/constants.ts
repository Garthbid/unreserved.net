import { Home, PlaySquare, Clock, User, History, ThumbsUp, ChevronDown, Menu, Search, Mic, PlusSquare, Bell, MoreVertical, LayoutGrid, Gavel, Heart, Award, CreditCard, Settings, HelpCircle, MessageSquare } from 'lucide-react';

export const CATEGORIES = [
  "All", "Cars", "Trucks", "Equipment", "Trailers", "Farm", "Ending Soon", "Under Market", "Native Listings"
];

export interface AuctionChannel {
  id: string;
  name: string;
  avatar: string;
  followers: string;
  trustScore: number;
  sellThroughRate: string;
  specialty: string;
}

export const CHANNELS: AuctionChannel[] = [
  {
    id: 'c1',
    name: 'Garthbid',
    avatar: 'https://i.pravatar.cc/120?u=garthbid',
    followers: '12.4k',
    trustScore: 4.8,
    sellThroughRate: '94%',
    specialty: 'Heavy Equipment'
  },
  {
    id: 'c2',
    name: 'Classic Garage',
    avatar: 'https://i.pravatar.cc/120?u=classic-garage',
    followers: '45k',
    trustScore: 4.9,
    sellThroughRate: '88%',
    specialty: 'American Muscle'
  },
  {
    id: 'c3',
    name: 'Vanguard Equipment',
    avatar: 'https://i.pravatar.cc/120?u=vanguard-equipment',
    followers: '8.2k',
    trustScore: 4.7,
    sellThroughRate: '91%',
    specialty: 'Industrial'
  },
  {
    id: 'c4',
    name: 'Farm Sale Network',
    avatar: 'https://i.pravatar.cc/120?u=farm-sale-network',
    followers: '21k',
    trustScore: 4.6,
    sellThroughRate: '96%',
    specialty: 'Agricultural'
  }
];

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  marketValue: number;
  endTime: string;
  image: string;
  channelId: string;
  bids: number;
  priceScore: number;
  trustScore: number;
  watchHeat: number;
  isNative: boolean;
  isEditorial: boolean;
  isCinematic: boolean;
  whyWatch: string;
  location: string;
}

export const AUCTION_ITEMS: AuctionItem[] = [
  {
    id: '1',
    title: '2022 Ford F-150 Lightning Lariat',
    description: 'Near-mint electric truck with custom racks and verified service history.',
    currentBid: 42500,
    marketValue: 48000,
    endTime: '2h 15m',
    image: '/auction-pics/93dbc8db-7158-49a7-b341-47d88938dd1c.jpeg',
    channelId: 'c2',
    bids: 24,
    priceScore: 88,
    trustScore: 4.9,
    watchHeat: 1240,
    isNative: true,
    isEditorial: true,
    isCinematic: false,
    whyWatch: 'Verified walkaround, strong demand, and current bid matches local auction lows.',
    location: 'Edmonton, AB'
  },
  {
    id: '2',
    title: 'Caterpillar 972K Wheel Loader',
    description: 'Ex-municipal unit, 4,200 hours, regular maintenance, multi-purpose bucket.',
    currentBid: 44784,
    marketValue: 62000,
    endTime: '45m 12s',
    image: '/auction-pics/d531d62f-4871-4f28-b4ea-73f680221eb8.jpeg',
    channelId: 'c1',
    bids: 56,
    priceScore: 92,
    trustScore: 4.8,
    watchHeat: 856,
    isNative: false,
    isEditorial: true,
    isCinematic: true,
    whyWatch: 'High-tier industrial unit at a distinct discount. Municipal fleet maintenance is a major trust factor.',
    location: 'Calgary, AB'
  },
  {
    id: '3',
    title: 'John Deere 8R 370 Tractor',
    description: '2023 Model, signature edition. Autopowr IVT transmission, GPS prepared.',
    currentBid: 315000,
    marketValue: 345000,
    endTime: '5h 30m',
    image: '/auction-pics/e371f0a9-c035-4d36-8123-94d1bcba5627.jpeg',
    channelId: 'c4',
    bids: 18,
    priceScore: 76,
    trustScore: 4.7,
    watchHeat: 432,
    isNative: true,
    isEditorial: false,
    isCinematic: false,
    whyWatch: 'Latest gen farm tech. Strong resale value on 8R series makes this a safe intelligence-backed buy.',
    location: 'Westlock, AB'
  },
  {
    id: '4',
    title: 'Custom Aluminum Flatbed Trailer',
    description: '30ft Gooseneck, triple axle, hydraulic ramps. Custom build 2024.',
    currentBid: 12400,
    marketValue: 18500,
    endTime: '1h 05m',
    image: '/auction-pics/56aced56-89f1-4449-b1d7-ee75a717ae9c.jpeg',
    channelId: 'c3',
    bids: 31,
    priceScore: 94,
    trustScore: 4.5,
    watchHeat: 215,
    isNative: true,
    isEditorial: true,
    isCinematic: false,
    whyWatch: 'Exceptional build quality. Under market by $6,000 due to seller relocation haste.',
    location: 'Red Deer, AB'
  },
  {
    id: '5',
    title: '2024 Peterbilt 579 UltraLoft',
    description: 'PACCAR MX-13 engine, 510HP, Automated transmission. Fleet standard.',
    currentBid: 125600,
    marketValue: 142000,
    endTime: '3h 45m',
    image: '/auction-pics/0bb30942-605a-4a2d-9b19-8fa92b2f3ffb.jpeg',
    channelId: 'c3',
    bids: 42,
    priceScore: 81,
    trustScore: 4.8,
    watchHeat: 689,
    isNative: false,
    isEditorial: false,
    isCinematic: true,
    whyWatch: 'Low mileage long-haul spec. Perfect for fleet expansion with verified logs.',
    location: 'Lethbridge, AB'
  },
  {
    id: '6',
    title: 'Executive Beachfront Estate',
    description: '2.5 Acres, 150ft private shoreline. Development permit ready.',
    currentBid: 2850000,
    marketValue: 3200000,
    endTime: '2d 4h',
    image: '/auction-pics/fde60690-64d3-47a9-b729-712fbd199340.jpeg',
    channelId: 'c4',
    bids: 12,
    priceScore: 78,
    trustScore: 4.9,
    watchHeat: 3105,
    isNative: true,
    isEditorial: true,
    isCinematic: true,
    whyWatch: 'One of the last unreserved land parcels in this zip code. High strategic value.',
    location: 'Sylvan Lake, AB'
  }
];

export const LIVE_TICKER_DATA = [
  { item: 'BMW Z4', price: 29652, increase: 250 },
  { item: 'F-150', price: 24100, increase: 450 },
  { item: 'CAT 972K', price: 44784, status: 'ending soon' },
  { item: 'JD 8R', price: 315200, increase: 1200 },
  { item: 'PETERBILT', price: 125600, increase: 500 },
  { item: 'SHELBY GT', price: 89000, increase: 100 },
];

