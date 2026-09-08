import { Navigate, Outlet, useLocation } from "react-router-dom";
import { currentUser } from "../services/authService";

export function ProtectedRoute() { const location = useLocation(); return currentUser() ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname }} replace />; }
export function ProtectedAdminRoute() { return currentUser()?.role === "ADMIN" ? <Outlet /> : <Navigate to="/" replace />; }
