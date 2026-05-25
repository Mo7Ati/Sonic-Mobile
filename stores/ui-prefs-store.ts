import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Address } from "@/services/addresses/types";
import { useAddressesStore } from "@/stores/addresses-store";

interface UiPrefsState {
    /** Client-only: persisted locally, never sent to or read from the API. */
    lastSelectedAddress: Address | null;
    setLastSelectedAddress: (address: Address | null) => void;
    reset: () => void;
}

export const useUiPrefsStore = create<UiPrefsState>()(
    persist(
        (set) => ({
            lastSelectedAddress: null,
            setLastSelectedAddress: (lastSelectedAddress) =>
                set({ lastSelectedAddress }),
            reset: () => set({ lastSelectedAddress: null }),
        }),
        {
            name: "ui-prefs-store",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

/** Falls back to the most recent address when no explicit selection exists. */
export const useLastSelectedAddress = () => {
    const explicit = useUiPrefsStore((s) => s.lastSelectedAddress);
    const fallback = useAddressesStore(
        (s) => s.addresses[s.addresses.length - 1] ?? null,
    );
    return explicit ?? fallback;
};
