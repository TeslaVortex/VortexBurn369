import { BrowserProvider, parseEther, formatEther } from 'ethers';

// Burn addresses
export const BURN_ADDRESS_DEAD = '0x000000000000000000000000000000000000dEaD';
export const BURN_ADDRESS_369 = '0x0000000000000000000000000000000000000369';

// Get active burn address based on 369 mode
export const getBurnAddress = (): string => {
  const settings = getBurnSettings();
  return settings.resonant369Mode ? BURN_ADDRESS_369 : BURN_ADDRESS_DEAD;
};

// Burn settings stored in localStorage
const BURN_SETTINGS_KEY = 'burn_settings';
const BURN_HISTORY_KEY = 'burn_history';

export interface BurnSettings {
  enabled: boolean;
  percentage: number; // Default 9%
  incomeWalletId: string | null;
  resonant369Mode: boolean; // Use torus-coded null address
}

export interface BurnRecord {
  id: string;
  timestamp: number;
  amount: string;
  txHash: string;
  incomeAmount: string;
}

// Get burn settings
export const getBurnSettings = (): BurnSettings => {
  try {
    const stored = localStorage.getItem(BURN_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading burn settings:', e);
  }
  return {
    enabled: false,
    percentage: 9,
    incomeWalletId: null,
    resonant369Mode: true, // Default to 369 mode
  };
};

// Save burn settings
export const saveBurnSettings = (settings: BurnSettings): void => {
  localStorage.setItem(BURN_SETTINGS_KEY, JSON.stringify(settings));
};

// Get burn history
export const getBurnHistory = (): BurnRecord[] => {
  try {
    const stored = localStorage.getItem(BURN_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Add burn record to history
export const addBurnRecord = (record: Omit<BurnRecord, 'id'>): void => {
  const history = getBurnHistory();
  history.unshift({
    ...record,
    id: `burn_${Date.now()}`,
  });
  // Keep only last 50 records
  localStorage.setItem(BURN_HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
};

// Calculate total burned
export const getTotalBurned = (): string => {
  const history = getBurnHistory();
  const total = history.reduce((sum, record) => sum + parseFloat(record.amount), 0);
  return total.toFixed(6);
};

// Execute burn transaction
export const executeBurn = async (amountInEther: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const burnAddress = getBurnAddress();

  const tx = {
    to: burnAddress,
    value: parseEther(amountInEther),
  };

  console.log(`🔥 Burning ${amountInEther} ETH to ${burnAddress}`);
  
  const txResponse = await signer.sendTransaction(tx);
  console.log('Burn transaction sent:', txResponse.hash);
  
  await txResponse.wait();
  console.log('Burn confirmed! 🔥');

  return txResponse.hash;
};

// Calculate burn amount from income
export const calculateBurnAmount = (incomeAmount: number, percentage: number = 9): string => {
  const burnAmount = incomeAmount * (percentage / 100);
  return burnAmount.toFixed(6);
};

// Auto-burn handler (call this when income is detected)
export const handleAutoBurn = async (incomeAmount: number): Promise<BurnRecord | null> => {
  const settings = getBurnSettings();
  
  if (!settings.enabled || incomeAmount <= 0) {
    return null;
  }

  const burnAmountStr = calculateBurnAmount(incomeAmount, settings.percentage);
  const burnAmount = parseFloat(burnAmountStr);

  // Don't burn if amount is too small (gas would cost more)
  if (burnAmount < 0.0001) {
    console.log('Burn amount too small, skipping');
    return null;
  }

  try {
    const txHash = await executeBurn(burnAmountStr);
    
    const record: Omit<BurnRecord, 'id'> = {
      timestamp: Date.now(),
      amount: burnAmountStr,
      txHash,
      incomeAmount: incomeAmount.toString(),
    };
    
    addBurnRecord(record);
    
    return {
      ...record,
      id: `burn_${Date.now()}`,
    };
  } catch (error) {
    console.error('Auto-burn failed:', error);
    throw error;
  }
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
