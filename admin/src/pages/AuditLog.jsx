import React from 'react';
import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';

// Mock Data - In a real app, this would come from a WebSocket or be fetched via API
const mockAuditLogs = [
  { id: 1, user: 'admin@emoney.com', action: 'DEBITED Reserve Account by 10,000.00 EMC.', level: 'CRITICAL', timestamp: '2023-10-27 14:30:05' },
  { id: 2, user: 'ML Fraud Brain v5', action: 'BLOCKED transaction txn_...a4b2 (Risk: 98.5%).', level: 'HIGH', timestamp: '2023-10-27 14:29:55' },
  { id: 3, user: 'support@emoney.com', action: 'Updated user role for analyst.jane@emoney.com to "Support".', level: 'MEDIUM', timestamp: '2023-10-27 14:28:10' },
  { id: 4, user: 'admin@emoney.com', action: 'Logged in successfully from IP 192.168.1.10.', level: 'INFO', timestamp: '2023-10-27 14:25:01' },
  { id: 5, user: 'system', action: 'Aggregator "M-Pesa" status changed to DEGRADED.', level: 'WARNING', timestamp: '2023-10-27 14:20:45' },
  { id: 6, user: 'admin@emoney.com', action: 'DELETED user readonly@emoney.com.', level: 'HIGH', timestamp: '2023-10-27 14:15:30' },
];

export default function AuditLog() {
  const getLevelColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'border-l-red-500 text-red-400';
      case 'HIGH': return 'border-l-orange-500 text-orange-400';
      case 'WARNING': return 'border-l-yellow-500 text-yellow-400';
      case 'MEDIUM': return 'border-l-blue-500 text-blue-400';
      default: return 'border-l-gray-500 text-gray-400';
    }
  };

  return (
    <div className="p-8 text-white">
      <motion.div 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-8"
      >
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiEye className="text-cyan-400" />
          System Audit Log
        </h1>
        <p className="text-xl text-cyan-300 mt-3 font-light">
          A chronological record of all system and admin activities.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }} 
        className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6"
      >
        <div className="space-y-4">
          {mockAuditLogs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 bg-white/5 rounded-lg border-l-4 ${getLevelColor(log.level)}`}
            >
              <p className="font-mono text-sm"><span className="font-bold">{log.user}</span> {log.action}</p>
              <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}