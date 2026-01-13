import React, { useState, useEffect } from 'react';
import {
  getWeeklyBurnSettings,
  saveWeeklyBurnSettings,
  getBurnScheduleHistory,
  calculateNextBurnTime,
  getTimeUntilNextBurn,
  formatTimeUntilBurn,
  getDayName,
  WeeklyBurnSettings,
  BurnScheduleRecord,
} from '../services/weeklyBurnScheduler';
import { getStoredWallets, Wallet } from '../services/walletManager';

function WeeklyBurnScheduler() {
  const [settings, setSettings] = useState<WeeklyBurnSettings>(getWeeklyBurnSettings());
  const [history, setHistory] = useState<BurnScheduleRecord[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [timeUntilBurn, setTimeUntilBurn] = useState<number>(0);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setSettings(getWeeklyBurnSettings());
    setHistory(getBurnScheduleHistory());
    setWallets(getStoredWallets());
  }, []);

  // Update countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      setTimeUntilBurn(getTimeUntilNextBurn(settings));
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings]);

  const handleToggleEnabled = () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    saveWeeklyBurnSettings(newSettings);
    setSettings(newSettings);
  };

  const handleDayChange = (day: number) => {
    const newSettings = { ...settings, dayOfWeek: day };
    saveWeeklyBurnSettings(newSettings);
    setSettings(newSettings);
  };

  const handleTimeChange = (time: string) => {
    const newSettings = { ...settings, timeOfDay: time };
    saveWeeklyBurnSettings(newSettings);
    setSettings(newSettings);
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(50, Math.max(9, parseInt(e.target.value) || 9));
    const newSettings = { ...settings, percentage: value };
    saveWeeklyBurnSettings(newSettings);
    setSettings(newSettings);
  };

  const handleWalletChange = (walletId: string) => {
    const newSettings = { ...settings, sourceWalletId: walletId };
    saveWeeklyBurnSettings(newSettings);
    setSettings(newSettings);
  };

  const handleTokenTypeChange = (tokenType: 'ETH' | '369_ETERNAL' | 'SOL') => {
    const newSettings = { ...settings, tokenType };
    saveWeeklyBurnSettings(newSettings);
    setSettings(newSettings);
  };

  const days = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          📅 Weekly Burn Scheduler
        </h2>
        <button
          onClick={handleToggleEnabled}
          className={`px-4 py-1 rounded-full text-sm font-medium transition ${
            settings.enabled
              ? 'bg-green-500 text-white'
              : 'bg-gray-300 text-gray-600'
          }`}
        >
          {settings.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Next Burn Countdown */}
      {settings.enabled && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-4 mb-4 text-white">
          <p className="text-sm opacity-90 mb-1">Next Burn In</p>
          <p className="text-3xl font-bold">{formatTimeUntilBurn(timeUntilBurn)}</p>
          <p className="text-xs opacity-80 mt-1">
            {getDayName(settings.dayOfWeek)} at {settings.timeOfDay}
          </p>
        </div>
      )}

      {/* Schedule Settings */}
      <div className="space-y-4">
        {/* Day Selector */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Burn Day</label>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <button
                key={day.value}
                onClick={() => handleDayChange(day.value)}
                className={`py-2 rounded-lg text-sm font-medium transition ${
                  settings.dayOfWeek === day.value
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Selector */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Burn Time</label>
          <input
            type="time"
            value={settings.timeOfDay}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white"
          />
        </div>

        {/* Token Type Selector */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Token to Burn</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleTokenTypeChange('ETH')}
              className={`py-2 rounded-lg text-sm font-medium transition ${
                settings.tokenType === 'ETH'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ETH
            </button>
            <button
              onClick={() => handleTokenTypeChange('369_ETERNAL')}
              className={`py-2 rounded-lg text-sm font-medium transition ${
                settings.tokenType === '369_ETERNAL'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ✨ V369
            </button>
            <button
              onClick={() => handleTokenTypeChange('SOL')}
              className={`py-2 rounded-lg text-sm font-medium transition ${
                settings.tokenType === 'SOL'
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              SOL
            </button>
          </div>
        </div>

        {/* Percentage Slider */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Burn Percentage (min 9%)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="9"
              max="50"
              value={settings.percentage}
              onChange={handlePercentageChange}
              className="flex-1"
            />
            <span className="font-bold text-orange-500 w-12 text-right">
              {settings.percentage}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Sacred 9% minimum for resonant frequency 🔥
          </p>
        </div>

        {/* Wallet Selector */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Source Wallet</label>
          <select
            value={settings.sourceWalletId}
            onChange={(e) => handleWalletChange(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white"
          >
            <option value="">Select wallet...</option>
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.label} ({wallet.address.slice(0, 6)}...)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedule Summary */}
      {settings.enabled && settings.sourceWalletId && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-800">
            <strong>📋 Schedule:</strong> Burn {settings.percentage}% of{' '}
            {settings.tokenType === '369_ETERNAL' ? 'Vortex369 Talisman' : settings.tokenType} every{' '}
            {getDayName(settings.dayOfWeek)} at {settings.timeOfDay}
          </p>
        </div>
      )}

      {/* History Toggle */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
      >
        {showHistory ? '▼' : '▶'} View Schedule History ({history.length})
      </button>

      {/* History List */}
      {showHistory && (
        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No scheduled burns yet</p>
          ) : (
            history.map((record) => (
              <div
                key={record.id}
                className="p-3 bg-gray-50 rounded-lg text-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">
                      {record.amount} {record.tokenType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(record.scheduledTime)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      record.status === 'executed'
                        ? 'bg-green-100 text-green-700'
                        : record.status === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : record.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
                {record.txHash && (
                  <a
                    href={`https://etherscan.io/tx/${record.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline mt-1 block"
                  >
                    View Transaction →
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default WeeklyBurnScheduler;
