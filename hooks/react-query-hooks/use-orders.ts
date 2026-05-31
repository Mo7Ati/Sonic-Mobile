import {
    getBranchPaymentMethods,
    placeOrder,
} from "@/services/orders/order-service";
import type { PlaceOrderPayload } from "@/services/orders/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useBranchPaymentMethods(branchId: number | null) {
    return useQuery({
        queryKey: ["branch-payment-methods", branchId],
        queryFn: () => getBranchPaymentMethods(branchId as number),
        enabled: !!branchId,
    });
}

export function usePlaceOrder() {
    return useMutation({
        mutationFn: (payload: PlaceOrderPayload) => placeOrder(payload),
    });
}
