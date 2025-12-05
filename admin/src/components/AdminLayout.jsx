import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaShieldAlt } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black/30 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaShieldAlt className="text-red-500" />
            Admin Panel
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin/users"
            className="flex items-center gap-3 py-2 px-4 hover:bg-white/5 rounded-lg transition-colors"
          >
            <FaUsers />
            User Management
          </Link>
          {/* Add other admin links here */}
        </nav>     <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/50 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b border-white/10 flex justify-end items-center bg-black/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/50 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <FiLogOut /> Logout
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
