import React, { useState } from "react";

const LoanApplicationPanel = () => {
  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
  });
  const [message, setMessage] = useState("");

  const { amount, purpose } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // This assumes you have a proxy setup in package.json to route API requests
      const response = await fetch("/api/loans/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"), // Assumes JWT is in localStorage
        },
        body: JSON.stringify({ amount, purpose }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Something went wrong");
      }

      setMessage("Loan application submitted successfully!");
      setFormData({ amount: "", purpose: "" }); // Clear form
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">Apply for a Loan</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Loan Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={onChange}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-500"
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">Purpose of Loan</label>
          <textarea
            id="purpose"
            name="purpose"
            value={purpose}
            onChange={onChange}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-500"
            placeholder="Describe your purpose"
          />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">Submit Application</button>
      </form>
      {message && <p className="text-sm text-green-600 mt-4 font-semibold">{message}</p>}
    </div>
  );
};

export default LoanApplicationPanel;
