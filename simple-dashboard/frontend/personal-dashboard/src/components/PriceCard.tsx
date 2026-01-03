import React, { useState, useEffect } from 'react';
import { getMultiplePrices, CryptoPrice, formatPrice } from '../services/coinbase';

// Crypto icons/emojis
const cryptoIcons: Record<string, string> = {
  BTC: '₿',
  ETH: 'Ξ',
  SOL: '◎',
  DOGE: '🐕',
  USDC: '💵',
};

function PriceCard() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setError(null);
      const data = await getMultiplePrices(['BTC', 'ETH', 'SOL']);
      setPrices(data);
    } catch (err) {
      console.error('Failed to fetch prices:', err);
      setError('Unable to load prices');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrices();
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Crypto Prices</h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">📈 Crypto Prices</h2>
        <button
          onClick={fetchPrices}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          🔄 Refresh
        </button>
      </div>

      {error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <div className="space-y-3">
          {prices.map((crypto) => (
            <div
              key={crypto.symbol}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cryptoIcons[crypto.symbol] || '🪙'}</span>
                <div>
                  <p className="font-semibold text-gray-800">{crypto.symbol}</p>
                  <p className="text-xs text-gray-500">{crypto.currency}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatPrice(crypto.price)}</p>
                {crypto.change24h && (
                  <p className={`text-xs ${parseFloat(crypto.change24h) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.change24h}%
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4 text-center">
        Powered by Coinbase • Updates every 30s
      </p>
    </div>
  );
}

export default PriceCard;
