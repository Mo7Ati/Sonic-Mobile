import { useQuery } from "@tanstack/react-query";
import { getStoreCategory, type StoreCategoryResponse } from "@/services/store-category";


export function useStoreCategoryById(id: number)  {
    return useQuery<StoreCategoryResponse>({
        queryKey: ['store-category', id],
        queryFn: () => getStoreCategory(id),
        enabled: !!id,
    });
}
