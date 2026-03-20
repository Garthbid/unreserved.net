import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hvxkgsacmgyuhcmsmmrx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database row types
export interface DbItem {
  id: string;
  source_platform: string;
  source_url: string;
  category: string;
  title: string;
  year: number | null;
  make: string | null;
  model: string | null;
  location: string | null;
  description: string | null;
  photos: string[] | null;
  vin: string | null;
  km_hours: string | null;
  currency: string;
  starting_price: number | null;
  created_at: string;
}

export interface DbPrice {
  id: string;
  item_id: string;
  price: number;
  starts_at: string | null;
  ends_at: string | null;
  bids: number;
  status: 'upcoming' | 'live' | 'sold';
  updated_at: string;
}
