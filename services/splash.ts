import api, { type ApiResponse } from "@/lib/api";
import type { Address, AddressFieldTemplate } from "@/services/addresses/types";
import type { Customer } from "@/services/auth";

export interface PlatformData {
    customer: Customer | null;
    addresses: Address[];
    platformAddressFields: AddressFieldTemplate[];
}

export async function splashApi(): Promise<PlatformData> {
    const { data } = await api.get<ApiResponse<PlatformData>>("/splash");
    return data.data;
}
