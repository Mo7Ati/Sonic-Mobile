import { getProduct } from "@/services/product/product-service";
import { ProductDetail } from "@/services/product/types";
import { useQuery } from "@tanstack/react-query";

export function useProductDetail(id: number) {
    return useQuery<ProductDetail>({
        queryKey: ["product", id],
        queryFn: () => getProduct(id),
        enabled: !!id,
    });
}
