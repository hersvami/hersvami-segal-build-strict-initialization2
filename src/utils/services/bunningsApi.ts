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

// ⚠️ DEFAULT SANDBOX CREDENTIALS (Pre-loaded for convenience)
// These are used if no custom keys are saved in LocalStorage.
// WARNING: Never commit LIVE/Production keys to code. Sandbox keys are safe for testing.
const DEFAULT_SANDBOX_KEY = "XYckoKSGjpKZCDfYUTta7WM1HGY1HgUabgF2i8pKDwAFVPOb";
const DEFAULT_SANDBOX_SECRET = "J96x0zopLcAIdPURAd1gp4VDOTG6NYa75hTr31fI8A1z0Lch1nc9cAgEOevscb8A";

const BASE_URL = 'https://api.bunnings.com.au'; 
const SANDBOX_BASE_URL = 'https://api.sandbox.bunnings.com.au';

/**
 * Retrieves credentials from LocalStorage, or falls back to defaults if not set.
 */
export function getBunningsCredentials(): BunningsCredentials {
  const storedKey = localStorage.getItem('bunnings_consumer_key');
  const storedSecret = localStorage.getItem('bunnings_consumer_secret');
  
  return {
    consumerKey: storedKey || DEFAULT_SANDBOX_KEY,
    consumerSecret: storedSecret || DEFAULT_SANDBOX_SECRET,
  };
}

export function isUsingSandbox(): boolean {
  const stored = localStorage.getItem('bunnings_use_sandbox');
  // Default to true if not set
  return stored === null ? true : stored === 'true';
}

export async function searchBunningsProducts(
  query: string, 
  useSandbox: boolean = isUsingSandbox()
): Promise<BunningsProduct[]> {
  const baseUrl = useSandbox ? SANDBOX_BASE_URL : BASE_URL;
  const credentials = getBunningsCredentials();
  
  console.log(`[Bunnings API] Searching for: "${query}" in ${useSandbox ? 'Sandbox' : 'Live'}`);
  
  // NOTE: Direct browser calls often fail due to CORS. 
  // The UI component will handle the fallback to opening a search tab.
  try {
    // Attempting fetch (likely to fail in browser without proxy due to CORS/OAuth)
    const response = await fetch(`${baseUrl}/catalogue/v1/products/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'application/json',
        // OAuth 1.0a signature would be required here for real calls
        // For now, we rely on the UI fallback mechanism
      }
    });
    
    if (!response.ok) throw new Error('API Request Failed');
    const data = await response.json();
    return mapApiResponse(data);
  } catch (error) {
    console.warn('[Bunnings API] Direct fetch failed (CORS/Auth). Falling back to search link.', error);
    return []; // UI will handle opening the link
  }
}

function mapApiResponse(data: any): BunningsProduct[] {
  // Mock mapping for sandbox responses
  return []; 
}

export function getBunningsSearchUrl(query: string): string {
  return `https://www.bunnings.com.au/search?q=${encodeURIComponent(query)}`;
}

export function getBunningsProductUrl(sku: string): string {
  return `https://www.bunnings.com.au/${sku}`; 
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