import { Address } from "@/services/addresses/types";

export const SHEKEL_SYMBOL = "₪";

export function formatAmount(value: number | string): string {
    const amount = typeof value === "number" ? value : Number(value);

    if (!Number.isFinite(amount)) {
        return String(value);
    }

    return `${SHEKEL_SYMBOL} ${amount.toFixed(2)}`;
}

// addresses utils

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