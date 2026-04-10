import { Store } from "@/components/home/types";
import { getBranches } from "@/services/branch";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

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

export function useBranches(storeCategoryId: number, search?: string, initialData?: Branch[]) {
    return useQuery<Branch[]>({
        queryKey: ['branches', storeCategoryId, search ?? ''],
        queryFn: () => getBranches(storeCategoryId, search),
        enabled: !!storeCategoryId,
        initialData,
        placeholderData: keepPreviousData,
    });
}
