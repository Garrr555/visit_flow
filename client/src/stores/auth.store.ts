import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("visit-flow-user") || "null"),
  token: localStorage.getItem("visit-flow-token"),
  setAuth: (user, token) => {
    localStorage.setItem("visit-flow-token", token);
    localStorage.setItem("visit-flow-user", JSON.stringify(user));

    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("visit-flow-token");
    localStorage.removeItem("visit-flow-user");

    set({ user: null, token: null });
  },
}));
