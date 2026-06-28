import { QueryClient } from "@tanstack/react-query";

/**
 * The single, app-wide QueryClient.
 *
 * Exported as a module singleton so that non-React code — the axios
 * interceptor, the bootstrap orchestrator, and the logout flow — can reach the
 * cache (e.g. `queryClient.clear()`, `prefetchQuery`) without a React context.
 * The same instance is handed to `PersistQueryClientProvider` in the root
 * layout, so UI and imperative code share one cache.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60_000,
            retry: 2,
            refetchOnWindowFocus: false,
            // Persisted offline cache: keep entries around long enough to
            // survive restarts so returning users see data instantly.
            gcTime: 1000 * 60 * 60 * 24,
        },
    },
});
