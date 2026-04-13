import api, { ApiResponse } from "@/lib/api";
import { ProductDetail } from "./types";

export async function getProduct(id: number): Promise<ProductDetail> {
    const { data } = await api.get<ApiResponse<ProductDetail>>(`/products/${id}`);
    return data.data;
}
