import { BrowserProvider, formatEther } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Function to connect to MetaMask
export const connectMetaMask = async () => {
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const formattedBalance = formatEther(balance);
      return { address, balance: formattedBalance };
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  } else {
    throw new Error('MetaMask not installed');
  }
};

// Function to check if MetaMask is connected
export const isMetaMaskConnected = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0;
  }
  return false;
};
