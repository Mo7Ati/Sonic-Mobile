import api, { type ApiResponse } from "@/lib/api";
import type { PlatformConfig } from "@/services/config/types";

/**
 * Public, app-wide static content (onboarding slides + custom pages). Cached
 * aggressively on the client; refetched independently of auth state.
 */
export async function fetchConfig(): Promise<PlatformConfig> {
    const { data } = await api.get<ApiResponse<PlatformConfig>>("/config");
    return data.data;
}
