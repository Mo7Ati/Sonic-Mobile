import api, { type ApiResponse } from "@/lib/api";
import type {
    Order,
    OrdersFilter,
    PaginatedOrders,
    PaymentMethod,
    PlaceOrderPayload,
} from "./types";

export async function getBranchPaymentMethods(
    branchId: number,
): Promise<PaymentMethod[]> {
    const { data } = await api.get<ApiResponse<PaymentMethod[]>>(
        `/branches/${branchId}/payment-methods`,
    );
    return data.data;
}

export async function getOrders(
    page = 1,
    filter: OrdersFilter = "all",
): Promise<PaginatedOrders> {
    const { data } = await api.get<ApiResponse<PaginatedOrders>>("/orders", {
        params: {
            page,
            ...(filter === "active" ? { filter: "active" } : {}),
        },
    });
    return data.data;
}

export async function getOrder(orderId: number): Promise<Order> {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return data.data;
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<Order> {
    const form = new FormData();
    form.append("address_id", String(payload.address_id));
    form.append("payment_method_type", payload.payment_method_type);
    if (payload.notes) {
        form.append("notes", payload.notes);
    }
    form.append("proof", {
        uri: payload.proof.uri,
        name: payload.proof.name,
        type: payload.proof.type,
    } as unknown as Blob);

    const { data } = await api.post<ApiResponse<Order>>("/orders", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
}
