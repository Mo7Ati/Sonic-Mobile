import api, { type ApiResponse } from "@/lib/api";
import type { Address, AddressFieldTemplate } from "@/services/addresses/types";
import type { Customer } from "@/services/auth";

export interface SplashData {
    user: Customer | null;
    addresses: Address[];
    addressFields: AddressFieldTemplate[];
}

export async function splashApi(): Promise<SplashData> {
    const { data } = await api.get<ApiResponse<SplashData>>("/splash");
    return data.data;
}
