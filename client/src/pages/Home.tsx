import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import {
  FaFingerprint,
  FaLock,
  FaShieldAlt,
  FaBan,
  FaGoogle,
  FaDatabase,
  FaBolt,
  FaCheckCircle,
} from 'react-icons/fa';

const featuresData = [
  { icon: <FaFingerprint />, title: 'Biometric Login', description: 'Face ID / Touch ID', benefit: 'Post-Password', color: 'from-cyan-400 to-blue-600' },
  { icon: <FaLock />, title: 'WebAuthn Passkeys', description: 'Phishing-proof authentication', benefit: 'Military-grade', color: 'from-purple-400 to-pink-600' },
  { icon: <FaShieldAlt />, title: 'ML Fraud Brain v5', description: 'Real-time 99.998% fraud detection', benefit: 'Always-On Protection', color: 'from-green-400 to-emerald-600' },
  { icon: <FaBan />, title: 'On-Chain Fraud Ban', description: 'Permanent ban on Ethereum', benefit: 'Immutable Justice', color: 'from-red-400 to-rose-600' },
  { icon: <FaGoogle />, title: '2FA (TOTP + Backup Codes)', description: 'Google Authenticator', benefit: 'Account Takeover Proof', color: 'from-yellow-400 to-orange-600' },
  { icon: <FaDatabase />, title: 'Encrypted Local Storage', description: 'IndexedDB + Crypto', benefit: 'Data Safe Offline', color: 'from-indigo-400 to-violet-600' },
];

const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{x: number; y: number; vx: number; vy: number; size: number; color: string}> = [];
    const colors = ['#00D9FF', '#B026FF', '#FF006E', '#39FF14', '#FFD700'];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
      <Particles />
      
      {/* Animated Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 217, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(176, 38, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 p-6 flex justify-between items-center backdrop-blur-md bg-black/30 border-b border-cyan-500/30"
      >
        <Link to="/" className="flex items-center gap-3 group">
          <RxDashboard className="text-4xl text-cyan-400 group-hover:text-purple-400 transition-colors duration-300" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            EMoney
          </h1>
        </Link>
        <nav className="flex gap-6">
          <Link 
            to="/register" 
            className="text-cyan-300 hover:text-cyan-100 transition-colors font-medium relative group"
          >
            Create Free Account
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link 
            to="/login" 
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-lg text-white font-bold transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-purple-500/50 hover:scale-105"
          >
            Sign In
          </Link>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 text-center max-w-5xl mx-auto px-4 py-24"
      >
        {/* Floating Badges */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 rounded-full mb-6 backdrop-blur-sm"
        >
          <FaCheckCircle className="text-green-400" />
          <span className="text-green-300 font-semibold">99.998% Fraud Detection</span>
        </motion.div>

        <h2 className="text-6xl md:text-7xl font-black leading-tight mb-6">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            The Future of
          </span>
          <br />
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Secure E-Money
          </span>
        </h2>
        
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          A worldwide financial platform engineered for <span className="text-cyan-400 font-bold">military-grade security</span>, 
          giving you <span className="text-purple-400 font-bold">absolute control</span> and peace of mind.
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          <Link 
            to="/register" 
            className="group px-10 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-purple-500/50 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <FaBolt className="group-hover:animate-bounce" />
              Create Free Account
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          
          <Link 
            to="/login" 
            className="px-10 py-4 border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-black font-bold rounded-full text-lg transition-all duration-300 transform hover:scale-110 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/60"
          >
            Sign In
          </Link>
        </div>
      </motion.section>

      {/* Security Features */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuresData.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 p-8 rounded-2xl border-2 border-transparent hover:border-cyan-400/50 shadow-xl backdrop-blur-sm transition-all duration-300"
            style={{
              boxShadow: '0 0 30px rgba(0, 217, 255, 0.2)',
            }}
          >
            {/* Gradient Border Effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`} />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`text-6xl mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {feature.benefit}
              </h3>
              <p className="text-lg font-semibold text-purple-300 mb-1">{feature.title}</p>
              <p className="text-gray-400">{feature.description}</p>
            </div>

            {/* Corner Accent */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-20 blur-2xl rounded-full`} />
          </motion.div>
        ))}
      </section>

      {/* Bottom CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="relative z-10 text-center py-20 px-4"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/40 to-cyan-900/40 p-12 rounded-3xl border border-purple-500/30 backdrop-blur-md">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Ready to Experience the Future?
          </h3>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of users who trust EMoney for their digital transactions
          </p>
          <Link
            to="/register"
            className="inline-block px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-purple-500/50 hover:shadow-cyan-500/50"
          >
            Get Started Now
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
