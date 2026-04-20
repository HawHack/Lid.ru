import { create } from "zustand";
import {
  clearStoredAuth,
  getAccessToken,
  getRoleFromAccessToken,
  setAccessToken,
  setRefreshToken,
} from "@/shared/lib/auth";

type Role = "candidate" | "employer" | "admin" | null;

type AuthState = {
  role: Role;
  token: string | null;
  login: (role: Exclude<Role, null>, token: string, refreshToken?: string) => void;
  logout: () => void;
};

const getInitialRole = (): Role => {
  return getRoleFromAccessToken(getAccessToken());
};

export const useAuthStore = create<AuthState>((set) => ({
  role: getInitialRole(),
  token: getAccessToken(),

  login: (role, token, refreshToken) => {
    localStorage.setItem("role", role);
    setAccessToken(token);

    if (refreshToken) {
      setRefreshToken(refreshToken);
    }

    set({
      role,
      token,
    });
  },

  logout: () => {
    localStorage.removeItem("role");
    clearStoredAuth();

    set({
      role: null,
      token: null,
    });
  },
}));
