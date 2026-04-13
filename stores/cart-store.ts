import * as cartApi from "@/services/cart/cart-service";
import type { AddCartItemPayload, Cart } from "@/services/cart/types";
import { create } from "zustand";

interface CartState {
    cart: Cart | null;
    isLoading: boolean;

    fetchCart: () => Promise<void>;
    addItem: (
        payload: AddCartItemPayload,
    ) => Promise<{ success: boolean; conflict?: boolean }>;
    updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    setCart: (cart: Cart | null) => void;
    reset: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
    cart: null,
    isLoading: false,

    fetchCart: async () => {
        set({ isLoading: true });
        try {
            const cart = await cartApi.fetchCart();
            set({ cart, isLoading: false });
        } catch {
            set({ isLoading: false });
        }
    },

    addItem: async (payload) => {
        set({ isLoading: true });
        try {
            const cart = await cartApi.addCartItem(payload);
            set({ cart, isLoading: false });
            return { success: true };
        } catch (e: any) {
            set({ isLoading: false });
            if (e.response?.status === 409) {
                return { success: false, conflict: true };
            }
            return { success: false };
        }
    },

    updateItemQuantity: async (itemId, quantity) => {
        const prevCart = get().cart;

        // Optimistic update
        if (prevCart) {
            set({
                cart: {
                    ...prevCart,
                    items: prevCart.items.map((item) =>
                        item.id === itemId ? { ...item, quantity } : item,
                    ),
                },
            });
        }

        try {
            const cart = await cartApi.updateCartItem(itemId, quantity);
            set({ cart });
        } catch {
            set({ cart: prevCart });
        }
    },

    removeItem: async (itemId) => {
        const prevCart = get().cart;

        // Optimistic remove
        if (prevCart) {
            const remaining = prevCart.items.filter(
                (item) => item.id !== itemId,
            );
            set({
                cart:
                    remaining.length === 0
                        ? null
                        : { ...prevCart, items: remaining },
            });
        }

        try {
            const cart = await cartApi.removeCartItem(itemId);
            set({ cart });
        } catch {
            set({ cart: prevCart });
        }
    },

    clearCart: async () => {
        const prevCart = get().cart;
        set({ cart: null });
        try {
            await cartApi.clearCart();
        } catch {
            set({ cart: prevCart });
        }
    },

    setCart: (cart) => set({ cart }),
    reset: () => set({ cart: null, isLoading: false }),
}));

// Selectors
export const selectItemsCount = (state: CartState) =>
    state.cart?.items_count ?? 0;
export const selectCartBranchId = (state: CartState) =>
    state.cart?.branch?.id ?? null;
export const selectSubtotal = (state: CartState) =>
    state.cart?.subtotal ?? 0;
