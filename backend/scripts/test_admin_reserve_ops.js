// Node script to exercise admin reserve credit/debit endpoints via HTTP
// Usage: node scripts/test_admin_reserve_ops.js

import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const API = process.env.TEST_API_BASE || "http://localhost:4000/api/admin";
const ADMIN_USER = process.env.TEST_ADMIN_USER || "superadmin";
const ADMIN_PASS = process.env.TEST_ADMIN_PASS || "Admin@123";

async function login() {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
  });
  return res.json();
}

async function credit(token, currency, amount, desc) {
  const res = await fetch(`${API}/reserve/credit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ currency, amount, description: desc }),
  });
  return res.json();
}

async function debit(token, currency, amount, desc) {
  const res = await fetch(`${API}/reserve/debit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ currency, amount, description: desc }),
  });
  return res.json();
}

(async () => {
  console.log("Logging in...");
  const loginRes = await login();
  if (!loginRes.token) return console.error("Login failed", loginRes);
  const token = loginRes.token;
  console.log("Token acquired. Running tests...");

  console.log("Credit EMC 1000");
  console.log(await credit(token, "EMC", 1000, "Test credit"));

  console.log("Debit EMC 500");
  console.log(await debit(token, "EMC", 500, "Test debit"));

  console.log("Done.");
})();
``;
