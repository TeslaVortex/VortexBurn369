import axios from 'axios';

// Coinbase API configuration
const COINBASE_API_URL = 'https://api.coinbase.com/v2';

// Price data interface
export interface CryptoPrice {
  symbol: string;
  price: string;
  currency: string;
  change24h?: string;
}

// Get current price for a cryptocurrency
export const getCryptoPrice = async (symbol: string, currency: string = 'USD'): Promise<CryptoPrice> => {
  try {
    const response = await axios.get(`${COINBASE_API_URL}/prices/${symbol}-${currency}/spot`);
    return {
      symbol,
      price: response.data.data.amount,
      currency: response.data.data.currency,
    };
  } catch (error) {
    console.error(`Error fetching ${symbol} price:`, error);
    // Return fallback price for demo
    const fallbackPrices: Record<string, string> = {
      BTC: '43250.00',
      ETH: '2350.00',
      SOL: '98.50',
      DOGE: '0.082',
    };
    return {
      symbol,
      price: fallbackPrices[symbol] || '0.00',
      currency,
    };
  }
};

// Get multiple crypto prices
export const getMultiplePrices = async (symbols: string[], currency: string = 'USD'): Promise<CryptoPrice[]> => {
  const prices = await Promise.all(
    symbols.map(symbol => getCryptoPrice(symbol, currency))
  );
  return prices;
};

// Get exchange rates
export const getExchangeRates = async (currency: string = 'USD'): Promise<Record<string, string>> => {
  try {
    const response = await axios.get(`${COINBASE_API_URL}/exchange-rates?currency=${currency}`);
    return response.data.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return fallback rates
    return {
      BTC: '0.000023',
      ETH: '0.000425',
      SOL: '0.0101',
      USDC: '1.00',
    };
  }
};

// Coinbase OAuth configuration (for future user authentication)
export const COINBASE_OAUTH_CONFIG = {
  clientId: process.env.COINBASE_CLIENT_ID || '',
  clientSecret: process.env.COINBASE_CLIENT_SECRET || '',
  redirectUri: process.env.COINBASE_REDIRECT_URI || 'http://localhost:3000/callback/coinbase',
  scopes: ['wallet:accounts:read', 'wallet:transactions:read'],
};

// Generate OAuth URL for Coinbase connection
export const getCoinbaseAuthUrl = (): string => {
  const { clientId, redirectUri, scopes } = COINBASE_OAUTH_CONFIG;
  const scopeString = scopes.join(',');
  return `https://www.coinbase.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopeString}`;
};
