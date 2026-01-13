import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './Login';
import Dashboard from './Dashboard';
import { isMetaMaskConnected } from '../services/metamask';
import LoadingSpinner from '../components/LoadingSpinner';
import { startBurnChecker, stopBurnChecker } from '../services/burnExecutor';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const checkMetaMask = async () => {
      const connected = await isMetaMaskConnected();
      setIsLoggedIn(connected);
      setLoading(false);
    };
    checkMetaMask();
  }, []);

  // Start automatic burn checker when app loads
  useEffect(() => {
    const interval = startBurnChecker();
    return () => stopBurnChecker(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" text="Loading Simple Dashboard..." />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
