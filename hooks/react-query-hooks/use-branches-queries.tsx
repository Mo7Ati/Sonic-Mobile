import { BranchFilters, getBranches } from "@/services/branch/branch-service";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";


export function useBranches(filters: BranchFilters) {
    return useInfiniteQuery({
        queryKey: ['branches', filters],
        queryFn: ({ pageParam }) => getBranches(filters, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.current_page < lastPage.last_page
                ? lastPage.current_page + 1
                : undefined,
        enabled: !!filters.store_category_id,
        // placeholderData: keepPreviousData,
    });
}
