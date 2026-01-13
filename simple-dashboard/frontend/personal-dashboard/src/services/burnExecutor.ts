// Automatic Burn Executor
// Checks for scheduled burns and executes them automatically

import {
  getWeeklyBurnSettings,
  shouldExecuteBurn,
  markBurnExecuted,
  addBurnScheduleRecord,
  WeeklyBurnSettings,
} from './weeklyBurnScheduler';
import { executeBurn, getBurnAddress } from './burnService';
import { getStoredWallets } from './walletManager';
import { notifySuccess, notifyError, notifyWarning, notifyBurn } from '../utils/notifications';

// Check if burn should execute and do it
export const checkAndExecuteBurn = async (): Promise<boolean> => {
  const settings = getWeeklyBurnSettings();
  
  if (!shouldExecuteBurn(settings)) {
    return false;
  }

  console.log('🔥 Scheduled burn time reached! Executing...');
  
  // Validate settings
  if (!settings.sourceWalletId) {
    console.error('No source wallet selected');
    notifyError('Scheduled burn failed: No wallet selected');
    addBurnScheduleRecord({
      scheduledTime: settings.nextScheduled,
      amount: '0',
      tokenType: settings.tokenType,
      status: 'failed',
      error: 'No source wallet selected',
    });
    return false;
  }

  // Get wallet
  const wallets = getStoredWallets();
  const wallet = wallets.find(w => w.id === settings.sourceWalletId);
  
  if (!wallet) {
    console.error('Source wallet not found');
    notifyError('Scheduled burn failed: Wallet not found');
    addBurnScheduleRecord({
      scheduledTime: settings.nextScheduled,
      amount: '0',
      tokenType: settings.tokenType,
      status: 'failed',
      error: 'Wallet not found',
    });
    return false;
  }

  try {
    // Calculate burn amount (placeholder - needs actual balance)
    const balance = parseFloat(wallet.balance || '0');
    const burnAmount = (balance * settings.percentage / 100).toFixed(6);
    
    if (balance <= 0) {
      console.warn('Insufficient balance for scheduled burn');
      notifyWarning('Scheduled burn skipped: Insufficient balance');
      addBurnScheduleRecord({
        scheduledTime: settings.nextScheduled,
        amount: burnAmount,
        tokenType: settings.tokenType,
        status: 'skipped',
        error: 'Insufficient balance',
      });
      markBurnExecuted(settings);
      return false;
    }

    // Show notification before burn
    notifyWarning(`Executing scheduled burn: ${burnAmount} ${settings.tokenType}`);

    // Execute burn based on token type
    let txHash: string;
    
    if (settings.tokenType === 'ETH') {
      txHash = await executeBurn(burnAmount);
    } else if (settings.tokenType === '369_ETERNAL') {
      // TODO: Implement 369 token burn
      throw new Error('369 Eternal burn not yet implemented');
    } else if (settings.tokenType === 'SOL') {
      // TODO: Implement SOL burn
      throw new Error('SOL burn not yet implemented');
    } else {
      throw new Error('Unknown token type');
    }

    // Success!
    console.log('✅ Scheduled burn executed successfully:', txHash);
    notifyBurn(burnAmount);
    
    addBurnScheduleRecord({
      scheduledTime: settings.nextScheduled,
      amount: burnAmount,
      tokenType: settings.tokenType,
      status: 'executed',
      txHash,
    });
    
    markBurnExecuted(settings);
    return true;
    
  } catch (error: any) {
    console.error('Error executing scheduled burn:', error);
    notifyError(`Scheduled burn failed: ${error.message}`);
    
    addBurnScheduleRecord({
      scheduledTime: settings.nextScheduled,
      amount: '0',
      tokenType: settings.tokenType,
      status: 'failed',
      error: error.message,
    });
    
    return false;
  }
};

// Start automatic burn checker (runs every minute)
export const startBurnChecker = (): NodeJS.Timeout => {
  console.log('🔥 Starting automatic burn checker...');
  
  // Check immediately
  checkAndExecuteBurn();
  
  // Then check every minute
  const interval = setInterval(() => {
    checkAndExecuteBurn();
  }, 60 * 1000); // 60 seconds
  
  return interval;
};

// Stop automatic burn checker
export const stopBurnChecker = (interval: NodeJS.Timeout): void => {
  clearInterval(interval);
  console.log('🔥 Stopped automatic burn checker');
};

// Get time until next check (1 minute)
export const getNextCheckTime = (): Date => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  now.setSeconds(0);
  return now;
};
