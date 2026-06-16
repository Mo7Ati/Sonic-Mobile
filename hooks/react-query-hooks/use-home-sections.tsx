import type { Section } from "@/services/home/home-types";
import { getHomeSections } from "@/services/home/home-service";
import { useQuery } from "@tanstack/react-query";

export function useHomeSections(addressId?: number | string | null) {
    return useQuery<Section[]>({
        queryKey: ['home-sections', addressId ?? null],
        queryFn: getHomeSections,
    });
}