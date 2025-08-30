import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // ✅ CRA uses process.env
  headers: {
    "Content-Type": "application/json",
  },
});

// You can set up interceptors here if needed (e.g., for auth token)

export default api;
