import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Address } from "@/services/addresses/types";
import { useAddressesStore } from "@/stores/addresses-store";

/**
 * Client-only app preferences: persisted locally, never sent to or read from
 * the API. Holds first-launch flags, the last selected address, and any other
 * lightweight per-device state.
 */
interface AppPrefsState {
    lastSelectedAddress: Address | null;
    setLastSelectedAddress: (address: Address | null) => void;
    onboardingCompleted: boolean;
    setOnboardingCompleted: (value: boolean) => void;
    /** Clears session-scoped prefs (called on logout). Onboarding stays done. */
    reset: () => void;
}

export const useAppPrefsStore = create<AppPrefsState>()(
    persist(
        (set) => ({
            lastSelectedAddress: null,
            setLastSelectedAddress: (lastSelectedAddress) =>
                set({ lastSelectedAddress }),
            onboardingCompleted: false,
            setOnboardingCompleted: (onboardingCompleted) =>
                set({ onboardingCompleted }),
            reset: () => set({ lastSelectedAddress: null }),
        }),
        {
            name: "app-prefs-store",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

/** Falls back to the most recent address when no explicit selection exists. */
export const useLastSelectedAddress = () => {
    const explicit = useAppPrefsStore((s) => s.lastSelectedAddress);
    const fallback = useAddressesStore(
        (s) => s.addresses[s.addresses.length - 1] ?? null,
    );
    return explicit ?? fallback;
};

export const useOnboardingCompleted = () =>
    useAppPrefsStore((s) => s.onboardingCompleted);
