import React, { useState, useEffect } from 'react';

interface Token369Stats {
  price: number;
  priceUsd: string;
  liquidity: string;
  volume24h: string;
  change24h: string;
  poolId: string;
}

interface Token369CardProps {
  balance?: number;
  onRefresh?: () => void;
}

function Token369Card({ balance = 0, onRefresh }: Token369CardProps) {
  const [stats, setStats] = useState<Token369Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/raydium/369-eternal');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (err: any) {
      console.error('Error fetching 369 stats:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const balanceUsd = stats ? (balance * stats.price).toFixed(2) : '0.00';
  const isPositiveChange = stats?.change24h.startsWith('+') || stats?.change24h.startsWith('0');

  return (
    <div className="bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transition-all hover:shadow-2xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            ✨ Vortex369 Talisman
          </h2>
          <p className="text-sm opacity-80">Resonant Token</p>
        </div>
        <button
          onClick={() => {
            fetchStats();
            onRefresh?.();
          }}
          className="p-2 hover:bg-white/20 rounded-lg transition"
          title="Refresh"
        >
          🔄
        </button>
      </div>

      {loading && !stats ? (
        <div className="text-center py-4">
          <div className="animate-spin text-3xl">⏳</div>
          <p className="text-sm mt-2 opacity-80">Loading stats...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 rounded-lg p-4 mb-4">
          <p className="text-sm">⚠️ {error}</p>
          <button
            onClick={fetchStats}
            className="mt-2 text-xs underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {/* Balance Section */}
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <p className="text-sm opacity-80 mb-1">Your Balance</p>
            <p className="text-3xl font-bold">{balance.toLocaleString()} 369</p>
            <p className="text-lg opacity-90">${balanceUsd}</p>
          </div>

          {/* Price Section */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">Price</p>
              <p className="text-lg font-bold">${stats?.priceUsd}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">24h Change</p>
              <p className={`text-lg font-bold ${isPositiveChange ? 'text-green-300' : 'text-red-300'}`}>
                {stats?.change24h}
              </p>
            </div>
          </div>

          {/* Pool Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">Liquidity</p>
              <p className="text-sm font-semibold">{stats?.liquidity}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs opacity-80 mb-1">24h Volume</p>
              <p className="text-sm font-semibold">{stats?.volume24h}</p>
            </div>
          </div>

          {/* Pool Link */}
          <a
            href={`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${stats?.poolId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-white/20 hover:bg-white/30 text-center py-2 rounded-lg font-medium transition"
          >
            🌊 Trade on Raydium
          </a>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button className="bg-green-500/30 hover:bg-green-500/40 py-2 rounded-lg text-sm font-medium transition">
              💰 Buy
            </button>
            <button className="bg-orange-500/30 hover:bg-orange-500/40 py-2 rounded-lg text-sm font-medium transition">
              🔥 Burn
            </button>
          </div>
        </>
      )}

      {/* Sacred 369 Badge */}
      <div className="mt-4 text-center">
        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
          ✨ Sacred 9% Resonance ✨
        </span>
      </div>
    </div>
  );
}

export default Token369Card;
