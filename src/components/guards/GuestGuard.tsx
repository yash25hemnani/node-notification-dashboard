import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function GuestGuard() {
  const accessToken = useAuthStore((s) => s.accessToken);

  // already logged in → go dashboard
  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
