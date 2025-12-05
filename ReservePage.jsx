import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios"; // Make sure to run `npm install axios`

// A simple component for pagination controls
// A component for the adjustment form
const ReserveAdjustmentForm = ({ onAdjustmentSuccess }) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGN"); // Default currency
  const [description, setDescription] = useState("");
  const [type, setType] = useState("credit"); // 'credit' or 'debit'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inputErrors, setInputErrors] = useState({}); // New state for input validation errors

  const validateForm = () => {
    const errors = {};
    if (!amount || parseFloat(amount) <= 0) {
      errors.amount = 'Amount must be a positive number.';
    }
    if (!description.trim()) {
      errors.description = "Description cannot be empty.";
    }
    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if client-side validation fails
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("admin_token"); // Assuming you store the JWT here
      if (!token) {
        setError('Authentication required. Please log in again.');
        setSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/admin/reserve/adjust`,
        { amount, currency, description, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess(
          `Successfully posted ${type} of ${parseFloat(amount).toFixed(
            2          )} ${currency}. New Balance: ${response.data.new_balance}`
        );
        // Clear form
        setAmount("");
        setDescription("");
        // Notify parent component to refresh data
        onAdjustmentSuccess();
      } else {
        // This case might be hit if backend sends success: false with an error message
        setError(
          response.data.error || 'Adjustment failed with an unknown error.'
        );
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.error || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError("Network error: Could not connect to the server.");
      } else {
        setError("An unexpected error occurred while making the request.");
      }
      console.error("Adjustment error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h3>Manual Adjustment</h3>
      <form onSubmit={handleSubmit}>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label>Type</label>
            <div>
              <label style={{ marginRight: "15px" }}>
                <input
                  type="radio"
                  value="credit"
                  checked={type === "credit"}
                  onChange={(e) => setType(e.target.value)}
                />{" "}
                Credit
              </label>
              <label>
                <input
                  type="radio"
                  value="debit"
                  checked={type === "debit"}
                  onChange={(e) => setType(e.target.value)}
                />{" "}
                Debit
              </label>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={styles.input}
            >
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
              {/* Add other currencies from your config */}
            </select>
          </div>
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 1000.00"
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="description">Description / Reason</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Seeding for initial float"
            style={{ ...styles.input, height: "60px" }}
            required
          />
        </div>
        <button type="submit" disabled={submitting} style={styles.button}>
          {submitting ? "Submitting..." : "Submit Adjustment"}
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", marginTop: "10px" }}>{success}</p>
        )}
      </form>
    </div>
  );
};

const Pagination = ({ paginationInfo, onPageChange }) => {
  if (!paginationInfo || paginationInfo.total_pages <= 1) {
    return null; // Don't render if there's only one page or no data
  }

  const { page, total_pages } = paginationInfo;

  return (
    <div style={styles.paginationContainer}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={styles.paginationButton}
      >
        &laquo; Previous
      </button>
      <span style={styles.paginationInfo}>
        Page {page} of {total_pages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === total_pages}
        style={styles.paginationButton}
      >
        Next &raquo;
      </button>
    </div>
  );
};

const ReservePage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const currencySymbol = (currency) => {
    switch (currency) {
      case 'NGN':
        return '₦';
      case 'USD':
        return '$';
      default:
        return currency;
    }
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ['Date', 'Description', 'Type', 'Amount'];
    csvRows.push(headers.join(','));

    transactions.forEach((tx) => {
      const values = [
        new Date(tx.created_at).toLocaleString(),
        tx.description,
        tx.entry_type,
        tx.amount,
      ];
      csvRows.push(values.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `reserve_transactions_${selectedCurrency}.csv`);
    a.click();
  };


  const fetchReserveData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("admin_token");
      const headers = { Authorization: `Bearer ${token}` };

      const [balanceRes, transactionsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/reserve/balance/${selectedCurrency}`, {
          headers,
        }),
        axios.get(
          `${API_URL}/api/admin/reserve/transactions/${selectedCurrency}?page=${currentPage}`,
          { headers }
        ),
      ]);

      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data.transactions);
      setPaginationInfo(transactionsRes.data.pagination);
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.error ||
            `Failed to fetch data: Server responded with status ${err.response.status}`
        );
      } else if (err.request) {
        setError(
          "Network error: Could not connect to the server to fetch data."
        );
      } else {
        setError(
          "An unexpected error occurred while preparing the data request."
        );
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, selectedCurrency, currentPage]); // Dependency array ensures this runs once on mount

  useEffect(() => {
    fetchReserveData();
  }, [fetchReserveData]);

  return (
    <div style={{ padding: "2rem" }}>
        <h1>Reserve Account Management</h1>

        <div style={styles.balanceCard}>
          <h2>
            Current Balance ({selectedCurrency})
            <select
              value={selectedCurrency}
              onChange={(e) => {
                setSelectedCurrency(e.target.value);
                setCurrentPage(1); // Reset to first page on currency change
              }}
              style={{ marginLeft: "20px", fontSize: "1rem" }}
            >
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
            </select>
          </h2>
          {loading ? (
            <div className="spinner" />
          ) : (
            <p style={styles.balanceAmount}> {currencySymbol(selectedCurrency)}
              {parseFloat(balance).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,              
              })}
            </p>
          )}
        </div>

        <ReserveAdjustmentForm onAdjustmentSuccess={fetchReserveData} />

        <button
          onClick={exportToCSV}
          style={{ ...styles.button, marginTop: '1rem' }}
        >
          Export to CSV
        </button>

        <h2 style={{ marginTop: "2rem" }}>
          Transaction History ({selectedCurrency})
        </h2>
        {loading && <div className="spinner" />}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={styles.td}>
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                      <td style={styles.td}>{tx.description}</td>
                      <td style={styles.td}>{tx.entry_type}</td>
                      <td
                        style={{
                          ...styles.td,
                          color: parseFloat(tx.amount) >= 0 ? "green" : "red",
                          textAlign: "right",
                        }}
                      >
                        {parseFloat(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ ...styles.td, textAlign: "center" }}
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              paginationInfo={paginationInfo}
              onPageChange={setCurrentPage}
            />
          </>
        )}
    </div>
  );
};

// Basic styling (can be replaced with your CSS classes)
const styles = {
  formContainer: {
    backgroundColor: "#f8f9fa",
    border: "1px solid #dee2e6",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  formRow: { display: "flex", gap: "20px", marginBottom: "1rem" },
  formGroup: { flex: 1, marginBottom: "1rem" },
  input: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  balanceCard: {
    backgroundColor: "#f8f9fa",
    border: "1px solid #dee2e6",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  balanceAmount: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#007bff",
    margin: 0,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    borderBottom: "2px solid #dee2e6",
    padding: "0.75rem",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  },
  td: { borderBottom: "1px solid #dee2e6", padding: "0.75rem" },
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1rem",
  },
  paginationButton: {
    padding: "8px 12px",
    cursor: "pointer",
    border: "1px solid #dee2e6",
    backgroundColor: "white",
    borderRadius: "4px",
  },
  paginationInfo: {
    fontWeight: "bold",
  },
  inputErrorText: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: "5px",
  },
};

export default ReservePage;
