import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaUserShield, FaLock, FaSignInAlt } from 'react-icons/fa';
import api from '../lib/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // --- Simulation using your provided credentials ---
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (username !== 'steveodiwuor694@gmail.com' || password !== 'ti6ix9ine') {
        throw new Error('Invalid admin credentials.');
      }

      // Store admin-specific tokens
      localStorage.setItem('adminAccessToken', 'dummy-admin-access-token');
      localStorage.setItem('adminRefreshToken', 'dummy-admin-refresh-token');

      // Navigate to the admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-red-500/50">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-400">Super Admin Access</h1>
          <p className="text-gray-400 mt-2">Restricted Area</p>
        </div>

        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Admin Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-red-800">
            <FaSignInAlt /> {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}