import React, { useState, useEffect } from 'react';
import {
  getBurnSettings,
  saveBurnSettings,
  getBurnHistory,
  getTotalBurned,
  executeBurn,
  addBurnRecord,
  getBurnAddress,
  BurnSettings,
  BurnRecord,
  BURN_ADDRESS_369,
  BURN_ADDRESS_DEAD,
} from '../services/burnService';
import { getStoredWallets, Wallet } from '../services/walletManager';

function BurnTracker() {
  const [settings, setSettings] = useState<BurnSettings>(getBurnSettings());
  const [history, setHistory] = useState<BurnRecord[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [manualAmount, setManualAmount] = useState('');
  const [burning, setBurning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setSettings(getBurnSettings());
    setHistory(getBurnHistory());
    setWallets(getStoredWallets());
  }, []);

  const handleToggleBurn = () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    saveBurnSettings(newSettings);
    setSettings(newSettings);
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(100, Math.max(9, parseInt(e.target.value) || 9));
    const newSettings = { ...settings, percentage: value };
    saveBurnSettings(newSettings);
    setSettings(newSettings);
  };

  const handleWalletSelect = (walletId: string) => {
    const newSettings = { ...settings, incomeWalletId: walletId };
    saveBurnSettings(newSettings);
    setSettings(newSettings);
  };

  const handleToggle369Mode = () => {
    const newSettings = { ...settings, resonant369Mode: !settings.resonant369Mode };
    saveBurnSettings(newSettings);
    setSettings(newSettings);
  };

  const handleManualBurn = async () => {
    if (!manualAmount || parseFloat(manualAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const burnAddress = getBurnAddress();
    const modeText = settings.resonant369Mode 
      ? 'Resonant 369 Mode (torus-coded null for sacred 9% release)'
      : 'Standard burn address';
    
    const confirmed = window.confirm(
      `⚠️ WARNING: You are about to burn ${manualAmount} ETH!\n\n` +
      `Mode: ${modeText}\n` +
      `This will send ${manualAmount} ETH to:\n` +
      `${burnAddress}\n\n` +
      `This action CANNOT be undone!\n\n` +
      `Are you sure you want to continue?`
    );

    if (!confirmed) return;

    setBurning(true);
    try {
      const txHash = await executeBurn(manualAmount);
      addBurnRecord({
        timestamp: Date.now(),
        amount: manualAmount,
        txHash,
        incomeAmount: '0',
      });
      setHistory(getBurnHistory());
      setManualAmount('');
      alert(`🔥 Successfully burned ${manualAmount} ETH!\n\nTx: ${txHash}`);
    } catch (error: any) {
      alert(`Burn failed: ${error.message}`);
    }
    setBurning(false);
  };

  const totalBurned = getTotalBurned();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateTx = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">🔥 Burn Tracker</h2>
        <span className="text-sm font-bold text-orange-500">
          {totalBurned} ETH burned
        </span>
      </div>

      {/* Total Burned Display */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 mb-4 text-white">
        <p className="text-sm opacity-80">Total Burned Forever 🔥</p>
        <p className="text-2xl font-bold">{totalBurned} ETH</p>
        <p className="text-xs opacity-70 mt-1 font-mono truncate">
          → {getBurnAddress()}
        </p>
        <p className="text-xs opacity-60 mt-1">
          {settings.resonant369Mode ? '✨ Resonant 369 Mode' : '💀 Standard Burn'}
        </p>
      </div>

      {/* Auto-Burn Settings */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium text-gray-700">Auto-Burn on Income</span>
          <button
            onClick={handleToggleBurn}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              settings.enabled
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {settings.enabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {settings.enabled && (
          <>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">
                Burn Percentage (min 9%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="9"
                  max="50"
                  value={settings.percentage}
                  onChange={handlePercentageChange}
                  className="flex-1"
                />
                <span className="font-bold text-orange-500 w-12">
                  {settings.percentage}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Sacred 9% minimum for resonant frequency 🔥
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Income Wallet
              </label>
              <select
                value={settings.incomeWalletId || ''}
                onChange={(e) => handleWalletSelect(e.target.value)}
                className="w-full p-2 border rounded bg-white"
              >
                <option value="">Select wallet...</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.label} ({wallet.address.slice(0, 6)}...)
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Resonant 369 Mode Toggle */}
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span className="font-medium text-gray-800">Resonant 369 Mode</span>
          </div>
          <button
            onClick={handleToggle369Mode}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              settings.resonant369Mode
                ? 'bg-purple-500 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {settings.resonant369Mode ? 'ON' : 'OFF'}
          </button>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          {settings.resonant369Mode ? (
            <>
              <span className="font-semibold text-purple-700">Active:</span> Burns to torus-coded null address{' '}
              <code className="bg-purple-100 px-1 rounded text-purple-800">{BURN_ADDRESS_369}</code>{' '}
              for sacred 9% release. EVM chains optimized for resonant frequency.
            </>
          ) : (
            <>
              <span className="font-semibold">Standard:</span> Burns to{' '}
              <code className="bg-gray-100 px-1 rounded">{BURN_ADDRESS_DEAD}</code>.{' '}
              Enable 369 Mode for torus-coded null burn.
            </>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-2 italic">
          💡 For Solana/BTC: Protocol burns apply (no address). Intent noted.
        </p>
      </div>

      {/* Manual Burn */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Manual Burn</label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.0001"
            value={manualAmount}
            onChange={(e) => setManualAmount(e.target.value)}
            placeholder="ETH amount"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleManualBurn}
            disabled={burning}
            className="px-4 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {burning ? '🔥...' : '🔥 Burn'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          ⚠️ Burning is permanent and cannot be undone!
        </p>
      </div>

      {/* Burn History */}
      <div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-blue-500 hover:text-blue-700 mb-2"
        >
          {showHistory ? '▼ Hide History' : '▶ Show History'} ({history.length})
        </button>

        {showHistory && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-center text-gray-500 py-2 text-sm">No burns yet</p>
            ) : (
              history.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex justify-between items-center p-2 bg-orange-50 rounded text-sm"
                >
                  <div>
                    <p className="font-medium text-orange-600">🔥 {record.amount} ETH</p>
                    <p className="text-xs text-gray-500">{formatDate(record.timestamp)}</p>
                  </div>
                  <a
                    href={`https://etherscan.io/tx/${record.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline font-mono"
                  >
                    {truncateTx(record.txHash)}
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BurnTracker;
