import axios from 'axios';

// Vortex369 Talisman Token Pool ID on Raydium
export const TOKEN_369_POOL_ID = '69Jiph4XhmJhX8LoGi97iH6G2jR8NDyGzEQDTWrNA5Lm';

export interface RaydiumPoolData {
  poolId: string;
  price: number;
  liquidity: number;
  volume24h: number;
  priceChange24h: number;
  lastUpdated: number;
}

export interface Token369Stats {
  price: number;
  priceUsd: string;
  liquidity: string;
  volume24h: string;
  change24h: string;
  poolId: string;
}

// Fetch pool data from Raydium API
export const getRaydiumPoolData = async (poolId: string): Promise<RaydiumPoolData | null> => {
  try {
    // Raydium API endpoint for pool info
    const response = await axios.get(`https://api.raydium.io/v2/main/pool/${poolId}`);
    
    if (response.data && response.data.success) {
      const data = response.data.data;
      return {
        poolId: poolId,
        price: parseFloat(data.price || '0'),
        liquidity: parseFloat(data.liquidity || '0'),
        volume24h: parseFloat(data.volume24h || '0'),
        priceChange24h: parseFloat(data.priceChange24h || '0'),
        lastUpdated: Date.now(),
      };
    }
    
    return null;
  } catch (error: any) {
    console.error('Error fetching Raydium pool data:', error.message);
    
    // Fallback: Try alternative API or return mock data for development
    return {
      poolId: poolId,
      price: 0,
      liquidity: 0,
      volume24h: 0,
      priceChange24h: 0,
      lastUpdated: Date.now(),
    };
  }
};

// Get Vortex369 Talisman token price and stats
export const get369EternalStats = async (): Promise<Token369Stats> => {
  try {
    const poolData = await getRaydiumPoolData(TOKEN_369_POOL_ID);
    
    if (!poolData) {
      throw new Error('Failed to fetch Vortex369 Talisman pool data');
    }
    
    return {
      price: poolData.price,
      priceUsd: poolData.price.toFixed(6),
      liquidity: `$${(poolData.liquidity / 1000).toFixed(2)}K`,
      volume24h: `$${(poolData.volume24h / 1000).toFixed(2)}K`,
      change24h: `${poolData.priceChange24h >= 0 ? '+' : ''}${poolData.priceChange24h.toFixed(2)}%`,
      poolId: TOKEN_369_POOL_ID,
    };
  } catch (error: any) {
    console.error('Error getting Vortex369 Talisman stats:', error.message);
    
    // Return default values if API fails
    return {
      price: 0,
      priceUsd: '0.000000',
      liquidity: '$0K',
      volume24h: '$0K',
      change24h: '0.00%',
      poolId: TOKEN_369_POOL_ID,
    };
  }
};

// Get simple price for quick checks
export const get369EternalPrice = async (): Promise<number> => {
  try {
    const stats = await get369EternalStats();
    return stats.price;
  } catch (error) {
    console.error('Error getting Vortex369 Talisman price:', error);
    return 0;
  }
};
