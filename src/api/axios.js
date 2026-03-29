import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// attach to token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    localStorage.setItem("lastActivity", Date.now().toString());
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error / timeout / no internet
    if (!error.response) {
      ((error.isNetworkError = true),
        (error.message =
          "Network error. Please check your internet connection."));
      return Promise.reject(error);
    }

    // Timeout (slow network)
    if (error.code === "ECONNABORTED") {
      error.isTimeout = true;
      error.message = "Request timed out. Network seems slow.";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error / timeout / no internet
    if (error.response?.status === 403) {
      toast.error("Session changed. Please login again.");
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  },
);

export default api;
