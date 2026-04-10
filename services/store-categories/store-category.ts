import api, { ApiResponse } from '../api';
import { StoreCategory } from './types';

export async function getStoreCategory(id: number): Promise<StoreCategory> {
    const { data } = await api.get<ApiResponse<StoreCategory>>('/store-categories/' + id);
    return data.data;
}
