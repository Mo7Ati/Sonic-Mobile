import { create } from "zustand";
import type { Customer } from "@/services/auth";

export type AuthStatus = "loading" | "authenticated" | "guest";

interface AuthState {
    user: Customer | null;
    token: string | null;
    status: AuthStatus;
}

export const useAuthStore = create<AuthState>(() => ({
    user: null,
    token: null,
    status: "loading",
}));

export const useUser = () => useAuthStore((s) => s.user);
export const useToken = () => useAuthStore((s) => s.token);
export const useAuthStatus = () => useAuthStore((s) => s.status);
export const useIsAuthenticated = () => useAuthStore((s) => s.status === "authenticated");
