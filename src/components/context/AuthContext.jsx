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

  const touchSession = () => {
    localStorage.setItem("lastActivity", Date.now().toString());
  };

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
      queryClient.cancelQueries();
      queryClient.clear();

      if (user?.id) {
        localStorage.removeItem(`lastLogin-${user.id}`);
      }

      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("lastActivity");
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
    [handleWarning, handleLogout],
  );

  const { resetTimer, clearTimer } = useSessionTimeout(sessionConfig);

  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    touchSession();
    resetTimer();
  }, [resetTimer]);

  // Restore auth state on refresh
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      const lastActivity = localStorage.getItem("lastActivity");

      const SESSION_TIMEOUT = 15 * 60 * 1000;

      if (!savedUser || !savedToken) {
        setLoading(false);
        return;
      }

      if (lastActivity) {
        const inactiveTime = Date.now() - Number(lastActivity);
        if (inactiveTime > SESSION_TIMEOUT) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("lastActivity");
          setLoading(false);
          return;
        }
      }

      // Restore Session
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    } catch (error) {
      console.error("Session restore failed:", error);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const events = [
      "click",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "touchmove",
      "visibilitychange",
    ];

    const handleActivity = () => {
      if (document.visibilityState === "visible") {
        localStorage.setItem("lastActivity", Date.now().toString());
      }
    };

    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
    };
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
      },
    );
    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [handleLogout]);

  useEffect(() => {
    const SESSION_TIMEOUT = 15 * 60 * 1000;
    const WARNING_TIME = 60 * 1000;

    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem("lastActivity");

      if (!lastActivity) return;

      const inactiveTime = Date.now() - Number(lastActivity);

      // Show warning at 14 minutes
      if (
        inactiveTime >= SESSION_TIMEOUT - WARNING_TIME &&
        inactiveTime < SESSION_TIMEOUT
      ) {
        const secondsLeft = Math.ceil((SESSION_TIMEOUT - inactiveTime) / 1000);
        handleWarning(secondsLeft);
      }

      // Force logout at 15 minutes
      if (inactiveTime >= SESSION_TIMEOUT) {
        handleLogout();
      }
    }, 5000); // check every 5 seconds
    return () => clearInterval(interval);
  }, [handleLogout, handleWarning]);

  const login = useCallback(
    (userData, token) => {
      setUser(userData);
      setToken(token);
      setShowWarning(false);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      localStorage.setItem("lastActivity", Date.now().toString());

      resetTimer();
    },
    [resetTimer],
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
    [user, login, logout, token, greeting, isAuthenticated, loading, setUser],
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
