import * as cartApi from "@/services/cart/cart-service";
import type { AddCartItemPayload, Cart } from "@/services/cart/types";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const cartKey = ["cart"] as const;

export function cartQuery() {
    return queryOptions<Cart | null>({
        queryKey: cartKey,
        queryFn: cartApi.fetchCart,
    });
}

export function useCart() {
    return useQuery(cartQuery());
}

/** Derived selectors mirroring the previous cart-store selectors. */
export function useCartItemsCount(): number {
    return useCart().data?.items_count ?? 0;
}

export function useCartSubtotal(): number {
    return useCart().data?.subtotal ?? 0;
}

export function useCartBranchId(): number | null {
    return useCart().data?.branch?.id ?? null;
}

export function useAddCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AddCartItemPayload) => cartApi.addCartItem(payload),
        onSuccess: (cart) => queryClient.setQueryData(cartKey, cart),
    });
}

export function useUpdateCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
            cartApi.updateCartItem(itemId, quantity),
        onMutate: async ({ itemId, quantity }) => {
            await queryClient.cancelQueries({ queryKey: cartKey });
            const previous = queryClient.getQueryData<Cart | null>(cartKey);

            queryClient.setQueryData<Cart | null>(cartKey, (old) =>
                old
                    ? {
                          ...old,
                          items: old.items.map((item) =>
                              item.id === itemId ? { ...item, quantity } : item,
                          ),
                      }
                    : old,
            );

            return { previous };
        },
        onError: (_error, _vars, context) => {
            if (context) {
                queryClient.setQueryData(cartKey, context.previous);
            }
        },
        onSuccess: (cart) => queryClient.setQueryData(cartKey, cart),
    });
}

export function useRemoveCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemId: number) => cartApi.removeCartItem(itemId),
        onMutate: async (itemId) => {
            await queryClient.cancelQueries({ queryKey: cartKey });
            const previous = queryClient.getQueryData<Cart | null>(cartKey);

            queryClient.setQueryData<Cart | null>(cartKey, (old) => {
                if (!old) return old;
                const remaining = old.items.filter((item) => item.id !== itemId);
                return remaining.length === 0 ? null : { ...old, items: remaining };
            });

            return { previous };
        },
        onError: (_error, _itemId, context) => {
            if (context) {
                queryClient.setQueryData(cartKey, context.previous);
            }
        },
        onSuccess: (cart) => queryClient.setQueryData(cartKey, cart),
    });
}

export function useClearCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => cartApi.clearCart(),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: cartKey });
            const previous = queryClient.getQueryData<Cart | null>(cartKey);
            queryClient.setQueryData<Cart | null>(cartKey, null);
            return { previous };
        },
        onError: (_error, _vars, context) => {
            if (context) {
                queryClient.setQueryData(cartKey, context.previous);
            }
        },
    });
}
