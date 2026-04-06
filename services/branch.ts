import { Branch } from "@/hooks/react-query-hooks/use-branches-queries";
import api, { ApiResponse } from "./api";

export async function getBranches(storeCategoryId: number, search?: string): Promise<Branch[]> {
    const { data } = await api.get<ApiResponse<Branch[]>>('/branches', {
        params: { store_category_id: storeCategoryId, ...(search ? { search } : {}) },
    });
    return data.data;
}
