import React from 'react';
import { Routes, Route } from "react-router-dom";
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { AuthProvider } from './pages/AuthContext';
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import AdminLayout from './components/AdminLayout';
import Payouts from './pages/Payouts';
import Aggregators from './pages/Aggregators';
import Transactions from './pages/Transactions';
import ReservePage from './pages/ReservePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SystemFeatures from './pages/SystemFeatures';
import MLFraudBrain from './pages/MLFraudBrain';
import AuditLog from './pages/AuditLog';
import LoanApplications from './pages/LoanApplications';


export default function App() {
return (
    <AuthProvider>
      <Routes>
        {/* Public routes that don't use the admin layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
  
        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            {/* Set the Dashboard as the default page for the admin layout */}
            <Route index element={<Dashboard />} />
            <Route path="admin/users" element={<UserManagement />} />
            {/* You can add more admin-specific routes here */}
          </Route>
        </Route>
  
        {/* Note: The old routes below are now inaccessible due to the new structure. */}
        {/* You can integrate them into the new AdminLayout if needed. */}
      </Routes>
    </AuthProvider>
);
}