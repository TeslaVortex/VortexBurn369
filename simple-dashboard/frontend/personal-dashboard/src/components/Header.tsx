import React, { useState } from 'react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💰</span>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Simple Dashboard
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Track your money smart 💪
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Help Button */}
            <button
              onClick={() => setShowHelp(true)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
              title="Help"
            >
              ❓
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowHelp(false)}>
          <div
            className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl p-6 max-w-md mx-4 shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">How to Use 📖</h2>
              <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span>👛</span>
                <p><strong>Wallets:</strong> Connect MetaMask or add watch-only addresses to track balances.</p>
              </div>
              <div className="flex items-start gap-2">
                <span>💸</span>
                <p><strong>Expenses:</strong> Add daily expenses to track spending by category.</p>
              </div>
              <div className="flex items-start gap-2">
                <span>📊</span>
                <p><strong>Charts:</strong> View expenses in pie charts and balance history in line charts.</p>
              </div>
              <div className="flex items-start gap-2">
                <span>🔥</span>
                <p><strong>Burn:</strong> Auto-burn a percentage of income to reduce token supply.</p>
              </div>
              <div className="flex items-start gap-2">
                <span>💱</span>
                <p><strong>Swap:</strong> Get swap quotes for token exchanges via Uniswap.</p>
              </div>
              <div className="flex items-start gap-2">
                <span>📈</span>
                <p><strong>Prices:</strong> Live crypto prices from Coinbase (updates every 30s).</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Got it! 👍
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
