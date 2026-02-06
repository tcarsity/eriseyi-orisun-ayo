import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 1000,
  headers: {
    Accept: "application/json",
  },
});

// attach to token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error / timeout / no internet
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your internet connection.",
        isNetworkError: true,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
