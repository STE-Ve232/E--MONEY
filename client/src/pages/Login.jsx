import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', { // Replace with your actual API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
          deviceInfo: {
            fingerprint: 'your-device-fingerprint-logic',
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      // The backend determines if MFA is needed.
      if (data.mfaRequired) {
        // If MFA is required, navigate to the OTP page.
        // The backend is responsible for sending the OTP.
        navigate(`/verify-otp?identifier=${identifier}&context=LOGIN`);
      } else {
        // If login is successful and no MFA is needed (e.g., trusted device),
        // save the tokens and go to the dashboard.
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        navigate('/dashboard');
      }
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
          <h1 className="text-4xl font-bold text-blue-400">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Securely log in to your EMoney account.</p>
        </div>

        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-blue-800">
            <FaSignInAlt /> {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-400">
          New here? <Link to="/register" className="text-blue-400 hover:underline">Create an Account</Link>
        </p>
      </div>
    </div>
  );
}