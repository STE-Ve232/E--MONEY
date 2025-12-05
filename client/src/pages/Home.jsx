import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RxDashboard } from 'react-icons/rx';
import { FaFingerprint, FaLock, FaShieldAlt } from 'react-icons/fa';

export default function Home() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-gray-100 font-sans flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }}
    >
      {/* Header/Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gray-900/50 backdrop-blur-sm border-b border-blue-700/30"
      >
        <Link to="/" className="flex items-center gap-3">
          <RxDashboard className="text-3xl text-blue-400 animate-pulse" />
          <h1 className="text-2xl font-bold tracking-wider text-white">EMoney</h1>
        </Link>
        <nav className="flex gap-6">
          <Link to="/register" className="text-blue-300 hover:text-blue-100 transition-colors">Create Free Account</Link>
          <Link to="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors shadow-md">Sign In</Link>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center max-w-4xl mx-auto px-4 py-20 z-0"
      >
        <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          The Future of <span className="text-blue-400">Secure E-Money</span>
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          A worldwide financial platform engineered for military-grade security, giving you absolute control and peace of mind.
        </p>
        <div className="flex justify-center gap-6">
          <Link to="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30">
            Create Free Account
          </Link>
          <Link to="/login" className="px-8 py-4 border border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20">
            Sign In
          </Link>
        </div>
      </motion.section>

      {/* Security Features Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center z-0">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-900/70 p-8 rounded-2xl border border-blue-700/50 shadow-lg shadow-blue-500/20 flex flex-col items-center"
        >
          <FaFingerprint className="text-5xl text-blue-400 mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold text-white mb-2">Your Security is Our Mission</h3>
          <p className="text-gray-300">Biometric Login: Face ID / Touch ID</p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gray-900/70 p-8 rounded-2xl border border-blue-700/50 shadow-lg shadow-blue-500/20 flex flex-col items-center"
        >
          <FaLock className="text-5xl text-blue-400 mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold text-white mb-2">Post-Password</h3>
          <p className="text-gray-300">WebAuthn Passkeys, Phishing-proof authentication</p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-gray-900/70 p-8 rounded-2xl border border-blue-700/50 shadow-lg shadow-blue-500/20 flex flex-col items-center"
        >
          <FaShieldAlt className="text-5xl text-blue-400 mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold text-white mb-2">Military-grade</h3>
          <p className="text-gray-300">ML Fraud Brain v5, Real-time 99.998% fraud detection</p>
        </motion.div>
      </section>
    </div>
  );
}