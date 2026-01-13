import React, { useState, useEffect } from 'react';
import { 
  isPhantomInstalled, 
  connectPhantom, 
  disconnectPhantom, 
  getPhantomAddress,
  isPhantomConnected 
} from '../services/phantomWallet';
import { notifySuccess, notifyError, notifyWalletConnected } from '../utils/notifications';

function PhantomWalletButton() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (isPhantomConnected()) {
      setConnected(true);
      setAddress(getPhantomAddress());
    }
  }, []);

  const handleConnect = async () => {
    if (!isPhantomInstalled()) {
      notifyError('Phantom wallet not installed. Visit phantom.app to install.');
      window.open('https://phantom.app/', '_blank');
      return;
    }

    setConnecting(true);
    try {
      const addr = await connectPhantom();
      setConnected(true);
      setAddress(addr);
      notifyWalletConnected(addr);
    } catch (error: any) {
      notifyError(`Failed to connect: ${error.message}`);
    }
    setConnecting(false);
  };

  const handleDisconnect = async () => {
    try {
      await disconnectPhantom();
      setConnected(false);
      setAddress(null);
      notifySuccess('Phantom wallet disconnected');
    } catch (error: any) {
      notifyError(`Failed to disconnect: ${error.message}`);
    }
  };

  if (!isPhantomInstalled()) {
    return (
      <button
        onClick={() => window.open('https://phantom.app/', '_blank')}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
      >
        <span>👻</span>
        <span>Install Phantom</span>
      </button>
    );
  }

  if (connected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">
          <span className="text-xs font-medium">
            👻 {address.slice(0, 4)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition disabled:opacity-50"
    >
      <span>👻</span>
      <span>{connecting ? 'Connecting...' : 'Connect Phantom'}</span>
    </button>
  );
}

export default PhantomWalletButton;
