import React, { useState, useEffect } from 'react';
import {
  getExpenses,
  addExpense,
  deleteExpense,
  CATEGORIES,
  Expense,
} from '../services/expenseTracker';

function ExpenseManager() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setExpenses(getExpenses());
  }, []);

  const refreshExpenses = () => {
    setExpenses(getExpenses());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    addExpense({
      amount: parseFloat(amount),
      category,
      description: description || CATEGORIES.find(c => c.id === category)?.label || 'Expense',
      date: new Date().toISOString(),
    });

    setAmount('');
    setDescription('');
    setShowForm(false);
    refreshExpenses();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this expense?')) {
      deleteExpense(id);
      refreshExpenses();
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">💸 Expenses</h2>
        <span className="text-lg font-bold text-red-500">
          ${totalExpenses.toFixed(2)}
        </span>
      </div>

      {/* Add Expense Form */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="mb-3">
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount ($)"
              className="w-full p-2 border rounded"
              autoFocus
            />
          </div>
          <div className="mb-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Add Expense
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mb-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          ➕ Add Expense
        </button>
      )}

      {/* Expense List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {expenses.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No expenses yet</p>
        ) : (
          expenses.slice(0, 10).map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {CATEGORIES.find(c => c.id === expense.category)?.icon || '📦'}
                </span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{expense.description}</p>
                  <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-red-500">${expense.amount.toFixed(2)}</span>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {expenses.length > 10 && (
        <p className="text-center text-gray-400 text-sm mt-2">
          +{expenses.length - 10} more expenses
        </p>
      )}
    </div>
  );
}

export default ExpenseManager;
