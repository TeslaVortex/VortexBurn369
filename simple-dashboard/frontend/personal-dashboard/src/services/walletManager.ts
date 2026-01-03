import { connectMetaMask, isMetaMaskConnected } from './metamask';

export interface Wallet {
  id: string;
  address: string;
  balance: string;
  label: string;
  type: 'metamask' | 'coinbase' | 'manual';
  isConnected: boolean;
}

const STORAGE_KEY = 'dashboard_wallets';

// Get wallets from local storage
export const getStoredWallets = (): Wallet[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save wallets to local storage
export const saveWallets = (wallets: Wallet[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
};

// Add a new wallet
export const addWallet = (wallet: Omit<Wallet, 'id'>): Wallet => {
  const wallets = getStoredWallets();
  const newWallet: Wallet = {
    ...wallet,
    id: `wallet_${Date.now()}`,
  };
  wallets.push(newWallet);
  saveWallets(wallets);
  return newWallet;
};

// Remove a wallet
export const removeWallet = (id: string): void => {
  const wallets = getStoredWallets().filter(w => w.id !== id);
  saveWallets(wallets);
};

// Update wallet label
export const updateWalletLabel = (id: string, label: string): void => {
  const wallets = getStoredWallets().map(w => 
    w.id === id ? { ...w, label } : w
  );
  saveWallets(wallets);
};

// Connect MetaMask and add to wallets
export const connectAndAddMetaMask = async (): Promise<Wallet> => {
  const { address, balance } = await connectMetaMask();
  
  // Check if wallet already exists
  const existing = getStoredWallets().find(w => w.address.toLowerCase() === address.toLowerCase());
  if (existing) {
    // Update balance and return existing
    const wallets = getStoredWallets().map(w => 
      w.address.toLowerCase() === address.toLowerCase() 
        ? { ...w, balance, isConnected: true }
        : w
    );
    saveWallets(wallets);
    return wallets.find(w => w.address.toLowerCase() === address.toLowerCase())!;
  }

  // Add new wallet
  return addWallet({
    address,
    balance,
    label: 'MetaMask Wallet',
    type: 'metamask',
    isConnected: true,
  });
};

// Add manual wallet address (watch-only)
export const addManualWallet = (address: string, label: string = 'Watch Wallet'): Wallet => {
  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid Ethereum address');
  }

  // Check if already exists
  const existing = getStoredWallets().find(w => w.address.toLowerCase() === address.toLowerCase());
  if (existing) {
    throw new Error('Wallet already added');
  }

  return addWallet({
    address,
    balance: '0',
    label,
    type: 'manual',
    isConnected: false,
  });
};

// Get total balance across all wallets
export const getTotalBalance = (): string => {
  const wallets = getStoredWallets();
  const total = wallets.reduce((sum, w) => sum + parseFloat(w.balance || '0'), 0);
  return total.toFixed(4);
};

// Check and update MetaMask connection status
export const refreshWalletStatus = async (): Promise<Wallet[]> => {
  const wallets = getStoredWallets();
  const isConnected = await isMetaMaskConnected();
  
  const updated = wallets.map(w => ({
    ...w,
    isConnected: w.type === 'metamask' ? isConnected : w.isConnected,
  }));
  
  saveWallets(updated);
  return updated;
};
