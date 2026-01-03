# Phase 2: Add Connections – Super Detailed Guide 🔗🚀

**Weeks 2-3 Goal**  
Connect the dashboard to cool tools like MetaMask, xAI API, Uniswap, and Coinbase. This pulls real-time money data automatically – like magic!  

Why this phase matters? 🪄  
Without connections, the dashboard is just a pretty page. Adding these makes it alive: see your wallet balances, get smart tips, and track trades without typing. Super practical for busy people – saves time, stops mistakes, and helps spot spending patterns fast. In crypto world, prices change quick, so auto-updates keep you safe and smart! Plus, it's fun to see numbers update live. 😎  

We'll build step by step, like adding puzzle pieces. Use simple code – copy-paste ready!  

## 1. Get Ready (Quick Check) 📋
Make sure Phase 1 works: Run frontend (`npm start`) and backend (`npm run dev`). Login with MetaMask should show your wallet address.  

Install extra tools if needed:  
In frontend folder:  
```bash
npm install ethers @uniswap/sdk @coinbase/coinbase-sdk
npm install @types/ethers --save-dev
```

In backend (for safe API calls):  
```bash
npm install axios web3
```

Why these?  
- Ethers: Talks to MetaMask and blockchain.  
- Uniswap SDK: Helps with swaps.  
- Coinbase SDK: Pulls exchange data.  
- Axios/Web3: Safe way to fetch info.  

Create a `.env` file in backend for secrets (like API keys). Never share these! Add to `.gitignore` so Git skips it.  

## 2. Connect MetaMask Deeper 🦊
We have basic login from Phase 1. Now pull real wallet info like balance and transactions.  

### A. Frontend Side (Show Data) 🎨  
In `src/services/walletService.ts`:  
```ts
import { ethers } from 'ethers';

export const connectMetaMask = async () => {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    return { address, balance: ethers.formatEther(balance) };
  } else {
    throw new Error('MetaMask not found! 😢');
  }
};
```

In `src/pages/Dashboard.tsx`, add a button:  
```tsx
import { connectMetaMask } from '../services/walletService';

const Dashboard = () => {
  const [walletInfo, setWalletInfo] = useState(null);

  const handleConnect = async () => {
    try {
      const info = await connectMetaMask();
      setWalletInfo(info);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <button onClick={handleConnect} className="bg-orange-500 text-white p-2 rounded">Connect MetaMask 🦊</button>
      {walletInfo && (
        <div>
          <p>Address: {walletInfo.address} 📍</p>
          <p>Balance: {walletInfo.balance} ETH 💰</p>
        </div>
      )}
    </div>
  );
};
```

### B. Backend Side (Safe Storage) 🔧  
For now, send wallet address to backend for saving (later for budgets). In `src/server.ts`:  
```ts
app.post('/api/wallets', (req, res) => {
  const { address } = req.body;
  // Save to DB later – for now, just echo
  res.json({ message: `Wallet ${address} connected! 👍` });
});
```

Why important? MetaMask is the door to crypto – this lets users see real money without manual entry. Practical for tracking expenses like gas fees!  

## 3. Add xAI API 🤖
xAI API gives smart tips, like budget advice. (Assume it's like Grok API – in 2026, it's public!)  

### A. Get API Key  
Sign up at xAI.com/api (free for basics). Add to `.env`: `XAI_API_KEY=your-key-here`  

### B. Backend Integration  
In `src/services/xaiService.ts` (new file):  
```ts
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getBudgetTip = async (expenses: number) => {
  try {
    const response = await axios.post('https://api.xai.com/v1/tips', {
      query: `Give budget tip for ${expenses} spent.`,
    }, {
      headers: { Authorization: `Bearer ${process.env.XAI_API_KEY}` }
    });
    return response.data.tip;
  } catch (error) {
    return 'Tip: Save more! 💡';
  }
};
```

Add endpoint in `server.ts`:  
```ts
app.get('/api/tip', async (req, res) => {
  const tip = await getBudgetTip(100); // Test with fake number
  res.json({ tip });
});
```

### C. Frontend Call  
In Dashboard.tsx: Add a button to fetch tip via API (use axios to call backend).  

Why important? xAI makes it smart – like having a robot friend say "Hey, cut coffee spends ☕!" Helps users make better choices easily.  

## 4. Connect Uniswap 🔄
For tracking swaps as expenses.  

### A. Install & Setup  
Already installed SDK. Add to `.env`: No key needed for reads!  

### B. Frontend for Swaps  
In `walletService.ts`, add:  
```ts
import { Trade, Token, CurrencyAmount } from '@uniswap/sdk';

export const getSwapQuote = async (amount: string, tokenIn: string, tokenOut: string) => {
  // Simple example – fetch quote
  const provider = new ethers.BrowserProvider(window.ethereum);
  // Build trade logic here (use Uniswap docs for full)
  return { estimatedOut: '1.5' }; // Fake for now
};
```

Show in dashboard: Button "Get Swap Quote" – input amounts, show as expense.  

### C. Backend for History  
Use Web3 to fetch past swaps.  

Why important? Uniswap is for decentralized trades – tracks costs like "Swapped 1 ETH for USDC, cost 0.01 ETH fee." Practical for full budget view!  

## 5. Connect Coinbase 📈
Pull balances and trades.  

### A. Get API Key  
From coinbase.com/developer – add to `.env`: `COINBASE_API_KEY=your-key`  

### B. Backend Fetch  
In new `coinbaseService.ts`:  
```ts
import { Coinbase } from '@coinbase/coinbase-sdk';

const coinbase = new Coinbase({ apiKey: process.env.COINBASE_API_KEY });

export const getBalance = async () => {
  const accounts = await coinbase.getAccounts();
  return accounts[0].balance; // Simple example
};
```

Endpoint: `/api/coinbase/balance`  

### C. Frontend Display  
Add button in dashboard to show Coinbase balance next to MetaMask.  

Why important? Coinbase is trusted for buys/sells – combines with wallets for one-view tracking. No more app-switching!  

## 6. Make Multiple Wallets Work 👛
Update dashboard to list all connections: MetaMask, Coinbase as "wallets." Button to add/label them.  

## 7. Test Checklist ✅
- [ ] Connect MetaMask: See balance update live.  
- [ ] xAI Tip: Get a fun message.  
- [ ] Uniswap: Fake quote shows.  
- [ ] Coinbase: Balance appears.  
- [ ] No errors – check console.  
- [ ] Commit to Git: `git commit -m "Phase 2: Connections added!"`  

## End of Weeks 2-3 🎉
Now your dashboard talks to the world! Data flows auto – super practical for real use. Next: Features like burn and charts.  

You rock! Questions? Ask. 😊
