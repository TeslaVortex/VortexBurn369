import React, { useState } from 'react';
import { getSwapQuote, SwapQuote, TOKENS } from '../services/uniswap';

function SwapCard() {
  const [amountIn, setAmountIn] = useState('');
  const [tokenIn, setTokenIn] = useState('ETH');
  const [tokenOut, setTokenOut] = useState('USDC');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetQuote = async () => {
    if (!amountIn || parseFloat(amountIn) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const result = await getSwapQuote(amountIn, tokenIn, tokenOut);
      setQuote(result);
    } catch (error) {
      console.error('Failed to get quote:', error);
      alert('Failed to get swap quote');
    }
    setLoading(false);
  };

  const handleSwapTokens = () => {
    const temp = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(temp);
    setQuote(null);
  };

  const tokenOptions = Object.keys(TOKENS);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">🔄 Swap Tokens</h2>
      
      {/* Input Token */}
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-1">You Pay</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={amountIn}
            onChange={(e) => {
              setAmountIn(e.target.value);
              setQuote(null);
            }}
            placeholder="0.0"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={tokenIn}
            onChange={(e) => {
              setTokenIn(e.target.value);
              setQuote(null);
            }}
            className="p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tokenOptions.filter(t => t !== tokenOut).map(token => (
              <option key={token} value={token}>{token}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center my-2">
        <button
          onClick={handleSwapTokens}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          ⇅
        </button>
      </div>

      {/* Output Token */}
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-1">You Receive</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={quote ? quote.estimatedOut : ''}
            readOnly
            placeholder="0.0"
            className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50"
          />
          <select
            value={tokenOut}
            onChange={(e) => {
              setTokenOut(e.target.value);
              setQuote(null);
            }}
            className="p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tokenOptions.filter(t => t !== tokenIn).map(token => (
              <option key={token} value={token}>{token}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quote Details */}
      {quote && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Rate</span>
            <span className="text-gray-800">
              1 {quote.tokenIn} = {(parseFloat(quote.estimatedOut) / parseFloat(quote.amountIn)).toFixed(4)} {quote.tokenOut}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Price Impact</span>
            <span className="text-gray-800">{quote.priceImpact}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Est. Gas</span>
            <span className="text-gray-800">{quote.gasEstimate}</span>
          </div>
        </div>
      )}

      {/* Get Quote / Swap Button */}
      <button
        onClick={handleGetQuote}
        disabled={loading || !amountIn}
        className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '⏳ Getting Quote...' : quote ? '🔄 Refresh Quote' : '💱 Get Quote'}
      </button>

      <p className="text-xs text-gray-400 mt-2 text-center">
        Powered by Uniswap • Quotes are estimates
      </p>
    </div>
  );
}

export default SwapCard;
