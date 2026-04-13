import api, { type ApiResponse } from "@/lib/api";
import type { AddCartItemPayload, Cart } from "./types";

export async function fetchCart(): Promise<Cart | null> {
    const { data } = await api.get<ApiResponse<Cart | null>>("/cart");
    return data.data;
}

export async function addCartItem(payload: AddCartItemPayload): Promise<Cart> {
    const { data } = await api.post<ApiResponse<Cart>>("/cart/items", payload);
    return data.data;
}

export async function updateCartItem(
    id: number,
    quantity: number,
): Promise<Cart> {
    const { data } = await api.put<ApiResponse<Cart>>(`/cart/items/${id}`, {
        quantity,
    });
    return data.data;
}

export async function removeCartItem(id: number): Promise<Cart | null> {
    const { data } = await api.delete<ApiResponse<Cart | null>>(
        `/cart/items/${id}`,
    );
    return data.data;
}

export async function clearCart(): Promise<void> {
    await api.delete("/cart");
}
