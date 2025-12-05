import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    // If no token, redirect to the login page
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role; // Assumes your JWT payload has a 'role' field

    if (userRole === 'admin' || userRole === 'super_admin') {
      // If user is an admin, allow access to the admin pages
      return <Outlet />;
    } else {
      // If a regular user somehow gets here, send them away
      // You might want a specific "access denied" page in a real app
      return <Navigate to="/login" />;
    }
  } catch (error) {
    // If token is invalid, force re-login
    console.error("Invalid token:", error);
    return <Navigate to="/login" />;
  }
};

export default AdminProtectedRoute;
