import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function ReserveAccountPage() {
  const [creditAmount, setCreditAmount] = useState('');
  const [debitAmount, setDebitAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBalance = async () => {
    try {
      const adminToken = localStorage.getItem('adminAccessToken');
      const response = await fetch('http://localhost:5000/api/admin/reserve/balance', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch balance.');
      const data = await response.json();
      setBalance(data.balance);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleTransaction = async (type, amount) => {
    try {
      const adminToken = localStorage.getItem('adminAccessToken');
      const response = await fetch(`http://localhost:5000/api/admin/reserve/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      if (!response.ok) throw new Error(`Failed to ${type} funds.`);
      // Refresh balance after successful transaction
      fetchBalance();
      alert(`SUCCESS: ${type.charAt(0).toUpperCase() + type.slice(1)} operation was successful.`);
    } catch (err) {
      alert(`ERROR: ${err.message}`);
    }
  };

  const handleCredit = () => {
    if (!creditAmount) return;
    handleTransaction('credit', creditAmount);
    setCreditAmount('');
  };

  const handleDebit = () => {
    if (!debitAmount) return;
    handleTransaction('debit', debitAmount);
    setDebitAmount('');
  };

  return (
    <div className="bg-black/20 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-red-500/50">
      <h1 className="text-3xl font-bold text-red-400 mb-6">Reserve Account Management</h1>
      <div className="bg-gray-800/50 p-4 rounded-lg mb-8 text-center">
        <h2 className="text-lg text-gray-400">Current Reserve Balance</h2>
        <p className="text-4xl font-bold text-white">
          {loading ? 'Loading...' : error ? 'Error' : `$${Number(balance).toLocaleString()}`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Credit Section */}
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-green-400 mb-4">Credit Reserve Account</h2>
          <div className="relative">
            <input type="number" placeholder="Enter amount to credit" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500" required />
          </div>
          <button onClick={handleCredit} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <FaArrowUp /> Credit Funds
          </button>
        </div>
        {/* Debit Section */}
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Debit Reserve Account</h2>
          <div className="relative">
            <input type="number" placeholder="Enter amount to debit" value={debitAmount} onChange={(e) => setDebitAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
          </div>
          <button onClick={handleDebit} className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <FaArrowDown /> Debit Funds
          </button>
        </div>
      </div>
    </div>
  );
}