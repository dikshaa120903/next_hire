import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";

export const PrivateRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
