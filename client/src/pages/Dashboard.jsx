import React from "react";
import LoanApplicationPanel from "../components/LoanApplicationPanel.jsx";

const Dashboard = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Welcome to Your Dashboard</h1>
      <p className="text-lg text-gray-700 mt-2">Here you can manage your account and services.</p>

      <hr className="my-8 border-gray-300" />

      <LoanApplicationPanel />
    </div>
  );
};

export default Dashboard;
