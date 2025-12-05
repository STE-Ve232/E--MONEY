import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiActivity } from 'react-icons/fi';
import API from '../lib/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await API.get('/admin/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-400';
      case 'Pending': return 'text-yellow-400';
      case 'Failed': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-8 text-white">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3"><FiActivity className="text-cyan-400" /> Transactions</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                {['ID', 'Amount', 'User', 'Status', 'Date'].map(h => <th key={h} className="p-4 font-bold uppercase text-sm text-gray-400 tracking-wider">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-400">Loading transactions...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-400">No transactions found</td></tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-sm">{tx.id}</td>
                    <td className="p-4 font-mono">{tx.amount} {tx.currency}</td>
                    <td className="p-4 font-mono text-sm">{tx.user_id}</td>
                    <td className={`p-4 font-bold ${getStatusColor(tx.status)}`}>{tx.status}</td>
                    <td className="p-4 font-mono text-sm">{new Date(tx.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}