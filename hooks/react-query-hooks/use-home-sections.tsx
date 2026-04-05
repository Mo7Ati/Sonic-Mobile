import { useQuery } from "@tanstack/react-query";
import { getHomeSections } from "@/services/home";
import { ENV } from "@/config/env";
import { mockSections } from "@/components/home/mockData";
import type { Section } from "@/components/home/types";

export function useHomeSections()  {
    return useQuery<Section[]>({
        queryKey: ['home-sections'],
        queryFn: getHomeSections,
        enabled: !ENV.USE_MOCK_HOME,
        initialData: ENV.USE_MOCK_HOME ? mockSections : undefined,
    });
}