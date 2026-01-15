import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Pie, Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Expense categories with colors
export const EXPENSE_CATEGORIES = {
  food: { label: 'Food 🍔', color: '#FF6384' },
  entertainment: { label: 'Entertainment 🎮', color: '#36A2EB' },
  transport: { label: 'Transport 🚗', color: '#FFCE56' },
  utilities: { label: 'Utilities ⚡', color: '#4BC0C0' },
  shopping: { label: 'Shopping 🛒', color: '#9966FF' },
  crypto: { label: 'Crypto 💎', color: '#FF9F40' },
  'service-ripple': { label: 'Service Ripple 💝', color: '#FF69B4' },
  other: { label: 'Other 📦', color: '#C9CBCF' },
};

interface ExpenseData {
  category: string;
  amount: number;
}

interface BalanceHistory {
  date: string;
  balance: number;
}

interface WalletBalance {
  name: string;
  balance: number;
}

// Pie Chart for Expenses by Category
export function ExpensePieChart({ expenses }: { expenses: ExpenseData[] }) {
  const data = {
    labels: expenses.map(e => EXPENSE_CATEGORIES[e.category as keyof typeof EXPENSE_CATEGORIES]?.label || e.category),
    datasets: [
      {
        data: expenses.map(e => e.amount),
        backgroundColor: expenses.map(e => EXPENSE_CATEGORIES[e.category as keyof typeof EXPENSE_CATEGORIES]?.color || '#C9CBCF'),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `$${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

// Line Chart for Balance Over Time
export function BalanceLineChart({ history }: { history: BalanceHistory[] }) {
  const data = {
    labels: history.map(h => h.date),
    datasets: [
      {
        label: 'Balance (ETH)',
        data: history.map(h => h.balance),
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw.toFixed(4)} ETH`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}

// Bar Chart for Wallet Comparison
export function WalletBarChart({ wallets }: { wallets: WalletBalance[] }) {
  const data = {
    labels: wallets.map(w => w.name),
    datasets: [
      {
        label: 'Balance (ETH)',
        data: wallets.map(w => w.balance),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

// Burn Stats Mini Chart
export function BurnStatsChart({ burned, total }: { burned: number; total: number }) {
  const remaining = total - burned;
  
  const data = {
    labels: ['Burned 🔥', 'Remaining'],
    datasets: [
      {
        data: [burned, remaining],
        backgroundColor: ['#EF4444', '#22C55E'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
