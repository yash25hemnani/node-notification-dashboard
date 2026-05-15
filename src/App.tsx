import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import apiClient from "./api/apiClient";
import { useAuthStore } from "./stores/authStore";

import GuestGuard from "./components/guards/GuestGuard";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import ApiKeys from "./pages/apiKeys/ApiKeys";
import LoginPage from "./pages/authentication/LoginPage";
import SignupPage from "./pages/authentication/SignupPage";
import Dashboard from "./pages/dashboard/Dashboard";
import AllNotifications from "./pages/notifications/AllNotifications";
import Templates from "./pages/templates/Templates";
import ViewEmailTemplate from "./pages/templates/ViewEmailTemplate";
import ViewPushTemplate from "./pages/templates/ViewPushTemplate";
import ViewSingleNotification from "./pages/notifications/ViewSingleNotification";
import ViewSingleSubscription from "./pages/subscriptions/ViewSingleSubscription";
import AllSubscriptions from "./pages/subscriptions/AllSubscriptions";

export const App = () => {
  const [isRestoring, setIsRestoring] = useState(true);
  const setAuth = useAuthStore((state) => state.setAuth);

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "/",
              element: <MainLayout />,
              children: [{ index: true, element: <Dashboard /> }],
            },
            {
              path: "/notifications/:channel",
              element: <MainLayout />,
              children: [{ index: true, element: <AllNotifications /> }],
            },
            {
              path: "/notifications/:channel/:displayId/:id",
              element: <MainLayout />,
              children: [{ index: true, element: <ViewSingleNotification /> }],
            },
            {
              path: "/templates",
              element: <MainLayout />,
              children: [{ index: true, element: <Templates /> }],
            },
            {
              path: "/templates/email/:templateId/:slug",
              element: <MainLayout />,
              children: [{ index: true, element: <ViewEmailTemplate /> }],
            },
            {
              path: "/templates/push/:templateId/:slug",
              element: <MainLayout />,
              children: [{ index: true, element: <ViewPushTemplate /> }],
            },
            {
              path: "/keys",
              element: <MainLayout />,
              children: [{ index: true, element: <ApiKeys /> }],
            },
            {
              path: "/subscriptions",
              element: <MainLayout />,
              children: [{ index: true, element: <AllSubscriptions /> }],
            },
            {
              path: "/subscriptions/:customerEmail",
              element: <MainLayout />,
              children: [{ index: true, element: <ViewSingleSubscription /> }],
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
      ]),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const refreshRes = await apiClient.get("/auth/refresh/");
        if (refreshRes.status === 200 && !cancelled) {
          const { user, accessToken } = refreshRes.data.data;
          setAuth(accessToken, user);
        }
      } catch {
        // no valid session
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    };

    restoreSession();
    return () => {
      cancelled = true;
    };
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
};
