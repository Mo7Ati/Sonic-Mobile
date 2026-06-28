import { fetchConfig } from "@/services/config/config-service";
import type { PlatformConfig } from "@/services/config/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const configKey = ["config"] as const;

/**
 * Shared query options for the static platform config. Long-lived: this content
 * rarely changes, so we treat it as fresh for a day and lean on the persister
 * for offline launches.
 */
export function configQuery() {
    return queryOptions<PlatformConfig>({
        queryKey: configKey,
        queryFn: fetchConfig,
        staleTime: 1000 * 60 * 60 * 24,
    });
}

export function useConfig() {
    return useQuery(configQuery());
}

export function useOnboardingSlides() {
    return useConfig().data?.onboardingSlides ?? [];
}

export function useCustomPages() {
    return useConfig().data?.customPages ?? [];
}
