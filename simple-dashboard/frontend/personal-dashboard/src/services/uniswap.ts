import { BrowserProvider, formatUnits } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Common token addresses on Ethereum Mainnet
export const TOKENS = {
  ETH: { symbol: 'ETH', decimals: 18, address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
  USDC: { symbol: 'USDC', decimals: 6, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
  USDT: { symbol: 'USDT', decimals: 6, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
  DAI: { symbol: 'DAI', decimals: 18, address: '0x6B175474E89094C44Da98b954EescdeCB5BE1e6eB' },
  WETH: { symbol: 'WETH', decimals: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
};

export interface SwapQuote {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  estimatedOut: string;
  priceImpact: string;
  gasEstimate: string;
}

// Get a swap quote (simulated for now - real implementation would use Uniswap SDK)
export const getSwapQuote = async (
  amountIn: string,
  tokenIn: string,
  tokenOut: string
): Promise<SwapQuote> => {
  // Simulated exchange rates (in production, fetch from Uniswap)
  const rates: Record<string, Record<string, number>> = {
    ETH: { USDC: 2350, USDT: 2350, DAI: 2350 },
    USDC: { ETH: 0.000425, USDT: 1, DAI: 1 },
    USDT: { ETH: 0.000425, USDC: 1, DAI: 1 },
    DAI: { ETH: 0.000425, USDC: 1, USDT: 1 },
  };

  const rate = rates[tokenIn]?.[tokenOut] || 1;
  const amount = parseFloat(amountIn);
  const estimatedOut = (amount * rate).toFixed(6);
  
  // Simulate price impact based on amount
  const priceImpact = amount > 10 ? '0.5%' : amount > 1 ? '0.1%' : '< 0.01%';
  
  // Simulate gas estimate
  const gasEstimate = '~$5-15';

  return {
    tokenIn,
    tokenOut,
    amountIn,
    estimatedOut,
    priceImpact,
    gasEstimate,
  };
};

// Check if user has approved token for swap
export const checkTokenAllowance = async (tokenAddress: string): Promise<boolean> => {
  // Placeholder - would check actual allowance in production
  return true;
};

// Get token balance for connected wallet
export const getTokenBalance = async (tokenSymbol: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  if (tokenSymbol === 'ETH') {
    const balance = await provider.getBalance(address);
    return formatUnits(balance, 18);
  }

  // For other tokens, would need to call the token contract
  // Placeholder for now
  return '0.00';
};
