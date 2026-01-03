import React, { useState, useEffect } from 'react';
import { ExpensePieChart, BalanceLineChart, WalletBarChart } from './Charts';
import {
  getExpensesByCategory,
  getRecentBalanceHistory,
  generateSampleData,
  getExpenses,
} from '../services/expenseTracker';
import { getStoredWallets } from '../services/walletManager';

function ChartsPanel() {
  const [expenseData, setExpenseData] = useState<{ category: string; amount: number }[]>([]);
  const [balanceHistory, setBalanceHistory] = useState<{ date: string; balance: number }[]>([]);
  const [walletData, setWalletData] = useState<{ name: string; balance: number }[]>([]);
  const [activeChart, setActiveChart] = useState<'expenses' | 'balance' | 'wallets'>('expenses');

  const loadData = () => {
    setExpenseData(getExpensesByCategory());
    setBalanceHistory(getRecentBalanceHistory(7));
    
    const wallets = getStoredWallets();
    setWalletData(wallets.map(w => ({
      name: w.label,
      balance: parseFloat(w.balance) || 0,
    })));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateSample = () => {
    if (window.confirm('Generate sample expense data for demo?')) {
      generateSampleData();
      loadData();
    }
  };

  const hasExpenses = expenseData.length > 0;
  const hasBalanceHistory = balanceHistory.length > 0;
  const hasWallets = walletData.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">📊 Analytics</h2>
        <button
          onClick={loadData}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Chart Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveChart('expenses')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            activeChart === 'expenses'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          💸 Expenses
        </button>
        <button
          onClick={() => setActiveChart('balance')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            activeChart === 'balance'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📈 Balance
        </button>
        <button
          onClick={() => setActiveChart('wallets')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            activeChart === 'wallets'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          👛 Wallets
        </button>
      </div>

      {/* Chart Display */}
      <div className="h-64 flex items-center justify-center">
        {activeChart === 'expenses' && (
          hasExpenses ? (
            <ExpensePieChart expenses={expenseData} />
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-3">No expense data yet</p>
              <button
                onClick={handleGenerateSample}
                className="text-sm bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                📊 Generate Sample Data
              </button>
            </div>
          )
        )}

        {activeChart === 'balance' && (
          hasBalanceHistory ? (
            <div className="w-full">
              <BalanceLineChart history={balanceHistory} />
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-3">No balance history yet</p>
              <p className="text-xs text-gray-400">Balance is tracked automatically over time</p>
            </div>
          )
        )}

        {activeChart === 'wallets' && (
          hasWallets ? (
            <div className="w-full">
              <WalletBarChart wallets={walletData} />
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500">No wallets connected yet</p>
            </div>
          )
        )}
      </div>

      {/* Quick Stats */}
      {activeChart === 'expenses' && hasExpenses && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Categories</p>
              <p className="font-bold text-gray-800">{expenseData.length}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Total</p>
              <p className="font-bold text-red-500">
                ${expenseData.reduce((s, e) => s + e.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Top</p>
              <p className="font-bold text-gray-800">
                {expenseData.sort((a, b) => b.amount - a.amount)[0]?.category || '-'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChartsPanel;
