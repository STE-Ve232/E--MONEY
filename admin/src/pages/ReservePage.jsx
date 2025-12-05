import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDatabase, FiArrowUpCircle, FiArrowDownCircle } from 'react-icons/fi';

export default function ReservePage() {
  // Multi-currency reserve balances
  const [reserveBalances, setReserveBalances] = useState({
    EMC: 50123456098765432.78,
    USD: 12500009087654321.00,
    KES: 18000000012543567.00,
  });
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('EMC'); // Default currency

  const handleTransaction = (type) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    // Update the balance for the selected currency
    setReserveBalances(prevBalances => {
      const newBalance = type === 'credit'
        ? prevBalances[selectedCurrency] + numAmount
        : prevBalances[selectedCurrency] - numAmount;
      return { ...prevBalances, [selectedCurrency]: newBalance };
    });

    if (type === 'credit') {
      window.confirm(`Are you sure you want to CREDIT the reserve with ${numAmount.toLocaleString()} ${selectedCurrency}?`);
    } else if (type === 'debit') {
      window.confirm(`Are you sure you want to DEBIT the reserve by ${numAmount.toLocaleString()} ${selectedCurrency}?`);
    }
    setAmount('');
  };

  return (
    <div className="p-8 text-white">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3"><FiDatabase className="text-cyan-400" /> Reserve Management</h1>
      </motion.div>

      {/* Balance Display */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 mb-8 text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
          <p className="text-sm text-gray-400 uppercase tracking-widest">Current Reserve Balance in</p>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {Object.keys(reserveBalances).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <p className="text-6xl font-bold mt-2 font-mono text-cyan-300">
          {reserveBalances[selectedCurrency].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedCurrency}
        </p>
      </motion.div>

      {/* Transaction Panel */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Manual Adjustment</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-1/2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Amount (EMC)</label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`e.g., 10000 ${selectedCurrency}`}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-4 mt-4 md:mt-auto">
            <button onClick={() => handleTransaction('credit')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-300 hover:scale-105">
              <FiArrowUpCircle /> Credit
            </button>
            <button onClick={() => handleTransaction('debit')} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-300 hover:scale-105">
              <FiArrowDownCircle /> Debit
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}