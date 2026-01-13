// Weekly Burn Scheduler Service
// Manages scheduled burns that execute automatically on a weekly basis

export interface WeeklyBurnSettings {
  enabled: boolean;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  timeOfDay: string; // "09:00" format (24h)
  percentage: number; // 9-50
  sourceWalletId: string;
  tokenType: 'ETH' | '369_ETERNAL' | 'SOL';
  lastExecuted: number | null;
  nextScheduled: number;
}

export interface BurnScheduleRecord {
  id: string;
  timestamp: number;
  scheduledTime: number;
  amount: string;
  tokenType: string;
  status: 'pending' | 'executed' | 'failed' | 'skipped';
  txHash?: string;
  error?: string;
}

const WEEKLY_BURN_SETTINGS_KEY = 'weekly_burn_settings';
const BURN_SCHEDULE_HISTORY_KEY = 'burn_schedule_history';

// Get weekly burn settings
export const getWeeklyBurnSettings = (): WeeklyBurnSettings => {
  try {
    const stored = localStorage.getItem(WEEKLY_BURN_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading weekly burn settings:', e);
  }
  
  // Default settings
  return {
    enabled: false,
    dayOfWeek: 1, // Monday
    timeOfDay: '09:00',
    percentage: 9,
    sourceWalletId: '',
    tokenType: 'ETH',
    lastExecuted: null,
    nextScheduled: calculateNextBurnTime(1, '09:00'),
  };
};

// Save weekly burn settings
export const saveWeeklyBurnSettings = (settings: WeeklyBurnSettings): void => {
  // Recalculate next scheduled time
  settings.nextScheduled = calculateNextBurnTime(settings.dayOfWeek, settings.timeOfDay);
  localStorage.setItem(WEEKLY_BURN_SETTINGS_KEY, JSON.stringify(settings));
};

// Calculate next burn time based on day and time
export const calculateNextBurnTime = (dayOfWeek: number, timeOfDay: string): number => {
  const now = new Date();
  const [hours, minutes] = timeOfDay.split(':').map(Number);
  
  // Create target date for this week
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);
  
  // Calculate days until target day
  const currentDay = now.getDay();
  let daysUntil = dayOfWeek - currentDay;
  
  // If target day has passed this week, schedule for next week
  if (daysUntil < 0 || (daysUntil === 0 && now.getTime() > target.getTime())) {
    daysUntil += 7;
  }
  
  target.setDate(target.getDate() + daysUntil);
  
  return target.getTime();
};

// Get time until next burn (in milliseconds)
export const getTimeUntilNextBurn = (settings: WeeklyBurnSettings): number => {
  const now = Date.now();
  return Math.max(0, settings.nextScheduled - now);
};

// Format time until next burn (human readable)
export const formatTimeUntilBurn = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  } else if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return 'Less than 1 minute';
  }
};

// Get day name from number
export const getDayName = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || 'Unknown';
};

// Get burn schedule history
export const getBurnScheduleHistory = (): BurnScheduleRecord[] => {
  try {
    const stored = localStorage.getItem(BURN_SCHEDULE_HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading burn schedule history:', e);
  }
  return [];
};

// Add burn schedule record
export const addBurnScheduleRecord = (record: Omit<BurnScheduleRecord, 'id' | 'timestamp'>): void => {
  const history = getBurnScheduleHistory();
  const newRecord: BurnScheduleRecord = {
    ...record,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  
  history.unshift(newRecord);
  
  // Keep only last 50 records
  if (history.length > 50) {
    history.splice(50);
  }
  
  localStorage.setItem(BURN_SCHEDULE_HISTORY_KEY, JSON.stringify(history));
};

// Update burn schedule record status
export const updateBurnScheduleRecord = (id: string, updates: Partial<BurnScheduleRecord>): void => {
  const history = getBurnScheduleHistory();
  const index = history.findIndex(r => r.id === id);
  
  if (index !== -1) {
    history[index] = { ...history[index], ...updates };
    localStorage.setItem(BURN_SCHEDULE_HISTORY_KEY, JSON.stringify(history));
  }
};

// Check if burn should execute now
export const shouldExecuteBurn = (settings: WeeklyBurnSettings): boolean => {
  if (!settings.enabled) return false;
  
  const now = Date.now();
  const timeSinceScheduled = now - settings.nextScheduled;
  
  // Execute if within 5 minutes of scheduled time
  return timeSinceScheduled >= 0 && timeSinceScheduled < 5 * 60 * 1000;
};

// Mark burn as executed and schedule next one
export const markBurnExecuted = (settings: WeeklyBurnSettings): void => {
  settings.lastExecuted = Date.now();
  settings.nextScheduled = calculateNextBurnTime(settings.dayOfWeek, settings.timeOfDay);
  saveWeeklyBurnSettings(settings);
};

// Clear all schedule history
export const clearScheduleHistory = (): void => {
  localStorage.removeItem(BURN_SCHEDULE_HISTORY_KEY);
};
