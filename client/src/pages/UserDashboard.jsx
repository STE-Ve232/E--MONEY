import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function UserDashboard() {
  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
        <p className="text-lg text-gray-300">Here's your financial overview.</p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-cyan-300">Current Balance</h2>
          <p className="text-5xl font-mono font-bold text-white mt-2">1,234.56 EMC</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-300">Apply for a Loan</h2>
          <p className="text-gray-400 mt-2">Need extra funds? Our loan process is fast, secure, and transparent.</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
}
