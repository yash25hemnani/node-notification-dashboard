import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import apiClient from "./api/apiClient";
import { useAuthStore } from "./stores/authStore";

import GuestGuard from "./components/guards/GuestGuard";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ApiKeys from "./pages/apiKeys/ApiKeys";
import LoginPage from "./pages/authentication/LoginPage";
import SignupPage from "./pages/authentication/SignupPage";
import Templates from "./pages/templates/Templates";
import ViewSingleTemplate from "./pages/templates/ViewSingleTemplate";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
        ],
      },
      {
        path: "/templates",
        element: <MainLayout />,
        children: [
          { index: true, element: <Templates /> },
        ],
      },
      {
        path: "/templates/:templateId/:slug",
        element: <MainLayout />,
        children: [
          { index: true, element: <ViewSingleTemplate /> },
        ],
      },
      {
        path: "/api-keys",
        element: <MainLayout />,
        children: [
          { index: true, element: <ApiKeys /> },
        ],
      },
    ],
  },
  {
    element: <GuestGuard />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },
]);

function App() {
  const [isRestoring, setIsRestoring] = useState(true);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const refreshRes = await apiClient.post("/auth/refresh/");
        if (refreshRes.status === 200 && !cancelled) {
          const { user, access_token } = refreshRes.data.data;
          setAuth(access_token, user);
        }
      } catch {
        // no valid session — that's fine
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    };

    restoreSession();
    return () => { cancelled = true; };
  }, [setAuth]);

  if (isRestoring) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-2 bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading your session...</p>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;