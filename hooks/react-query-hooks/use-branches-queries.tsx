import { Store } from "@/components/home/types";
import { BranchFilters, getBranches } from "@/services/branch";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

export interface Branch {
    id: number;
    name: string;
    address?: string;
    store: Store;
    rating?: number;
    ratings_count?: number;
    delivery_time?: string;
    delivery_fee?: number;
    delivery_fee_before_discount?: number;
}

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
        placeholderData: keepPreviousData,
    });
}
