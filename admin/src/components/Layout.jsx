import React from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";


export default function Layout() {
  return (
    // A modern dark theme with a subtle grid pattern for a "digital" feel
    <div 
      className="flex w-full h-screen purple text-gray-200 font-sans"
      style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}