import { getStoreCategory } from "@/services/store-categories/store-category";
import { useQuery } from "@tanstack/react-query";
import { StoreCategory } from "@/services/store-categories/types";


export function useStoreCategoryById(id: number) {
    return useQuery<StoreCategory>({
        queryKey: ['store-category', id],
        queryFn: () => getStoreCategory(id),
        enabled: !!id,
    });
}
