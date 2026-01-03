import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getXaiTip, getBudgetTip } from './services/xai';

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🌟`);
});
