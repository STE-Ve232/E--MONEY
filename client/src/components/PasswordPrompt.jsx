import React, { useState } from 'react';
import { FaLock, FaShieldAlt } from 'react-icons/fa';

export default function PasswordPrompt({ onConfirm, onCancel }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      // In a real app, you'd send this password to a backend endpoint
      // to verify it before proceeding. This is for the client-side password prompt.
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/auth/re-authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Incorrect password or authorization failed.');
      }

      onConfirm(); // Call the onConfirm callback on success
    } catch (err) {
      setError(err.message || 'Incorrect password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-gray-800 border border-red-500/50 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <FaLock className="text-4xl text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Authorization Required</h2>
        <p className="text-gray-300 mb-6">Enter your password to access this sensitive area.</p>

        {error && <p className="bg-red-500/20 text-red-400 p-2 rounded-lg mb-4 text-sm">{error}</p>}

        <div className="relative mb-4">
          <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-4">
          <button onClick={onCancel} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-red-800">
            <FaShieldAlt /> {loading ? 'Verifying...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}