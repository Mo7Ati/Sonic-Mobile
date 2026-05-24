import { Address } from "@/services/addresses/types";

export const getAddressSummary = (address: Address | null): string | null => {
    if (!address) return null;

    return address.fields
        .map((f) => f.value)
        .filter(Boolean)
        .join(', ');
};