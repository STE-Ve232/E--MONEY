import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, ArrowRightLeft, History, User, Shield, Lock, Smartphone, Database, Zap, CheckCircle, ArrowLeft } from 'lucide-react';

const services = [
  {
    icon: CreditCard,
    title: 'Deposits',
    description: 'Securely deposit funds into your account',
    route: '/dashboard/deposit',
    color: 'from-green-400 to-emerald-600'
  },
  {
    icon: ArrowRightLeft,
    title: 'Transfers',
    description: 'Send money to other users instantly',
    route: '/dashboard/transfer',
    color: 'from-blue-400 to-cyan-600'
  },
  {
    icon: History,
    title: 'Transaction History',
    description: 'View all your past transactions',
    route: '/dashboard/activity/transaction-history',
    color: 'from-purple-400 to-pink-600'
  },
  {
    icon: User,
    title: 'Account Management',
    description: 'Manage your profile and settings',
    route: '/dashboard',
    color: 'from-orange-400 to-red-600'
  },
  {
    icon: Shield,
    title: 'Security Features',
    description: 'Advanced security and fraud protection',
    route: '/dashboard',
    color: 'from-indigo-400 to-violet-600'
  },
  {
    icon: Lock,
    title: 'Biometric Login',
    description: 'Face ID and Touch ID authentication',
    route: '/login',
    color: 'from-cyan-400 to-blue-600'
  }
];

export default function Services() {
  const navigate = useNavigate();

  const handleServiceClick = (route) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/register');
    } else {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
      
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(0, 217, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(176, 38, 255, 0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <header className="relative z-20 p-4 md:p-6 flex justify-between items-center backdrop-blur-md bg-black/30 border-b border-cyan-500/30">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
          <LayoutDashboard className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 group-hover:text-purple-400 transition-colors duration-300" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            EMoney
          </h1>
        </Link>
        <nav className="flex gap-2 md:gap-6">
          <button onClick={() => navigate('/register')} className="text-sm md:text-base text-cyan-300 hover:text-cyan-100 transition-colors font-medium relative group">
            Create Free Account
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
          </button>
          <button onClick={() => navigate('/login')} className="px-3 py-1 md:px-6 md:py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-lg text-white font-bold transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-purple-500/50 hover:scale-105 text-sm md:text-base">
            Sign In
          </button>
        </nav>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Explore all the powerful features EMoney has to offer. Create an account to start using these services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                onClick={() => handleServiceClick(service.route)}
                className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 p-8 rounded-2xl border-2 border-transparent hover:border-cyan-400/50 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  boxShadow: '0 0 30px rgba(0, 217, 255, 0.2)',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`} />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`mb-4 bg-gradient-to-r ${service.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-16 h-16" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                  <div className="text-sm text-cyan-400 font-medium">
                    Click to access
                  </div>
                </div>

                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${service.color} opacity-20 blur-2xl rounded-full`} />
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 rounded-full mb-6 backdrop-blur-sm">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-green-500">Ready to get started?</span>
          </div>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Create your free account now and unlock all these powerful financial services with military-grade security.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-block px-12 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold rounded-full text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-purple-500/50 hover:shadow-cyan-500/50"
          >
            Create Free Account
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; animation-fill-mode: both; }
      `}</style>
    </div>
  );
}
