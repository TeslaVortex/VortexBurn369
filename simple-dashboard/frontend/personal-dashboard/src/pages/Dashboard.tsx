import React, { useState, useEffect } from 'react';
import { getXAITip } from '../services/api';
import SwapCard from '../components/SwapCard';
import PriceCard from '../components/PriceCard';
import WalletManager from '../components/WalletManager';
import ExpenseManager from '../components/ExpenseManager';
import BurnTracker from '../components/BurnTracker';
import ChartsPanel from '../components/ChartsPanel';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import Token369Card from '../components/Token369Card';
import WeeklyBurnScheduler from '../components/WeeklyBurnScheduler';
import { getStoredWallets } from '../services/walletManager';
import { getTotalExpenses } from '../services/expenseTracker';
import { getTotalBurned } from '../services/burnService';

interface DashboardProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

function Dashboard({ darkMode, toggleDarkMode }: DashboardProps) {
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletCount, setWalletCount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalBurned, setTotalBurned] = useState('0');
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

  const refreshStats = () => {
    setWalletCount(getStoredWallets().length);
    setTotalExpenses(getTotalExpenses());
    setTotalBurned(getTotalBurned());
  };

  useEffect(() => {
    const init = async () => {
      await fetchTip();
      refreshStats();
      setLoading(false);
    };
    init();
  }, []);

  const handleWalletChange = () => {
    refreshStats();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Wallet Manager */}
            <WalletManager onWalletChange={handleWalletChange} />

            {/* Budget Tip Card */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all hover:shadow-xl`}>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
                💡 Budget Tip
              </h2>
              <div className={`${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-lg p-4 mb-4`}>
                <p className={`${darkMode ? 'text-blue-200' : 'text-gray-700'} leading-relaxed`}>
                  {tip || 'Loading tip...'}
                </p>
              </div>
              <button
                onClick={fetchTip}
                disabled={refreshingTip}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 font-medium"
              >
                {refreshingTip ? '⏳ Loading...' : '🎲 Get New Tip'}
              </button>
            </div>

            {/* Quick Stats Card */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all hover:shadow-xl`}>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>📊 Quick Stats</h2>
              <div className="space-y-3">
                <div className={`flex justify-between items-center p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Connected Wallets</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{walletCount}</span>
                </div>
                <div className={`flex justify-between items-center p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Expenses</span>
                  <span className="font-bold text-red-500">${totalExpenses.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between items-center p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Burned</span>
                  <span className="font-bold text-orange-500">{totalBurned} ETH 🔥</span>
                </div>
                <div className={`flex justify-between items-center p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Status</span>
                  <span className="font-bold text-green-500">● Online</span>
                </div>
              </div>
            </div>

            {/* Vortex369 Talisman Token Card */}
            <Token369Card balance={0} onRefresh={refreshStats} />

            {/* Expense Manager */}
            <ExpenseManager />

            {/* Charts Panel */}
            <ChartsPanel />

            {/* Burn Tracker */}
            <BurnTracker />

            {/* Weekly Burn Scheduler */}
            <WeeklyBurnScheduler />

            {/* Swap Card */}
            <SwapCard />

            {/* Price Card */}
            <PriceCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
