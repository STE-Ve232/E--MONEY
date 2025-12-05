/**
 * Logs in a user by sending their credentials to the backend API.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The data returned from the API, typically including a JWT token.
 */
export async function login({ email, password }) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw an error with the message from the server, or a default one
    throw new Error(data.msg || "Failed to log in");
  }

  return data; // Contains the token
}

/**
 * Generic API object with methods for HTTP requests.
 */
const api = {
  post: async (url, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Request failed");
    }

    return { data: result };
  },
};

export default api;
