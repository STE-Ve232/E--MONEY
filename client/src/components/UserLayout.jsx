import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import KycPrompt from './KycPrompt';
import { FiLogOut } from 'react-icons/fi';
import { RxDashboard } from 'react-icons/rx';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FaFileInvoiceDollar,
  FaStore,
  FaUniversity,
  FaBriefcase,
  FaGlobe,
  FaUsers,
  FaCreditCard,
  FaShoppingCart,
  FaStar,
  FaChevronDown,
  FaShieldAlt,
  FaUserCheck,
  FaHistory,
} from 'react-icons/fa';

export default function UserLayout() {
  const navigate = useNavigate();
  const [isKycVerified, setIsKycVerified] = useState(false); // State to track KYC status

  // Simulate checking user's KYC status on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Assumes user token is stored here
        if (!token) {
          navigate('/login'); // Redirect if no token
          return;
        }
        // Use environment variable for the API base URL
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/users/profile`;
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch profile.');
        const userData = await response.json();
        setIsKycVerified(userData.isKycVerified);
      } catch (error) {
        console.error("Session error:", error);
        navigate('/login'); // On error, force re-login
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };
  const features = [
    {
      category: 'Security',
      icon: <FaShieldAlt />,
      items: ['OTP (SMS / email)', 'Authenticator app', 'Push notifications', 'Biometric login', 'PIN or passcode', 'Device binding'],
    },
    {
      category: 'Account',
      icon: <FaUserCheck />,
      items: ['KYC Approval'],
    },
    {
      category: 'Activity',
      icon: <FaHistory />,
      items: ['Transaction History'],
    },
    {
      category: 'Bills & Utilities',
      icon: <FaFileInvoiceDollar />,
      items: ['Electricity (KPLC tokens)', 'Water bills', 'Internet & TV subscriptions', 'Government services (NTSA, eCitizen, etc.)'],
    },
    {
      category: 'Merchant Payments',
      icon: <FaStore />,
      items: ['Pay via QR code', 'Pay via till number', 'Pay via POS NFC', 'Bulk merchant payout APIs'],
    },
    {
      category: 'Mobile Banking Features',
      icon: <FaUniversity />,
      items: ['Savings vaults', 'Loans (instant or scheduled)', 'Overdraft', 'Interest-earning wallets'],
    },
    {
      category: 'Business & Enterprise Tools',
      icon: <FaBriefcase />,
      items: ['Bulk salary payments', 'Automated invoicing', 'Online payment gateway', 'Subscription/recurring billing'],
    },
    {
      category: 'Remittance & International',
      icon: <FaGlobe />,
      items: ['Cross-border transfers', 'Integration with PayPal, Wise, etc.', 'FX conversion'],
    },
    {
      category: 'Agent Network',
      icon: <FaUsers />,
      items: ['Cash-in', 'Cash-out', 'Float management'],
    },
    {
      category: 'Cards Integration',
      icon: <FaCreditCard />,
      items: ['Virtual cards', 'Physical debit cards', 'Temp disposable cards'],
    },
    {
      category: 'In-App Marketplace',
      icon: <FaShoppingCart />,
      items: ['Airtime purchase', 'Gift cards', 'Voucher codes', 'Games & entertainment'],
    },
    {
      category: 'User Loyalty Perks',
      icon: <FaStar />,
      items: ['Cashback', 'Points system', 'Reward tiers'],
    },
  ];

  const NavItem = ({ feature }) => {
    const [isOpen, setIsOpen] = useState(false);
    const slug = feature.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left py-3 px-4 text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <span className="text-blue-400 text-lg animate-pulse">{feature.icon}</span>
            <span className="font-medium">{feature.category}</span>
          </div>
          <FaChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="pl-8 pr-2 py-2">
            <ul className="border-l border-gray-700">
              {feature.items.map((item) => {
                const itemSlug = item.toLowerCase().replace(/\s/g, '-').replace(/\(|\)/g, '');
                return (
                  <li key={item}>
                    <Link
                      to={`/dashboard/${slug}/${itemSlug}`}
                      className="block py-2 px-4 text-gray-300 hover:text-blue-300 hover:bg-gray-800/30 rounded-md transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-gray-100 font-sans overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }}
    >
      <motion.div
        className="flex h-screen relative"
        initial={{ opacity: 0, perspective: '1000px' }}
        animate={{ opacity: 1, perspective: '1000px' }} // Removed duplicate className
        transition={{ duration: 0.5 }}
      >
        <motion.aside
          initial={{ opacity: 0, x: -100, rotateY: 20 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-80 bg-gray-900/80 backdrop-blur-md border-r border-gray-800 flex flex-col shadow-lg shadow-blue-900/20"
        >
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <RxDashboard className="text-3xl text-blue-500 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-wider text-gray-900">EMoney</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <NavItem feature={feature} />
              </motion.div>
            ))}
          </nav>
        </motion.aside>

        <motion.div className="flex-1 flex flex-col overflow-hidden" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}>
          <header className="p-4 border-b border-gray-800 flex justify-end items-center backdrop-blur-md bg-gray-900/80 sticky top-0 z-50 shadow-sm shadow-blue-900/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
            >
              <FiLogOut /> Logout
            </button>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </motion.div>
        {!isKycVerified && <KycPrompt />}
      </motion.div>
    </div>
  );
}