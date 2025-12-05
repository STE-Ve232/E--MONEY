import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get identifier and context from URL query params
  const queryParams = new URLSearchParams(location.search);
  const identifier = queryParams.get('identifier');
  const context = queryParams.get('context'); // e.g., 'REGISTRATION' or 'LOGIN'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', { // Replace with your actual API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          otp,
          context,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed.');
      }

      // On successful verification, the backend returns the auth tokens.
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Redirect to the dashboard. The UserLayout will then check
      // for KYC status and show the prompt if needed.
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">Two-Factor Authentication</h1>
          <p className="text-gray-400 mt-2">
            A verification code has been sent to <span className="font-bold text-white">{identifier}</span>.
          </p>
        </div>

        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 text-center text-2xl tracking-[1em] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-blue-800"
          >
            <FaShieldAlt /> {loading ? 'Verifying...' : 'Verify & Proceed'}
          </button>
        </form>
      </div>
    </div>
  );
}