import React, { useState, useEffect } from 'react';
import { connectMetaMask, isMetaMaskConnected } from '../services/metamask';

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [metaMaskAddress, setMetaMaskAddress] = useState<string | null>(null);
  const [metaMaskBalance, setMetaMaskBalance] = useState<string | null>(null);
  const [metaMaskError, setMetaMaskError] = useState<string | null>(null);

  useEffect(() => {
    const checkMetaMask = async () => {
      if (await isMetaMaskConnected()) {
        try {
          const { address, balance } = await connectMetaMask();
          setMetaMaskAddress(address);
          setMetaMaskBalance(balance);
          onLogin(); // Automatically log in if MetaMask is connected
        } catch (err) {
          setMetaMaskError('Failed to connect to MetaMask');
        }
      }
    };
    checkMetaMask();
  }, [onLogin]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for actual login logic
    console.log('Login attempt with:', { email, password });
    alert('Login functionality will be implemented later.');
    onLogin(); // Call the onLogin function to simulate login
  };

  const handleMetaMaskConnect = async () => {
    try {
      setMetaMaskError(null);
      const { address, balance } = await connectMetaMask();
      setMetaMaskAddress(address);
      setMetaMaskBalance(balance);
      onLogin(); // Log in after successful MetaMask connection
    } catch (err) {
      setMetaMaskError('Failed to connect to MetaMask. Please ensure MetaMask is installed and unlocked.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account 💻</h2>
          {metaMaskAddress && (
            <p className="mt-2 text-center text-sm text-green-600">Connected to MetaMask: {metaMaskAddress.slice(0, 6)}...{metaMaskAddress.slice(-4)} (Balance: {metaMaskBalance} ETH)</p>
          )}
          {metaMaskError && (
            <p className="mt-2 text-center text-sm text-red-600">{metaMaskError}</p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address ✉️"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password 🔒"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in 🚀
            </button>
          </div>

          <div className="text-sm text-center">
            <button
              type="button"
              onClick={handleMetaMaskConnect}
              className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Connect MetaMask 🦊
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
