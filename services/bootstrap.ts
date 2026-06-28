import { isAxiosError } from "axios";
import { configQuery } from "@/hooks/react-query-hooks/use-config";
import { meQuery } from "@/hooks/react-query-hooks/use-me";
import { queryClient } from "@/lib/query-client";
import { getToken } from "@/services/secure-store";
import { useSessionStore } from "@/stores/session-store";

/**
 * App-start orchestrator. Runs once on mount.
 *
 *   1. Seed the persisted token into the session store so the identity request
 *      goes out authenticated and the api interceptor can read it.
 *   2. Resolve identity: only when a token exists, verify it via `/me`.
 *      - success  -> authenticated
 *      - 401       -> stale token; the api interceptor already cleared it, so
 *                     we settle on guest
 *      - offline   -> trust the token as the best available signal
 *   3. No token -> guest.
 *   4. Warm the static config so the welcome/onboarding screen can render
 *      without a skeleton. Addresses and cart are fetched on demand by the
 *      screens that need them.
 */
export async function bootstrap() {
    const token = await getToken();
    useSessionStore.setState({ token });

    if (token) {
        try {
            await queryClient.fetchQuery(meQuery());
            useSessionStore.setState({ status: "authenticated" });
        } catch (error) {
            const isUnauthorized =
                isAxiosError(error) && error.response?.status === 401;
            useSessionStore.setState({
                status: isUnauthorized ? "guest" : "authenticated",
            });
        }
    } else {
        useSessionStore.setState({ status: "guest" });
    }

    queryClient.prefetchQuery(configQuery());
}
