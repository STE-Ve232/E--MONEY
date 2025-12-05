import React from "react";
import LoanApplicationPanel from "../components/LoanApplicationPanel";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="text-3xl font-bold text-blue-400 mb-4">
        Welcome to Your Dashboard
      </h1>
      <p className="text-gray-300 mb-6">
        Here you can manage your account and services.
      </p>

      <hr className="border-gray-700 my-8" />

      <LoanApplicationPanel />
    </div>
  );
};

export default Dashboard;
