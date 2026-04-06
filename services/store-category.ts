import type { Branch } from '@/components/home/types';
import api, { ApiResponse } from './api';

export type StoreCategory = {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    sub_categories?: StoreCategory[];
}

export type StoreCategoryResponse = {
    category: StoreCategory;
    branches: Branch[];
}

export async function getStoreCategory(id: number): Promise<StoreCategoryResponse> {
    const { data } = await api.get<ApiResponse<StoreCategoryResponse>>('/store-categories/' + id);
    return data.data;
}
