import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface CryptoPrice {
  symbol: string;
  price: string;
  currency: string;
  change24h?: string;
}

// Get single crypto price
export const getCryptoPrice = async (symbol: string): Promise<CryptoPrice> => {
  const response = await axios.get(`${API_BASE_URL}/coinbase/price/${symbol}`);
  return response.data.data;
};

// Get multiple crypto prices
export const getMultiplePrices = async (symbols: string[] = ['BTC', 'ETH', 'SOL']): Promise<CryptoPrice[]> => {
  const response = await axios.get(`${API_BASE_URL}/coinbase/prices?symbols=${symbols.join(',')}`);
  return response.data.data;
};

// Format price for display
export const formatPrice = (price: string): string => {
  const num = parseFloat(price);
  if (num >= 1000) {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  } else if (num >= 1) {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  } else {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 4 });
  }
};
