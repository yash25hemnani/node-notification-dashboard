import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/authStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies (refresh token)
});

// ── Request interceptor: attach access token ────────────────
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken && config.headers) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// ── Response interceptor: auto-refresh on 401 ──────────────
// Uses a queue pattern to prevent multiple simultaneous refresh calls.
// When the first 401 triggers a refresh, all subsequent 401s wait in
// a queue for that single refresh to complete, then retry together.

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

/** Resolve or reject every queued request */
function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const { accessToken } = useAuthStore.getState();
    // Only handle 401s, and don't retry the refresh endpoint itself
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh/") || ! accessToken
    ) {
      return Promise.reject(error);
    }

    // Mark so we don't retry this request again
    originalRequest._retry = true;

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    // First 401 — start the refresh
    isRefreshing = true;

    try {
      const res = await axios.post(
        `${BASE_URL}/auth/refresh/`,
        {},
        { withCredentials: true }
      );

      const newToken: string = res.data.access;
      useAuthStore.getState().setAccessToken(newToken);

      // Resolve all queued requests with the new token
      processQueue(null, newToken);

      // Retry the original request
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed — reject all queued requests
      processQueue(refreshError, null);

      // Force logout
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
