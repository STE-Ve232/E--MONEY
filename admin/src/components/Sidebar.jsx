import { NavLink, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiLogOut, FiPhone, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';

export default function Sidebar() {
  // Style for active NavLink
  const activeLinkStyle = {
    backgroundColor: 'rgba(38, 132, 255, 0.2)',
    color: '#60a5fa', // A brighter blue for active text
    boxShadow: '0 0 15px rgba(38, 132, 255, 0.3)',
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you'd clear tokens here
    navigate('/login');
  };

  return (
    // Glassmorphism effect: semi-transparent background with backdrop blur
    <aside className="w-64 h-full bg-black/30 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col">
      <div className="flex-1 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <RxDashboard className="text-3xl text-blue-400" />
          <h1 className="text-2xl font-bold tracking-wider text-white">EMoney</h1>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-3">
          {['/', '/user-management', '/payouts', '/aggregators', '/transactions', '/reserve', '/loan-applications', '/features', '/ml-brain', '/audit-log'].map((path) => (
            <NavLink key={path} to={path} style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="p-3 rounded-lg text-neutral-300 transition-all duration-300 ease-in-out hover:bg-white/10 hover:shadow-lg hover:-translate-y-1 hover:text-white">
              {path === '/' ? 'Dashboard' : path.charAt(1).toUpperCase() + path.slice(2).replace('-', ' ')}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer section with contacts and logout */}
      <div className="mt-auto">
        <div className="mb-6 border-t border-white/10 pt-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Contact & Support</h3>
          <a href="tel:+25496128545" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors py-1">
            <FiPhone /> +254 961 285 45
          </a>
          <div className="flex items-center gap-4 mt-4">
            <a href="#" className="text-neutral-400 hover:text-white"><FiTwitter size={18} /></a>
            <a href="#" className="text-neutral-400 hover:text-white"><FiLinkedin size={18} /></a>
            <a href="#" className="text-neutral-400 hover:text-white"><FiGithub size={18} /></a>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-600/50 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
}