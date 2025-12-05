import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownloadCloud } from 'react-icons/fi';
import API from '../lib/api';

export default function Payouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const response = await API.get('/admin/payouts');
        setPayouts(response.data);
      } catch (error) {
        console.error('Error fetching payouts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
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
        <h1 className="text-4xl font-bold flex items-center gap-3"><FiDownloadCloud className="text-cyan-400" /> Payouts</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                {['ID', 'Amount', 'Destination', 'Status', 'Date'].map(h => <th key={h} className="p-4 font-bold uppercase text-sm text-gray-400 tracking-wider">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-400">Loading payouts...</td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-400">No payouts found</td>
                </tr>
              ) : (
                payouts.map(payout => (
                  <tr key={payout.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-sm">{payout.tx_ref}</td>
                    <td className="p-4 font-mono">{payout.amount} {payout.currency}</td>
                    <td className="p-4 font-mono text-sm">{JSON.stringify(payout.destination)}</td>
                    <td className={`p-4 font-bold ${getStatusColor(payout.status)}`}>{payout.status}</td>
                    <td className="p-4 font-mono text-sm">{payout.created_at ? new Date(payout.created_at).toLocaleDateString() : 'N/A'}</td>
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