import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCheck } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function KycPrompt() {
  return (
    <motion.div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-gray-800 border border-blue-500/50 rounded-2xl shadow-2xl p-8 max-w-lg text-center"
        initial={{ scale: 0.7, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <FaUserCheck className="text-5xl text-blue-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Verify Your Identity</h2>
        <p className="text-gray-300 mb-6">
          To unlock all features and secure your account, you need to complete our Know Your Customer (KYC) process.
          This is a one-time verification.
        </p>
        <Link
          to="/dashboard/account/kyc-approval"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
        >
          Start KYC Verification
        </Link>
      </motion.div>
    </motion.div>
  );
}