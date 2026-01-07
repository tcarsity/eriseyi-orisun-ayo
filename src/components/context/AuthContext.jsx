import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSessionTimeout from "../../hooks/useSessionTimeout";
import { useLocation, useNavigate } from "react-router-dom";
import SessionWarningModal from "../SessionWarningModal";
import api from "../../api/axios";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountDown] = useState(60);

  // New: Auth state flag
  const isAuthenticated = !!token;

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const isLoginPage = location.pathname === "/admin/login";

  const handleWarning = useCallback((secondsLeft) => {
    setShowWarning(true);
    setCountDown(secondsLeft);
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await api.post("/logout");
      }
    } catch (err) {
      console.error("Logout sync failed:", err);
    } finally {
      queryClient.clear();

      if (user?.id) {
        localStorage.removeItem(`lastLogin-${user.id}`);
      }

      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [queryClient, user]);

  const handleLogout = useCallback(() => {
    clearTimer?.();

    setShowWarning(false);

    logout();

    queryClient.invalidateQueries(["dashboardStats"]);

    setTimeout(() => navigate("/admin/login"), 300);
  }, [logout, navigate, queryClient]);

  const sessionConfig = useMemo(
    () => ({
      timeout: 15 * 60 * 1000,
      warningDuration: 60 * 1000,
      onWarning: handleWarning,
      onTimeout: handleLogout,
    }),
    [handleWarning, handleLogout]
  );

  const { resetTimer, clearTimer } = useSessionTimeout(sessionConfig);

  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    resetTimer();
  }, [resetTimer]);

  // Restore auth state on refresh
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  //NEW - Axios interceptor for token + Auto Logout on 401

  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    const resInterceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error?.response?.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [handleLogout]);

  const login = useCallback(
    (userData, token) => {
      setUser(userData);
      setToken(token);
      setShowWarning(false);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      resetTimer();
    },
    [resetTimer]
  );

  useEffect(() => {
    sessionConfig.onTimeout = handleLogout;
  }, [handleLogout, sessionConfig]);

  const greeting = useMemo(() => {
    if (!user || !user.id || !user.name) return "";

    const key = `lastLogin-${user.id}`;
    const lastLogin = localStorage.getItem(key);

    if (!lastLogin) {
      localStorage.setItem(key, new Date().toISOString());
      return `Welcome, ${user.name}`;
    } else {
      localStorage.setItem(key, new Date().toISOString());
      return `Welcome back, ${user.name}`;
    }
  }, [user]);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated,
      greeting,
      loading,
      setUser,
    }),
    [user, login, logout, token, greeting, isAuthenticated, loading, setUser]
  );

  if (loading) return null;

  return (
    <>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>

      {!isLoginPage && (
        <SessionWarningModal
          show={showWarning}
          countdown={countdown}
          onStayLoggedIn={handleStayLoggedIn}
        />
      )}
    </>
  );
}

export const useAuth = () => useContext(AuthContext);
