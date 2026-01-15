// Expense tracking service with localStorage persistence

const EXPENSES_KEY = 'dashboard_expenses';
const BALANCE_HISTORY_KEY = 'balance_history';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  walletId?: string;
}

export interface BalanceSnapshot {
  date: string;
  balance: number;
  walletId?: string;
}

// Categories for expenses
export const CATEGORIES = [
  { id: 'food', label: 'Food 🍔', icon: '🍔' },
  { id: 'entertainment', label: 'Entertainment 🎮', icon: '🎮' },
  { id: 'transport', label: 'Transport 🚗', icon: '🚗' },
  { id: 'utilities', label: 'Utilities ⚡', icon: '⚡' },
  { id: 'shopping', label: 'Shopping 🛒', icon: '🛒' },
  { id: 'crypto', label: 'Crypto/Gas 💎', icon: '💎' },
  { id: 'service-ripple', label: 'Service Ripple Budget 💝', icon: '💝' },
  { id: 'other', label: 'Other 📦', icon: '📦' },
];

// Get all expenses
export const getExpenses = (): Expense[] => {
  try {
    const stored = localStorage.getItem(EXPENSES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save expenses
const saveExpenses = (expenses: Expense[]): void => {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

// Add new expense
export const addExpense = (expense: Omit<Expense, 'id'>): Expense => {
  const expenses = getExpenses();
  const newExpense: Expense = {
    ...expense,
    id: `exp_${Date.now()}`,
  };
  expenses.unshift(newExpense);
  saveExpenses(expenses);
  return newExpense;
};

// Delete expense
export const deleteExpense = (id: string): void => {
  const expenses = getExpenses().filter(e => e.id !== id);
  saveExpenses(expenses);
};

// Get expenses by category (for charts)
export const getExpensesByCategory = (): { category: string; amount: number }[] => {
  const expenses = getExpenses();
  const categoryTotals: Record<string, number> = {};

  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));
};

// Get total expenses
export const getTotalExpenses = (): number => {
  return getExpenses().reduce((sum, exp) => sum + exp.amount, 0);
};

// Get expenses for current month
export const getCurrentMonthExpenses = (): Expense[] => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return getExpenses().filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });
};

// Balance History functions
export const getBalanceHistory = (): BalanceSnapshot[] => {
  try {
    const stored = localStorage.getItem(BALANCE_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addBalanceSnapshot = (balance: number, walletId?: string): void => {
  const history = getBalanceHistory();
  const today = new Date().toISOString().split('T')[0];
  
  // Update if same day exists, otherwise add
  const existingIndex = history.findIndex(h => h.date === today && h.walletId === walletId);
  
  if (existingIndex >= 0) {
    history[existingIndex].balance = balance;
  } else {
    history.push({ date: today, balance, walletId });
  }
  
  // Keep last 30 days
  const sorted = history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  localStorage.setItem(BALANCE_HISTORY_KEY, JSON.stringify(sorted.slice(0, 30)));
};

// Get last N days of balance history
export const getRecentBalanceHistory = (days: number = 7): BalanceSnapshot[] => {
  const history = getBalanceHistory();
  return history.slice(0, days).reverse();
};

// Generate sample data for demo
export const generateSampleData = (): void => {
  const sampleExpenses: Omit<Expense, 'id'>[] = [
    { amount: 45.50, category: 'food', description: 'Groceries', date: new Date().toISOString() },
    { amount: 12.99, category: 'entertainment', description: 'Netflix', date: new Date().toISOString() },
    { amount: 35.00, category: 'transport', description: 'Gas', date: new Date().toISOString() },
    { amount: 89.00, category: 'utilities', description: 'Electric bill', date: new Date().toISOString() },
    { amount: 150.00, category: 'shopping', description: 'New shoes', date: new Date().toISOString() },
    { amount: 25.00, category: 'crypto', description: 'Gas fees', date: new Date().toISOString() },
  ];

  sampleExpenses.forEach(exp => addExpense(exp));

  // Add sample balance history
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const balance = 1.5 + Math.random() * 0.5;
    const snapshot: BalanceSnapshot = {
      date: date.toISOString().split('T')[0],
      balance,
    };
    const history = getBalanceHistory();
    history.push(snapshot);
    localStorage.setItem(BALANCE_HISTORY_KEY, JSON.stringify(history));
  }
};
