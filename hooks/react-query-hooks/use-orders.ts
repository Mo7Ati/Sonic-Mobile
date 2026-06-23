import { getBranchPaymentMethods, getOrder, getOrders, placeOrder } from "@/services/orders/order-service";
import type { OrdersFilter, PlaceOrderPayload } from "@/services/orders/types";
import { useIsAuthenticated } from "@/stores/auth-store";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const ordersKey = (filter: OrdersFilter) => ["orders", filter] as const;
export const orderKey = (orderId: number) => ["order", orderId] as const;

export function useBranchPaymentMethods(branchId: number | null) {
    return useQuery({
        queryKey: ["branch-payment-methods", branchId],
        queryFn: () => getBranchPaymentMethods(branchId as number),
        enabled: !!branchId,
    });
}

export function useOrders(filter: OrdersFilter = "all") {
    const isAuthenticated = useIsAuthenticated();

    return useInfiniteQuery({
        queryKey: ordersKey(filter),
        queryFn: ({ pageParam }) => getOrders(pageParam, filter),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.meta.current_page < lastPage.meta.last_page
                ? lastPage.meta.current_page + 1
                : undefined,
        enabled: isAuthenticated,
    });
}

export function useOrder(orderId: number | null) {
    const isAuthenticated = useIsAuthenticated();

    return useQuery({
        queryKey: orderKey(orderId ?? 0),
        queryFn: () => getOrder(orderId as number),
        enabled: isAuthenticated && !!orderId,
    });
}

export function usePlaceOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: PlaceOrderPayload) => placeOrder(payload),
        onSuccess: (order) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: orderKey(order.id) });
        },
    });
}
