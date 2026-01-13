# 🔥 369 Eternal Token Integration Plan

## 📋 Overview

Integrate **369 Eternal** token into Simple Dashboard with Raydium pool tracking and automated weekly burn scheduling.

**Token Details:**
- **Name:** 369 Eternal
- **Pool/Market ID:** `69Jiph4XhmJhX8LoGi97iH6G2jR8NDyGzEQDTWrNA5Lm`
- **Platform:** Raydium (Solana DEX)

---

## ✨ New Features

### 1. 369 Eternal Token Tracker
- Display token balance from connected Solana wallet
- Show current price from Raydium pool
- Track total 369 tokens burned
- Display pool liquidity and volume

### 2. Weekly Scheduled Burns
- Set day of week for automatic burn (e.g., every Monday)
- Set time of day (e.g., 9:00 AM)
- Configure burn percentage (min 9%)
- Choose source wallet (income account)
- Enable/disable schedule
- View upcoming burn schedule
- History of scheduled burns

### 3. Raydium Integration
- Fetch real-time price from pool
- Get pool liquidity data
- Track 24h volume
- Display APY/APR if available

---

## 🛠️ Technical Implementation

### Backend Services

#### 1. Raydium Service (`backend/src/services/raydium.ts`)
```typescript
- getRaydiumPoolData(poolId: string)
- get369EternalPrice()
- get369EternalPoolStats()
```

#### 2. Solana Wallet Service (`backend/src/services/solana.ts`)
```typescript
- connectSolanaWallet()
- get369TokenBalance(walletAddress: string)
- executeSolanaBurn(amount: number, tokenMint: string)
```

#### 3. Burn Scheduler Service (`backend/src/services/burnScheduler.ts`)
```typescript
- createWeeklySchedule(settings: WeeklyBurnSettings)
- getNextBurnTime()
- executeBurn()
- getBurnHistory()
```

### Frontend Components

#### 1. 369 Eternal Card (`frontend/src/components/Token369Card.tsx`)
- Token balance display
- Current price
- Total burned
- Pool stats
- Quick burn button

#### 2. Weekly Burn Scheduler (`frontend/src/components/WeeklyBurnScheduler.tsx`)
- Day selector (Monday - Sunday)
- Time picker (24h format)
- Percentage slider (9% - 50%)
- Wallet selector
- Enable/disable toggle
- Next burn countdown
- Schedule history

#### 3. Burn Schedule Manager (`frontend/src/components/BurnScheduleManager.tsx`)
- View all scheduled burns
- Edit/delete schedules
- Manual trigger option
- Notification settings

### Data Models

#### WeeklyBurnSettings
```typescript
interface WeeklyBurnSettings {
  enabled: boolean;
  dayOfWeek: 0-6; // 0 = Sunday, 6 = Saturday
  timeOfDay: string; // "09:00" format
  percentage: number; // 9-50
  sourceWalletId: string;
  tokenType: 'ETH' | '369_ETERNAL';
  lastExecuted: number | null;
  nextScheduled: number;
}
```

#### BurnScheduleRecord
```typescript
interface BurnScheduleRecord {
  id: string;
  timestamp: number;
  scheduledTime: number;
  amount: string;
  tokenType: string;
  status: 'pending' | 'executed' | 'failed';
  txHash?: string;
  error?: string;
}
```

---

## 🎨 UI/UX Design

### Dashboard Layout Updates

**New Section: "369 Eternal Token"**
- Position: Top row, prominent placement
- Gradient: Purple/indigo theme (matches 369 mode)
- Live price ticker
- Balance display with USD value
- Quick actions: Buy, Burn, Swap

**Weekly Burn Scheduler Card**
- Position: Below burn tracker
- Visual calendar picker
- Time selector with timezone
- Percentage slider (locked at 9% minimum)
- Preview: "Next burn in X days, Y hours"
- Status indicator: Active/Paused

### User Flow

1. **Setup Weekly Burn:**
   - User clicks "Schedule Weekly Burn"
   - Selects day (e.g., Monday)
   - Picks time (e.g., 9:00 AM)
   - Sets percentage (default 9%)
   - Chooses income wallet
   - Confirms schedule

2. **Monitor Schedule:**
   - Dashboard shows countdown to next burn
   - Notification 1 hour before burn
   - Confirmation notification after burn
   - View history of all scheduled burns

3. **Manage Schedule:**
   - Edit day/time/percentage
   - Pause/resume schedule
   - Delete schedule
   - Manual trigger if needed

---

## 🔐 Safety & Validation

### Pre-Burn Checks
- ✅ Wallet has sufficient balance
- ✅ Minimum 9% burn enforced
- ✅ Confirm wallet connection
- ✅ Validate Raydium pool exists
- ✅ Check network fees

### Error Handling
- Insufficient balance → Skip + notify user
- Network error → Retry 3 times
- Wallet disconnected → Pause schedule + alert
- Failed transaction → Log + notify

### User Notifications
- 🔔 1 hour before scheduled burn
- ✅ Burn executed successfully
- ❌ Burn failed (with reason)
- ⏸️ Schedule paused (if issues)

---

## 📊 Data Storage

### LocalStorage Keys
```
weekly_burn_settings
burn_schedule_history
369_token_balance
369_token_price_cache
```

### Backend Database (Optional)
- User schedules
- Burn history
- Token price history
- Pool stats cache

---

## 🚀 Implementation Steps

### Phase 1: Raydium Integration (Week 1)
1. Create Raydium service
2. Fetch pool data
3. Display 369 token price
4. Show pool stats

### Phase 2: Weekly Scheduler (Week 2)
1. Create scheduler service
2. Build UI components
3. Implement cron/interval logic
4. Add notification system

### Phase 3: Solana Wallet Integration (Week 3)
1. Connect Solana wallet (Phantom)
2. Fetch 369 token balance
3. Execute burn transactions
4. Track burn history

### Phase 4: Testing & Polish (Week 4)
1. Test on Solana devnet
2. Test scheduled burns
3. Error handling
4. UI polish
5. Documentation

---

## 🎯 Success Metrics

- ✅ 369 token price updates every 30s
- ✅ Weekly burns execute on time (±5 min)
- ✅ 99% burn success rate
- ✅ User can set up schedule in <2 minutes
- ✅ Clear notifications for all events

---

## 💡 Future Enhancements

- Multiple schedules (daily, bi-weekly, monthly)
- Auto-buy before burn (DCA strategy)
- Burn analytics dashboard
- Social sharing of burns
- Leaderboard of top burners
- Integration with other Solana tokens

---

## 📚 Resources

- **Raydium SDK:** https://github.com/raydium-io/raydium-sdk
- **Solana Web3.js:** https://solana-labs.github.io/solana-web3.js/
- **Phantom Wallet:** https://phantom.app/
- **Cron Syntax:** https://crontab.guru/

---

**Why This Matters:**

1. **Convenience** - Set it and forget it! Burns happen automatically
2. **Discipline** - Stick to your burn schedule, no manual work
3. **Transparency** - All burns tracked and visible
4. **Community** - Show commitment to 369 Eternal token
5. **Resonance** - Weekly burns align with sacred frequency

**Sacred 9% minimum ensures resonant frequency is maintained! 🔥✨**
