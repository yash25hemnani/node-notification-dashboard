import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function ProtectedRoute() {
  const accessToken = useAuthStore((s) => s.accessToken);
  

  // Not logged in → redirect to login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → allow access
  return <Outlet />;
}