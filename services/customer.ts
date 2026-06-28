import api, { type ApiResponse } from "@/lib/api";
import type { Customer } from "@/services/auth";

/**
 * Resolve the authenticated customer. Returns 401 when the token is missing or
 * stale, which the bootstrap flow and the api interceptor turn into a guest
 * downgrade.
 */
export async function meApi(): Promise<Customer> {
    const { data } = await api.get<ApiResponse<Customer>>("/me");
    return data.data;
}
