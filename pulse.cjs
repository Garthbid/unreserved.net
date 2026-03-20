#!/usr/bin/env node
/**
 * Unreserved.net — Pulse Scraper
 * 
 * Hits Garthbid API, extracts live price + timer + bid count,
 * upserts directly into Supabase prices table.
 * 
 * Usage: node pulse.js
 * 
 * Zero AI tokens. Pure HTTP + JSON.
 */

const https = require('https');
const http = require('http');

// ── Config ──────────────────────────────────────────────────────
const GARTHBID_API = 'https://garthbid-94590894254.northamerica-northeast1.run.app/auction/filter/auctions';

const SUPABASE_URL = 'https://hvxkgsacmgyuhcmsmmrx.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2eGtnc2FjbWd5dWhjbXNtbXJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAzODkxMCwiZXhwIjoyMDg5NjE0OTEwfQ.xg_s-APvEpC6A7HTJC2heBH4OCfVp6ZmIfMKkkQPg4c';

// ── HTTP helpers ────────────────────────────────────────────────
function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const body = options.body ? JSON.stringify(options.body) : undefined;
    const lib = url.startsWith('https') ? https : http;
    
    const req = lib.request(url, {
      method: options.method || (body ? 'POST' : 'GET'),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// ── Supabase helpers ────────────────────────────────────────────
const supabaseHeaders = {
  'apikey': SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates'
};

async function getItemsBySource(sourcePlatform) {
  const url = `${SUPABASE_URL}/rest/v1/items?source_platform=eq.${encodeURIComponent(sourcePlatform)}&select=id,source_url`;
  const res = await fetchJSON(url, { method: 'GET', headers: supabaseHeaders });
  return res.data || [];
}

async function upsertPrices(priceRows) {
  const url = `${SUPABASE_URL}/rest/v1/prices`;
  const res = await fetchJSON(url, {
    method: 'POST',
    headers: supabaseHeaders,
    body: priceRows
  });
  return res;
}

// ── Tiered schedule ─────────────────────────────────────────────
function getNextPollLabel(endsAt) {
  const msRemaining = new Date(endsAt).getTime() - Date.now();
  const hours = msRemaining / (1000 * 60 * 60);
  
  if (hours > 24) return '6h';
  if (hours > 4)  return '1h';
  if (hours > 1)  return '15m';
  if (hours > 0.25) return '5m';
  return '1m';
}

// ── Main ────────────────────────────────────────────────────────
async function pulse() {
  const startTime = Date.now();
  console.log(`[PULSE] ${new Date().toISOString()} — Starting...`);
  
  try {
    // 1. Fetch all live Garthbid auctions
    console.log(`[PULSE] Fetching Garthbid API...`);
    const garthbidRes = await fetchJSON(GARTHBID_API, { method: 'POST', body: {} });
    const auctions = garthbidRes.data;
    console.log(`[PULSE] Got ${auctions.length} items from Garthbid`);
    
    // 2. Get our stored items to map source_url → item_id
    console.log(`[PULSE] Fetching item IDs from Supabase...`);
    const storedItems = await getItemsBySource('Garthbid');
    console.log(`[PULSE] Found ${storedItems.length} Garthbid items in database`);
    
    // Build lookup: garthbid auction ID → our item UUID
    const sourceUrlToItemId = {};
    for (const item of storedItems) {
      // Extract the garthbid UUID from source_url
      const parts = item.source_url.split('/');
      const garthbidId = parts[parts.length - 1];
      sourceUrlToItemId[garthbidId] = item.id;
    }
    
    // 3. Build price upsert rows
    const priceRows = [];
    let matched = 0;
    let skipped = 0;
    
    for (const auction of auctions) {
      const itemId = sourceUrlToItemId[auction.id];
      if (!itemId) {
        skipped++;
        continue;
      }
      
      matched++;
      const endsAt = auction.expiresAt;
      const startsAt = auction.markedToGoLiveAt;
      const isLive = new Date(endsAt) > new Date();
      const biddingStarted = startsAt ? new Date(startsAt) <= new Date() : true;
      const status = !isLive ? 'sold' : biddingStarted ? 'live' : 'upcoming';
      
      priceRows.push({
        item_id: itemId,
        price: auction.lastPrice || auction.startingPrice || 0,
        starts_at: startsAt || null,
        ends_at: endsAt,
        bids: parseInt(auction.bidsCount) || 0,
        status: status,
        updated_at: new Date().toISOString()
      });
    }
    
    console.log(`[PULSE] Matched: ${matched}, Skipped (not in DB): ${skipped}`);
    
    // 4. Upsert to Supabase
    if (priceRows.length > 0) {
      console.log(`[PULSE] Upserting ${priceRows.length} price rows...`);
      const result = await upsertPrices(priceRows);
      if (result.status >= 200 && result.status < 300) {
        console.log(`[PULSE] ✓ Prices updated successfully`);
      } else {
        console.error(`[PULSE] ✗ Supabase error: ${result.status}`, result.data);
      }
    } else {
      console.log(`[PULSE] No items to update — have you imported items into Supabase yet?`);
    }
    
    // 5. Summary
    const elapsed = Date.now() - startTime;
    const liveCount = priceRows.filter(r => r.status === 'live').length;
    const upcomingCount = priceRows.filter(r => r.status === 'upcoming').length;
    const soldCount = priceRows.filter(r => r.status === 'sold').length;
    
    console.log(`[PULSE] ${upcomingCount} upcoming, ${liveCount} live, ${soldCount} sold — took ${elapsed}ms`);
    
    if (priceRows.length > 0) {
      const soonest = priceRows
        .filter(r => r.status !== 'sold')
        .sort((a, b) => new Date(a.ends_at) - new Date(b.ends_at));
      if (soonest[0]) {
        console.log(`[PULSE] Next poll recommended: ${getNextPollLabel(soonest[0].ends_at)}`);
      }
    }
    
  } catch (err) {
    console.error(`[PULSE] ✗ Error: ${err.message}`);
    process.exit(1);
  }
}

pulse();
