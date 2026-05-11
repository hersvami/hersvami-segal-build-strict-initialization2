// src/utils/services/bunningsApi.ts

export interface BunningsProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  url: string;
  imageUrl?: string;
  inStock?: boolean;
}

export interface BunningsCredentials {
  consumerKey: string;
  consumerSecret: string;
}

const BASE_URL = 'https://api.bunnings.com.au'; // Production base
const SANDBOX_BASE_URL = 'https://api.sandbox.bunnings.com.au'; // Sandbox base

// Note: Direct browser calls to Bunnings API often fail due to CORS.
// In a production app, you would route these requests through a serverless function (e.g., Netlify/Vercel).
// For this implementation, we will try direct fetch, but fallback to search URLs if CORS blocks it.

export async function searchBunningsProducts(
  query: string, 
  credentials: BunningsCredentials,
  useSandbox: boolean = true
): Promise<BunningsProduct[]> {
  const baseUrl = useSandbox ? SANDBOX_BASE_URL : BASE_URL;
  
  // Construct the authorization header
  // Note: Bunnings OAuth usually requires a token exchange first. 
  // If you have a simple API Key setup, adjust headers accordingly.
  // Assuming Consumer Key/Secret needs to be exchanged for a Bearer Token first.
  // Since we can't do secure token exchange in client-side code easily without exposing secrets,
  // we will primarily rely on generating Search Links for the user.
  
  console.warn("Direct API calls from browser may be blocked by CORS or require server-side token exchange.");
  
  // Fallback: Return empty array but trigger the "Open Search" logic in UI
  return [];
}

export function getBunningsSearchUrl(query: string): string {
  return `https://www.bunnings.com.au/search?q=${encodeURIComponent(query)}`;
}

export function getBunningsProductUrl(sku: string): string {
  return `https://www.bunnings.com.au/${sku}`; // Simplified pattern
}

// Mapping app categories to Bunnings search terms
export const categoryToSearchTerm: Record<string, string> = {
  'decking': 'merbau decking treated pine',
  'screws-fixings': 'decking screws galvanized brackets',
  'concrete': 'concrete mix 20mpa',
  'treated-pine': 'h3 treated pine bearer joist',
  'bathroom-tapware': 'basin tap mixer',
  'kitchen-sink': 'kitchen sink stainless',
  'paint': 'interior paint white',
  'tiles': 'floor tiles ceramic',
  'plumbing': 'pvc pipe fittings',
  'electrical': 'power points switches',
  'insulation': 'bulk insulation batts',
  'gyprock': 'plasterboard 10mm',
  'timber-framing': 'h3 treated pine framing',
  'roofing': 'corrugated iron roofing',
  'windows': 'aluminium windows',
  'doors': 'external doors',
  'landscaping': 'garden soil mulch',
  'fencing': 'colorbond fencing',
  'paving': 'pavers concrete',
  'pool': 'pool pump filter',
  'laundry': 'laundry tub tap',
  'waterproofing': 'waterproofing membrane',
  'adhesives': 'construction adhesive',
  'safety': 'safety gear gloves glasses'
};