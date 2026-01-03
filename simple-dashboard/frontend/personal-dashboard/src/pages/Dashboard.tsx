import React from 'react';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Hi! Ready to track money? 💰</h2>
        <div className="bg-gray-200 h-64 rounded-lg mb-6 flex items-center justify-center">
          <p className="text-gray-500">Chart placeholder (coming soon!)</p>
        </div>
        <div className="flex justify-between">
          <button
            disabled
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
          >
            Add Wallet 👛
          </button>
          <button
            disabled
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
          >
            Set Budget 📊
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
