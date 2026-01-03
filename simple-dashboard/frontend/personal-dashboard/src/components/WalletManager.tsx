import React, { useState, useEffect } from 'react';
import {
  Wallet,
  getStoredWallets,
  connectAndAddMetaMask,
  addManualWallet,
  removeWallet,
  updateWalletLabel,
  getTotalBalance,
} from '../services/walletManager';

interface WalletManagerProps {
  onWalletChange?: (wallets: Wallet[]) => void;
}

function WalletManager({ onWalletChange }: WalletManagerProps) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [manualLabel, setManualLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  useEffect(() => {
    setWallets(getStoredWallets());
  }, []);

  const refreshWallets = () => {
    const updated = getStoredWallets();
    setWallets(updated);
    onWalletChange?.(updated);
  };

  const handleConnectMetaMask = async () => {
    setLoading(true);
    setError(null);
    try {
      await connectAndAddMetaMask();
      refreshWallets();
    } catch (err: any) {
      setError(err.message || 'Failed to connect MetaMask');
    }
    setLoading(false);
  };

  const handleAddManual = () => {
    setError(null);
    try {
      addManualWallet(manualAddress, manualLabel || 'Watch Wallet');
      setManualAddress('');
      setManualLabel('');
      setShowAddForm(false);
      refreshWallets();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemove = (id: string) => {
    if (window.confirm('Remove this wallet?')) {
      removeWallet(id);
      refreshWallets();
    }
  };

  const handleSaveLabel = (id: string) => {
    updateWalletLabel(id, editLabel);
    setEditingId(null);
    refreshWallets();
  };

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">👛 Wallets</h2>
        <span className="text-sm text-gray-500">{wallets.length} wallet(s)</span>
      </div>

      {/* Total Balance */}
      {wallets.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-4 mb-4 text-white">
          <p className="text-sm opacity-80">Total Balance</p>
          <p className="text-2xl font-bold">{getTotalBalance()} ETH</p>
        </div>
      )}

      {/* Wallet List */}
      <div className="space-y-3 mb-4">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {editingId === wallet.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveLabel(wallet.id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <p
                    className="font-medium text-gray-800 cursor-pointer hover:text-blue-600"
                    onClick={() => {
                      setEditingId(wallet.id);
                      setEditLabel(wallet.label);
                    }}
                  >
                    {wallet.label} ✏️
                  </p>
                )}
                <p className="text-xs text-gray-500 font-mono mt-1">
                  {truncateAddress(wallet.address)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{parseFloat(wallet.balance).toFixed(4)} ETH</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      wallet.type === 'metamask'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {wallet.type === 'metamask' ? '🦊 MetaMask' : '👁 Watch'}
                  </span>
                  <button
                    onClick={() => handleRemove(wallet.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {wallets.length === 0 && (
          <p className="text-center text-gray-500 py-4">No wallets added yet</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Add Wallet Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-3">Add Watch Wallet</h3>
          <input
            type="text"
            placeholder="0x... (Ethereum address)"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Label (optional)"
            value={manualLabel}
            onChange={(e) => setManualLabel(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddManual}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Add Wallet
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleConnectMetaMask}
          disabled={loading}
          className="flex-1 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition disabled:opacity-50"
        >
          {loading ? '⏳ Connecting...' : '🦊 Connect MetaMask'}
        </button>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
        >
          ➕
        </button>
      </div>
    </div>
  );
}

export default WalletManager;
