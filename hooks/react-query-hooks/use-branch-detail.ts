import { getBranch } from "@/services/branch/branch-service";
import { Branch } from "@/services/branch/types";
import { useQuery } from "@tanstack/react-query";

export function useBranchDetail(id: number) {
    return useQuery<Branch>({
        queryKey: ['branch', id],
        queryFn: () => getBranch(id),
        enabled: !!id,
    });
}
