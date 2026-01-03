import React, { useState, useEffect } from 'react';
import { getXAITip } from '../services/api';
import { connectMetaMask, isMetaMaskConnected } from '../services/metamask';
import SwapCard from '../components/SwapCard';
import PriceCard from '../components/PriceCard';

interface WalletInfo {
  address: string;
  balance: string;
}

function Dashboard() {
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
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

  const fetchWalletInfo = async () => {
    try {
      if (await isMetaMaskConnected()) {
        const info = await connectMetaMask();
        setWalletInfo(info);
      }
    } catch (error) {
      console.error('Failed to fetch wallet info:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchTip(), fetchWalletInfo()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleConnectWallet = async () => {
    try {
      const info = await connectMetaMask();
      setWalletInfo(info);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect MetaMask. Please try again.');
    }
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
          {/* Wallet Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              🦊 Wallet
            </h2>
            {walletInfo ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-mono text-sm text-gray-800 break-all">
                    {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    {parseFloat(walletInfo.balance).toFixed(4)} ETH
                  </p>
                </div>
                <button
                  onClick={fetchWalletInfo}
                  className="w-full mt-2 bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition"
                >
                  🔄 Refresh Balance
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 mb-4">No wallet connected</p>
                <button
                  onClick={handleConnectWallet}
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
                >
                  Connect MetaMask 🦊
                </button>
              </div>
            )}
          </div>

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
                <span className="font-bold text-gray-800">{walletInfo ? 1 : 0}</span>
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
                <span className="mr-2">�</span> Portfolio Charts
              </li>
              <li className="flex items-center">
                <span className="mr-2">�</span> Token Burn Tracker
              </li>
              <li className="flex items-center">
                <span className="mr-2">�</span> Multiple Wallets
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
