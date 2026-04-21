import api, { type ApiResponse } from '@/lib/api';
import type {
    Address,
    AddressFieldTemplate,
    StoreAddressPayload,
    UpdateAddressPayload,
} from './types';

export async function fetchAddressFields(): Promise<AddressFieldTemplate[]> {
    const { data } = await api.get<ApiResponse<AddressFieldTemplate[]>>('/addresses/fields');
    return data.data;
}

export async function fetchAddresses(): Promise<Address[]> {
    const { data } = await api.get<ApiResponse<Address[]>>('/addresses');
    return data.data;
}

export async function fetchAddress(id: number): Promise<Address> {
    const { data } = await api.get<ApiResponse<Address>>(`/addresses/${id}`);
    return data.data;
}

export async function createAddress(payload: StoreAddressPayload): Promise<Address> {
    const { data } = await api.post<ApiResponse<Address>>('/addresses', payload);
    return data.data;
}

export async function updateAddress(id: number, payload: UpdateAddressPayload): Promise<Address> {
    const { data } = await api.put<ApiResponse<Address>>(`/addresses/${id}`, payload);
    return data.data;
}

export async function deleteAddress(id: number): Promise<void> {
    await api.delete(`/addresses/${id}`);
}
