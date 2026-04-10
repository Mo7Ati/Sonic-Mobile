import type { Section } from "@/services/home/home-types";
import { ENV } from "@/config/env";
import { getHomeSections } from "@/services/home/home-service";
import { useQuery } from "@tanstack/react-query";

export function useHomeSections()  {
    return useQuery<Section[]>({
        queryKey: ['home-sections'],
        queryFn: getHomeSections,
    });
}