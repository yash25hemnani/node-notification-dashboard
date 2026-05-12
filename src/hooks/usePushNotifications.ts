// hooks/usePushNotifications.ts
import apiClient from "@/api/apiClient";
import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  console.log(base64String)
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

const getPermission = (): NotificationPermission | "unsupported" => {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
};

export function usePushNotifications() {
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(getPermission());
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if ("serviceWorker" in navigator && "pushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
    };
    checkSubscription();
  }, []);

  const subscribe = async () => {
    try {
      setLoading(true);
      const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  
      if (!VAPID_PUBLIC_KEY) {
        throw new Error("VAPID public key is not defined.");
      }

      if (!("Notification" in window)) {
        throw new Error("Notifications are not supported.");
      }

      const newPermission = await Notification.requestPermission();
      setPermission(newPermission);

      if (newPermission !== "granted") {
        throw new Error("Notification permission denied.");
      }

      const registration = await navigator.serviceWorker.ready;

      const existingSubscription =
        await registration.pushManager.getSubscription();

      if (existingSubscription) {
        await existingSubscription.unsubscribe();

        try {
          await apiClient.post("/subscription/internal-unsubscribe", {
            endpoint: existingSubscription.endpoint,
          });
        } catch (error: any) {
          // Subscription not found on server
          if (error?.response?.status !== 404) {
            throw error; // re-throw anything unexpected
          }
        }
        setIsSubscribed(false);
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await apiClient.post("/subscription/internal-subscribe", {
        subscription,
      });

      setIsSubscribed(true);

      return true;
    } catch (error) {
      console.error("Push notification subscription failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscribe,
    loading,
    permission,
    isSubscribed,
  };
}
