import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Solana RPC endpoint (use mainnet-beta for production)
const SOLANA_RPC = process.env.SOLANA_RPC_URL || clusterApiUrl('mainnet-beta');

// 369 Eternal Token Mint Address
// Note: This is a placeholder. Update with the actual token mint address from Raydium pool
// Pool ID: 69Jiph4XhmJhX8LoGi97iH6G2jR8NDyGzEQDTWrNA5Lm
export const TOKEN_369_MINT = '369EternalTokenMintAddressHere'; // TODO: Get actual mint from pool data

// Create Solana connection
export const getSolanaConnection = (): Connection => {
  return new Connection(SOLANA_RPC, 'confirmed');
};

// Get SOL balance for a wallet
export const getSolBalance = async (walletAddress: string): Promise<number> => {
  try {
    const connection = getSolanaConnection();
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    
    // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
    return balance / 1_000_000_000;
  } catch (error: any) {
    console.error('Error fetching SOL balance:', error.message);
    return 0;
  }
};

// Get 369 token balance for a wallet
export const get369TokenBalance = async (walletAddress: string): Promise<number> => {
  try {
    const connection = getSolanaConnection();
    const publicKey = new PublicKey(walletAddress);
    
    // Get token accounts for this wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      mint: new PublicKey(TOKEN_369_MINT),
    });
    
    if (tokenAccounts.value.length === 0) {
      return 0;
    }
    
    // Get balance from first token account
    const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    return balance || 0;
  } catch (error: any) {
    console.error('Error fetching 369 token balance:', error.message);
    return 0;
  }
};

// Validate Solana wallet address
export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Get wallet info (SOL + 369 token balance)
export interface SolanaWalletInfo {
  address: string;
  solBalance: number;
  token369Balance: number;
  isValid: boolean;
}

export const getSolanaWalletInfo = async (walletAddress: string): Promise<SolanaWalletInfo> => {
  const isValid = isValidSolanaAddress(walletAddress);
  
  if (!isValid) {
    return {
      address: walletAddress,
      solBalance: 0,
      token369Balance: 0,
      isValid: false,
    };
  }
  
  try {
    const [solBalance, token369Balance] = await Promise.all([
      getSolBalance(walletAddress),
      get369TokenBalance(walletAddress),
    ]);
    
    return {
      address: walletAddress,
      solBalance,
      token369Balance,
      isValid: true,
    };
  } catch (error: any) {
    console.error('Error getting Solana wallet info:', error.message);
    return {
      address: walletAddress,
      solBalance: 0,
      token369Balance: 0,
      isValid: true,
    };
  }
};
