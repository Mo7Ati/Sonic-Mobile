import { Address } from "@/services/addresses/types";



export const getHeaderAddressSummary = (address: Address | null): string | null => {
    if (!address) return null;
    const summary = getAddressFieldsSummary(address);

    const result = summary ? `${address.name} - ${summary}` : address.name;
    return result.length > 20 ? result.substring(0, 25) + '...' : result;
}

export const getAddressFieldsSummary = (address: Address | null): string | null => {
    if (!address) return null;

    return address.fields
        .map((f) => f.value)
        .filter(Boolean)
        .join(', ');
};