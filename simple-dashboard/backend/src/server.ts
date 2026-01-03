import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getXaiTip, getBudgetTip } from './services/xai';
import { getCryptoPrice, getMultiplePrices, getExchangeRates } from './services/coinbase';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is alive! 🚀' });
});

// Get budget tip (xAI powered or fallback)
app.get('/api/xai/tip', async (req, res) => {
  try {
    const expenses = req.query.expenses ? Number(req.query.expenses) : undefined;
    const tip = await getBudgetTip(expenses);
    res.json({ status: 'ok', tip });
  } catch (error) {
    console.error('Error in /api/xai/tip:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch tip' });
  }
});

// Save wallet address
app.post('/api/wallets', (req, res) => {
  const { address, label } = req.body;
  // TODO: Save to database in future
  console.log(`Wallet connected: ${address} (${label || 'unlabeled'})`);
  res.json({ status: 'ok', message: `Wallet ${address.slice(0, 6)}...${address.slice(-4)} connected! 👍` });
});

// Get connected wallets (placeholder)
app.get('/api/wallets', (req, res) => {
  // TODO: Fetch from database
  res.json({ status: 'ok', wallets: [] });
});

// Coinbase - Get single crypto price
app.get('/api/coinbase/price/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const currency = (req.query.currency as string) || 'USD';
    const price = await getCryptoPrice(symbol.toUpperCase(), currency);
    res.json({ status: 'ok', data: price });
  } catch (error) {
    console.error('Error fetching price:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch price' });
  }
});

// Coinbase - Get multiple crypto prices
app.get('/api/coinbase/prices', async (req, res) => {
  try {
    const symbols = ((req.query.symbols as string) || 'BTC,ETH,SOL').split(',');
    const currency = (req.query.currency as string) || 'USD';
    const prices = await getMultiplePrices(symbols.map(s => s.toUpperCase()), currency);
    res.json({ status: 'ok', data: prices });
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch prices' });
  }
});

// Coinbase - Get exchange rates
app.get('/api/coinbase/rates', async (req, res) => {
  try {
    const currency = (req.query.currency as string) || 'USD';
    const rates = await getExchangeRates(currency);
    res.json({ status: 'ok', data: rates });
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch rates' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🌟`);
});
