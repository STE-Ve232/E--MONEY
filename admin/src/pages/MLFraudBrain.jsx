import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiCheck, FiFlag, FiX } from 'react-icons/fi';

// This function simulates the logic from your `predictor.py`
const getFraudPrediction = (transaction) => {
  // Simplified simulation of feature scaling and prediction
  const featureWeights = {
    amount: transaction.amount / 1000,
    urgency_words: transaction.urgency_words * 10,
    high_value_new: transaction.high_value_new * 25,
    account_age_days: -transaction.account_age_days / 50,
    reputation: -transaction.reputation * 5,
  };

  let score = Object.values(featureWeights).reduce((sum, val) => sum + val, 0);

  const risk_score = Math.min(100, Math.max(0, score + Math.random() * 20));
  const action = risk_score > 92 ? "BLOCK" : risk_score > 75 ? "FLAG" : "ALLOW";

  // Calculate feature importances (as percentages of the total score)
  const totalAbsWeight = Object.values(featureWeights).reduce((sum, val) => sum + Math.abs(val), 0);
  const featureImportances = Object.fromEntries(
    Object.entries(featureWeights).map(([key, weight]) => [key, ((Math.abs(weight) / totalAbsWeight) * 100).toFixed(1)])
  );

  return {
    risk_score: risk_score.toFixed(3),
    action,
    brain_version: "v5.0"
  };
};

// Function to generate random mock transactions
const generateMockTransaction = () => {
  const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const amount = Math.floor(Math.random() * 5000) + 1;
  const descriptions = ["Urgent payment request", "Invoice payment", "Please help process now", "Standard transfer", "ASAP fund request"];
  return {
    id,
    amount,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    account_age_days: Math.floor(Math.random() * 365),
    reputation: (Math.random() * 5).toFixed(1),
    urgency_words: Math.random() > 0.7 ? 1 : 0,
    high_value_new: amount > 2000 && Math.random() > 0.8 ? 1 : 0,
  };
};

export default function MLFraudBrain() {
  const [stream, setStream] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTxn = generateMockTransaction();
      const prediction = getFraudPrediction(newTxn);
      setStream(prevStream => [{ ...newTxn, ...prediction }, ...prevStream.slice(0, 10)]);
    }, 2500); // New transaction every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  const getActionStyle = (action) => {
    switch (action) {
      case 'BLOCK': return { icon: <FiX />, color: 'bg-red-500/20 text-red-400 border-red-500/50' };
      case 'FLAG': return { icon: <FiFlag />, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' };
      case 'ALLOW': return { icon: <FiCheck />, color: 'bg-green-500/20 text-green-400 border-green-500/50' };
      default: return { icon: <FiCheck />, color: 'bg-gray-500/20 text-gray-400' };
    }
  };

  return (
    <div className="p-8 text-white">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiCpu className="text-cyan-400 animate-pulse" />
          ML Fraud Brain v5
        </h1>
        <p className="text-xl text-cyan-300 mt-3 font-light">
          Actively defending the entire system in real-time.
        </p>
      </motion.div>

      <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Live Analysis Stream</h2>
        <div className="space-y-4 font-mono text-sm">
          <AnimatePresence initial={false}>
            {stream.map((item) => {
              const { icon, color } = getActionStyle(item.action);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  className={`p-4 rounded-lg border ${color} flex items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{icon}</div>
                    <div>
                      <p className="font-bold text-white">{item.action}: <span className="text-gray-400">{item.description}</span></p> 
                      <p className="text-xs text-gray-500">Txn: {item.id}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-lg text-white">{item.risk_score}%</p>
                    <p className="text-xs text-gray-500">Risk Score</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}