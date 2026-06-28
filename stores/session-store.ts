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

let resolveSessionHydrated: () => void = () => {};

/**
 * Resolves once the persisted token has been seeded into the session store at
 * startup. The api request interceptor awaits this so that requests firing from
 * screens mounted on the first frame don't go out before the token exists.
 */
export const sessionHydrated: Promise<void> = new Promise((resolve) => {
    resolveSessionHydrated = resolve;
});

/** Idempotent: marks the session as hydrated, releasing any pending requests. */
export function markSessionHydrated(): void {
    resolveSessionHydrated();
}

export const useToken = () => useSessionStore((s) => s.token);
export const useAuthStatus = () => useSessionStore((s) => s.status);
export const useIsAuthenticated = () =>
    useSessionStore((s) => s.status === "authenticated");
