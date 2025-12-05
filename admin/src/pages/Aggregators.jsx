import React from 'react';
import { motion } from 'framer-motion';
import { FiShare2 } from 'react-icons/fi';

// Mock Data
const mockAggregators = [
  { name: 'Stripe', status: 'Online', lastSync: '2 minutes ago' },
  { name: 'PayPal', status: 'Online', lastSync: '5 minutes ago' },
  { name: 'M-Pesa', status: 'Degraded Performance', lastSync: '1 hour ago' },
  { name: 'Flutterwave', status: 'Offline', lastSync: '3 hours ago' },
];

export default function Aggregators() {
  const getStatusColor = (status) => {
    if (status.includes('Online')) return 'text-green-400';
    if (status.includes('Degraded')) return 'text-yellow-400';
    if (status.includes('Offline')) return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <div className="p-8 text-white">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3"><FiShare2 className="text-cyan-400" /> Aggregators</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAggregators.map((agg, i) => (
          <motion.div key={agg.name} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{agg.name}</h2>
              <p className={`font-bold ${getStatusColor(agg.status)}`}>{agg.status}</p>
            </div>
            <p className="text-sm text-gray-400 mt-2">Last Sync: {agg.lastSync}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}