import { create } from "zustand";

export type AuthStatus = "loading" | "authenticated" | "guest";

/**
 * Client session state: the bearer token and a synchronous auth status used to
 * gate navigation. The token is the durable identity signal (seeded from
 * SecureStore at startup); the authenticated customer object itself is server
 * state and lives in the `['me']` React Query cache, not here.
 */
interface SessionState {
    token: string | null;
    status: AuthStatus;
}

export const useSessionStore = create<SessionState>(() => ({
    token: null,
    status: "loading",
}));

export const useToken = () => useSessionStore((s) => s.token);
export const useAuthStatus = () => useSessionStore((s) => s.status);
export const useIsAuthenticated = () =>
    useSessionStore((s) => s.status === "authenticated");
