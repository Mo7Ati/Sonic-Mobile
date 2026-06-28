import { meApi } from "@/services/customer";
import type { Customer } from "@/services/auth";
import { useIsAuthenticated } from "@/stores/session-store";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const meKey = ["me"] as const;

/**
 * Shared query options for the authenticated customer. Used both by the
 * `useCustomer()` hook and by the bootstrap orchestrator's `fetchQuery`.
 */
export function meQuery() {
    return queryOptions<Customer>({
        queryKey: meKey,
        queryFn: meApi,
    });
}

export function useCustomer() {
    const isAuthenticated = useIsAuthenticated();

    return useQuery({
        ...meQuery(),
        enabled: isAuthenticated,
    });
}
