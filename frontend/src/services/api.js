import axios from 'axios';

// 1. Define the Base URL
// This points to your Django API. 
// Note: We use '127.0.0.1' instead of 'localhost' to avoid some common CORS/cookie issues.
const API_URL = "http://127.0.0.1:8000/";

// 2. Create the Axios Instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 3. Request Interceptor (The "Key" to Authentication)
// This code runs BEFORE every request sent by this 'api' instance.
api.interceptors.request.use(
  (config) => {
    // Check if we have an access token saved in the browser
    const token = localStorage.getItem("access_token");
    
    // If token exists, attach it to the Authorization header
    // Format: "Bearer <token>"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. Response Interceptor (Optional but Recommended)
// This runs AFTER every response is received.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // If the backend returns 401 (Unauthorized), it often means the token expired.
        // For now, we will just reject the error.
        // Later, we can add logic here to auto-refresh tokens.
        return Promise.reject(error);
    }
);

export default api;