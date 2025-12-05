import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaExchangeAlt, FaSpinner } from 'react-icons/fa';

const TransactionIcon = ({ type }) => {
  switch (type) {
    case 'deposit':
      return <FaArrowDown className="text-green-400" />;
    case 'transfer':
      return <FaExchangeAlt className="text-blue-400" />;
    case 'withdrawal':
      return <FaArrowUp className="text-red-400" />;
    default:
      return null;
  }
};

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2 py-1 text-xs font-bold rounded-full";
  switch (status) {
    case 'completed':
      return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Completed</span>;
    case 'pending':
      return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>Pending</span>;
    case 'failed':
      return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Failed</span>;
    default:
      return null;
  }
};

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        // Use environment variable for the API base URL
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/transactions`;
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transaction history.');
        }

        const data = await response.json();
        setTransactions(data.transactions);
      } catch (err) {
        setError(err.message);
        // --- For demonstration purposes, load dummy data on error ---
        setTransactions([
          { id: 1, date: '2025-11-27', type: 'deposit', description: 'Deposit from Flutterwave', amount: 500.00, status: 'completed' },
          { id: 2, date: '2025-11-26', type: 'transfer', description: 'Sent to John Doe', amount: -50.00, status: 'completed' },
          { id: 3, date: '2025-11-25', type: 'withdrawal', description: 'ATM Withdrawal', amount: -100.00, status: 'pending' },
          { id: 4, date: '2025-11-24', type: 'deposit', description: 'Paystack Top-up', amount: 200.00, status: 'failed' },
        ]);
        // --- End of dummy data section ---
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-400 text-4xl" />
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="bg-black/20 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/10">
      <h1 className="text-3xl font-bold text-white mb-6">Transaction History</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm text-gray-400">
              <th className="p-4">Date</th>
              <th className="p-4">Type</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-gray-300">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <TransactionIcon type={tx.type} />
                    <span className="capitalize">{tx.type}</span>
                  </div>
                </td>
                <td className="p-4">{tx.description}</td>
                <td className={`p-4 text-right font-mono ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)}
                </td>
                <td className="p-4 text-center">
                  <StatusBadge status={tx.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && !loading && (
          <p className="text-center text-gray-400 py-8">No transactions found.</p>
        )}
      </div>
    </div>
  );
}