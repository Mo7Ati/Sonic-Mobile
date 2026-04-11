import { Branch } from "./types";
import api, { ApiResponse } from "../api";

export interface BranchFilters {
    store_category_id: number;
    search?: string;
    sort_by?: "rating" | "delivery_time" | "delivery_fee";
    offers?: boolean;
    rating_4_plus?: boolean;
    fast_delivery?: boolean;
}

export interface PaginatedBranches {
    data: Branch[];
    current_page: number;
    last_page: number;
}

export async function getBranches(filters: BranchFilters, page: number = 1): Promise<PaginatedBranches> {
    const { data } = await api.get<ApiResponse<PaginatedBranches>>('/branches', {
        params: { ...filters, page },
    });
    return data.data;
}

export async function getBranch(id: number): Promise<Branch> {
    const { data } = await api.get<ApiResponse<Branch>>(`/branches/${id}`);
    return data.data;
}
