import React, { useState, useEffect } from 'react';
import { getXAITip } from '../services/api';
import SwapCard from '../components/SwapCard';
import PriceCard from '../components/PriceCard';
import WalletManager from '../components/WalletManager';
import { getStoredWallets } from '../services/walletManager';

function Dashboard() {
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletCount, setWalletCount] = useState(0);
  const [refreshingTip, setRefreshingTip] = useState(false);

  const fetchTip = async () => {
    setRefreshingTip(true);
    try {
      const tipData = await getXAITip();
      setTip(tipData);
    } catch (error) {
      console.error('Failed to fetch tip:', error);
    }
    setRefreshingTip(false);
  };

  useEffect(() => {
    const init = async () => {
      await fetchTip();
      setWalletCount(getStoredWallets().length);
      setLoading(false);
    };
    init();
  }, []);

  const handleWalletChange = () => {
    setWalletCount(getStoredWallets().length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">💰 Simple Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wallet Manager */}
          <WalletManager onWalletChange={handleWalletChange} />

          {/* Budget Tip Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              💡 Budget Tip
            </h2>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 leading-relaxed">
                {tip || 'Loading tip...'}
              </p>
            </div>
            <button
              onClick={fetchTip}
              disabled={refreshingTip}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition disabled:opacity-50"
            >
              {refreshingTip ? '⏳ Loading...' : '🎲 Get New Tip'}
            </button>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Connected Wallets</span>
                <span className="font-bold text-gray-800">{walletCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Network</span>
                <span className="font-bold text-gray-800">Ethereum</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Status</span>
                <span className="font-bold text-green-600">● Online</span>
              </div>
            </div>
          </div>

          {/* Swap Card */}
          <SwapCard />

          {/* Price Card */}
          <PriceCard />

          {/* Coming Soon Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🚀 Coming Soon</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">📈</span> Portfolio Charts
              </li>
              <li className="flex items-center">
                <span className="mr-2">🔥</span> Token Burn Tracker
              </li>
              <li className="flex items-center">
                <span className="mr-2">📊</span> Expense Categories
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
