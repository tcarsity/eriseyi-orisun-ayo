import axios from "axios";

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

  const publicRoutes = ["/recent-public-members"];

  const isPublicRoute = publicRoutes.some((route) =>
    config.url?.startsWith(route)
  );

  if (!isPublicRoute && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
