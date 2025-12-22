import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={`/admin/login`} replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={`/unauthorized`} />;
  }

  return <Outlet />;
}
