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
  const publicRoutes = ["/recent-public-members"];
  const isPublic = publicRoutes.some((url) => config.url?.includes(url));

  if (!isPublic) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
