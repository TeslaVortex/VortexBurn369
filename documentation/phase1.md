# Phase 1: Basic Setup – Super Detailed Guide 🛠️🚀

**Week 1 Goal**  
Build the basic skeleton of the Simple Dashboard. Make it run in your browser, show a nice home page, and let users log in with email or MetaMask.  

Why this phase matters? 🏗️  
It’s the strong foundation! If we skip good setup now, later steps get messy and slow. A clean start saves hours of fixing bugs later. Plus, early login means we can test wallet connections safely from day one!  

Let’s keep it simple and fun – step-by-step like building with Lego blocks. 😊  

## 1. Create the Project Folders 📁
Open your computer terminal (black screen for commands).  

Run these commands one by one:  
```bash
mkdir simple-dashboard
cd simple-dashboard
git init
```

Why? This makes a new folder and starts Git (so we can save versions and share on GitHub later).  

Create these folders inside:  
- `frontend/` → for pretty screens (React)  
- `backend/` → for safe data work (Node.js)  
- `docs/` → put this guide here!  

## 2. Set Up Frontend (React) 🎨
Go to frontend folder:  
```bash
cd frontend
npx create-react-app . --template typescript
```

Why TypeScript? It catches mistakes early – like a smart friend checking your spelling!  

Install extra helpful tools:  
```bash
npm install @web3auth/modal @web3auth/metamask-adapter
npm install axios chart.js react-chartjs-2
npm install tailwindcss postcss autoprefixer --save-dev
npx tailwindcss init -p
```

Why these?  
- Web3Auth: Easy and safe MetaMask login.  
- Axios: Talk to backend.  
- Chart.js: For pretty charts later.  
- Tailwind: Makes it look nice fast with simple classes.  

Configure Tailwind (edit `tailwind.config.js`):  
```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

Add to `src/index.css`:  
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 3. Set Up Backend (Node.js + Express) 🔧
Open new terminal, go to backend folder:  
```bash
cd ../backend
npm init -y
npm install express cors dotenv mongoose
npm install typescript ts-node-dev @types/express @types/cors --save-dev
npx tsc --init
```

Why these?  
- Express: Fast server.  
- Cors: Lets frontend talk to backend.  
- Dotenv: Keeps secrets safe.  
- Mongoose: Later for saving user data (if we add).  

Create `src/server.ts`:  
```ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is alive! 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🌟`);
});
```

Add to `package.json` scripts:  
```json
"scripts": {
  "dev": "ts-node-dev src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

## 4. Connect Frontend to Backend 🔗
In frontend, create `src/services/api.ts`:  
```ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default api;
```

Test it: In backend run `npm run dev`, in frontend run `npm start`. You should see React page!  

## 5. Add Simple Login Page 🔐
Create two ways to log in:  

### A. Email Login (Simple for now)  
Create `src/pages/Login.tsx` with nice form:  
- Email field  
- Password field (we’ll add real check later)  
- Big “Login” button  

Use Tailwind for pretty look: blue button, white card, emojis.  

### B. MetaMask Login (Web3Auth) 🦊
In `src/App.tsx`, add Web3Auth setup:  
```ts
import { Web3AuthModalPack } from '@web3auth/modal';
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector';
import { CHAIN_NAMESPACES } from '@web3auth/base';

const web3AuthPack = new Web3AuthModalPack({
  clientId: 'YOUR_WEB3AUTH_CLIENT_ID', // Get free from web3auth.io
  chainConfig: { chainNamespace: CHAIN_NAMESPACES.EIP155, chainId: '0x1' },
});
```

Add big orange “Connect MetaMask” button. When clicked, show user wallet address.  

Why both ways? Some people don’t have MetaMask yet – email makes it easy to start!  

## 6. Make Home Dashboard Page 🏠
Create `src/pages/Dashboard.tsx`  
Show:  
- Big welcome: “Hi! Ready to track money? 💰”  
- Empty chart spot (gray box for now)  
- Buttons: “Add Wallet” and “Set Budget” (grayed out until login)  

Use nice colors: green for good, red for alerts.  

## 7. Add Basic Routing 🗺️
Install router:  
```bash
npm install react-router-dom
```

Set up routes:  
- `/` → Login page  
- `/dashboard` → Home dashboard (only if logged in)  

## 8. Save Work & Share on GitHub 🌍
In main folder:  
```bash
git add .
git commit -m "Phase 1 complete: Basic setup with login"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/simple-dashboard.git
git push -u origin main
```

Add README.md with:  
- Project name  
- How to run (npm install, etc.)  
- “Open-source to help everyone track money free! ❤️”  

## 9. Test Checklist ✅ (Do these!)
- [ ] Frontend starts with `npm start`  
- [ ] Backend starts with `npm run dev`  
- [ ] Can login with fake email  
- [ ] Can connect MetaMask and see address  
- [ ] Dashboard page shows after login  
- [ ] No errors in console  

## End of Week 1 🎉
You now have a real app that runs, looks nice, and lets people log in!  

Next week we add real wallet connections.  

You got this! Questions? Just ask. 😊
