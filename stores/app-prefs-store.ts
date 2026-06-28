import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Address } from "@/services/addresses/types";
import { useAddresses } from "@/hooks/react-query-hooks/use-addresses";

/**
 * Client-only app preferences: persisted locally, never sent to the API. Holds
 * the first-launch flag and the id of the last selected address. The address
 * objects themselves are server state (the `['addresses']` query); we only
 * persist the selected id and resolve the object on read.
 */
interface AppPrefsState {
    lastSelectedAddressId: number | null;
    setLastSelectedAddress: (address: Address | null) => void;
    setLastSelectedAddressId: (id: number | null) => void;
    onboardingCompleted: boolean;
    setOnboardingCompleted: (value: boolean) => void;
    /** Clears session-scoped prefs (called on logout). Onboarding stays done. */
    reset: () => void;
}

export const useAppPrefsStore = create<AppPrefsState>()(
    persist(
        (set) => ({
            lastSelectedAddressId: null,
            setLastSelectedAddress: (address) =>
                set({ lastSelectedAddressId: address?.id ?? null }),
            setLastSelectedAddressId: (lastSelectedAddressId) =>
                set({ lastSelectedAddressId }),
            onboardingCompleted: false,
            setOnboardingCompleted: (onboardingCompleted) =>
                set({ onboardingCompleted }),
            reset: () => set({ lastSelectedAddressId: null }),
        }),
        {
            name: "app-prefs-store",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

/**
 * Resolve the selected address object from the persisted id against the live
 * addresses query, falling back to the most recent address when no explicit
 * selection exists.
 */
export const useLastSelectedAddress = (): Address | null => {
    const selectedId = useAppPrefsStore((s) => s.lastSelectedAddressId);
    const { data } = useAddresses();
    const addresses = data ?? [];

    const explicit =
        selectedId != null
            ? addresses.find((a) => a.id === selectedId) ?? null
            : null;

    return explicit ?? addresses[addresses.length - 1] ?? null;
};

export const useOnboardingCompleted = () =>
    useAppPrefsStore((s) => s.onboardingCompleted);
