import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthenticatedUserId } from "../../util/AuthAPI";

export default function ProtectedRoute() {
  const location = useLocation();
  const isDevMode =
    String(import.meta.env.VITE_DEV_MODE).toUpperCase() === "TRUE";
  const isAuthenticated = getAuthenticatedUserId() != null;

  if (isDevMode || isAuthenticated) return <Outlet />;

  const from = `${location.pathname}${location.search}${location.hash}`;
  return <Navigate to="/login" replace state={{ from }} />;
}
