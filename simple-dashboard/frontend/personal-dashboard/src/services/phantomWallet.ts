// Phantom Wallet Integration for Solana
// Connects to Phantom wallet for Solana transactions

export interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (transaction: any) => Promise<{ signature: string }>;
  publicKey: { toString: () => string } | null;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

// Check if Phantom is installed
export const isPhantomInstalled = (): boolean => {
  return typeof window !== 'undefined' && window.solana?.isPhantom === true;
};

// Connect to Phantom wallet
export const connectPhantom = async (): Promise<string> => {
  if (!isPhantomInstalled()) {
    throw new Error('Phantom wallet not installed. Please install from phantom.app');
  }

  try {
    const response = await window.solana!.connect();
    const address = response.publicKey.toString();
    console.log('Connected to Phantom:', address);
    return address;
  } catch (error: any) {
    console.error('Error connecting to Phantom:', error);
    throw new Error('Failed to connect to Phantom wallet');
  }
};

// Disconnect from Phantom
export const disconnectPhantom = async (): Promise<void> => {
  if (!isPhantomInstalled()) {
    return;
  }

  try {
    await window.solana!.disconnect();
    console.log('Disconnected from Phantom');
  } catch (error: any) {
    console.error('Error disconnecting from Phantom:', error);
  }
};

// Get connected Phantom address
export const getPhantomAddress = (): string | null => {
  if (!isPhantomInstalled() || !window.solana?.publicKey) {
    return null;
  }

  return window.solana.publicKey.toString();
};

// Check if Phantom is connected
export const isPhantomConnected = (): boolean => {
  return getPhantomAddress() !== null;
};

// Sign and send transaction
export const signAndSendTransaction = async (transaction: any): Promise<string> => {
  if (!isPhantomInstalled()) {
    throw new Error('Phantom wallet not installed');
  }

  if (!isPhantomConnected()) {
    throw new Error('Phantom wallet not connected');
  }

  try {
    const { signature } = await window.solana!.signAndSendTransaction(transaction);
    console.log('Transaction sent:', signature);
    return signature;
  } catch (error: any) {
    console.error('Error sending transaction:', error);
    throw new Error('Failed to send transaction');
  }
};
