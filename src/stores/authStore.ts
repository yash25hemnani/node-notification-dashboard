import { create } from "zustand";

/* =========================
   User Model 
========================= */
export interface User {
  id: string;
  username: string;
  email: string;
}

/* =========================
   Store State
========================= */
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  /* Actions */
  setAuth: (token: string, user: User) => void;

  setAccessToken: (token: string) => void;
  logout: () => void;
}

/* =========================
   Store
========================= */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  /* -------------------------
     Set auth
  -------------------------- */
  setAuth: (token, user) =>
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
    }),

  /* -------------------------
       Set Access Token
    -------------------------- */

  setAccessToken: (token) => {
    localStorage.setItem("access_token", token);

    set((state) => ({
      accessToken: token,
      isAuthenticated: Boolean(token && state.user),
    }));
  },
  /* -------------------------
     Logout
  -------------------------- */
  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),
}));
