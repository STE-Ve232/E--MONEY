import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiCheck, FiX } from 'react-icons/fi';

// Mock Data - In a real app, this would be fetched from an API
const initialLoanApplications = [
  { id: 'loan_1', userName: 'John Doe', userEmail: 'john.doe@example.com', amount: 5000, currency: 'EMC', reason: 'Emergency medical expenses', status: 'Pending', requestedDate: '2023-10-27' },
  { id: 'loan_2', userName: 'Jane Smith', userEmail: 'jane.smith@example.com', amount: 10000, currency: 'USD', reason: 'Small business startup capital', status: 'Pending', requestedDate: '2023-10-26' },
  { id: 'loan_3', userName: 'Peter Jones', userEmail: 'peter.jones@example.com', amount: 2500, currency: 'EMC', reason: 'Home renovation project', status: 'Approved', requestedDate: '2023-10-25' },
  { id: 'loan_4', userName: 'Mary Johnson', userEmail: 'mary.j@example.com', amount: 7500, currency: 'KES', reason: 'Tuition fees', status: 'Rejected', requestedDate: '2023-10-24' },
];

export default function LoanApplications() {
  const [applications, setApplications] = useState(initialLoanApplications);

  const handleStatusChange = (id, newStatus) => {
    if (window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this loan application?`)) {
      setApplications(apps =>
        apps.map(app => (app.id === id ? { ...app, status: newStatus } : app))
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'text-green-400';
      case 'Pending': return 'text-yellow-400';
      case 'Rejected': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-8 text-white">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiDollarSign className="text-cyan-400" />
          Loan Applications
        </h1>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                {['Applicant', 'Amount', 'Reason', 'Status', 'Requested', 'Actions'].map(h => (
                  <th key={h} className="p-4 font-bold uppercase text-sm text-gray-400 tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="font-bold">{app.userName}</div>
                    <div className="text-sm text-gray-400">{app.userEmail}</div>
                  </td>
                  <td className="p-4 font-mono">{app.amount.toLocaleString()} {app.currency}</td>
                  <td className="p-4 text-gray-300 max-w-xs truncate">{app.reason}</td>
                  <td className={`p-4 font-bold ${getStatusColor(app.status)}`}>{app.status}</td>
                  <td className="p-4 font-mono text-sm">{app.requestedDate}</td>
                  <td className="p-4">
                    {app.status === 'Pending' && (
                      <div className="flex gap-3">
                        <button onClick={() => handleStatusChange(app.id, 'Approved')} className="text-green-400 hover:text-green-300 transition-colors"><FiCheck size={20} /></button>
                        <button onClick={() => handleStatusChange(app.id, 'Rejected')} className="text-red-500 hover:text-red-400 transition-colors"><FiX size={20} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}