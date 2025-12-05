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
    <div className="loan-panel bg-gray-900/70 p-6 rounded-lg shadow-lg border border-blue-700/50 text-gray-100">
      <h2 className="text-2xl font-bold text-blue-400 mb-6">
        Apply for a Loan
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="form-group flex flex-col">
          <label htmlFor="amount" className="text-gray-300 mb-2">
            Loan Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={onChange}
            required
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-100"
          />
        </div>
        <div className="form-group flex flex-col">
          <label htmlFor="purpose" className="text-gray-300 mb-2">
            Purpose of Loan
          </label>
          <textarea
            id="purpose"
            name="purpose"
            value={purpose}
            onChange={onChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
        >
          Submit Application
        </button>
      </form>
      {message && (
        <p
          className={`message mt-4 text-center ${
            message.includes("successfully") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LoanApplicationPanel;
