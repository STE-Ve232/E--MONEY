import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; // This import is used for the animation
import { Link, useNavigate } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { login } from '../../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (email && password) {
      try {
        const response = await login({ email, password });
        localStorage.setItem('accessToken', response.data.access_token);
        navigate('/dashboard');
      } catch (error) {
        console.error("Login failed:", error);
        setError('Invalid email or password.');
      }
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-black text-gray-100 font-sans" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 space-y-8 bg-gray-900/70 backdrop-blur-md border border-blue-700/50 rounded-2xl shadow-lg shadow-blue-500/20">
        <div className="text-center">
          <Link to="/" className="flex justify-center items-center gap-3 mb-4">
            <RxDashboard className="text-4xl text-blue-400 animate-pulse" />
            <h1 className="text-3xl font-bold tracking-wider text-white">EMoney</h1>
          </Link>
          <h2 className="text-2xl font-bold text-blue-400">Welcome Back</h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white/5 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-300">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}
