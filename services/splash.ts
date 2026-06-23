import api, { type ApiResponse } from "@/lib/api";
import type { Address, AddressFieldTemplate } from "@/services/addresses/types";
import type { Customer } from "@/services/auth";
import type { OnboardingSlide } from "@/services/onboarding/types";
import type { CustomPages } from "@/stores/platform-config-store";

export interface PlatformData {
    customer: Customer | null;
    addresses: Address[];
    platformAddressFields: AddressFieldTemplate[];
    onboardingSlides: OnboardingSlide[];
    customPages: CustomPages[];
}

export async function splashApi(): Promise<PlatformData> {
    const { data } = await api.get<ApiResponse<PlatformData>>("/splash");
    return data.data;
}
