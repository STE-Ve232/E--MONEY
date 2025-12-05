// In: c:/Users/NEWTON/E-money/client/src/App.jsx

import React from 'react';
import { Routes, Route } from "react-router-dom";
import Transfer from "./pages/Transfer";

// ... other imports like Login, Register, UserLayout, etc.
import Login from './lib/Login.jsx';
import Register from './pages/auth/Register';
import UserLayout from './components/UserLayout';
import Deposit from './pages/Deposit';
import TransactionHistory from './pages/TransactionHistory';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard.jsx';


export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<LandingPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<UserLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="deposit" element={<Deposit />} />
        <Route path="activity/transaction-history" element={<TransactionHistory />} />

        {/* This is likely line 28, where the error occurs */}
        <Route path="transfer" element={<Transfer />} />
      </Route>
    </Routes>
  );
}