import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Address } from "@/services/addresses/types";

interface AddressesState {
    addresses: Address[];
    setAddresses: (addresses: Address[]) => void;
    addAddress: (address: Address) => void;
    updateAddress: (address: Address) => void;
    removeAddress: (id: number) => void;
    reset: () => void;
}

export const useAddressesStore = create<AddressesState>()(
    persist(
        (set, get) => ({
            addresses: [],
            setAddresses: (addresses) => set({ addresses }),
            addAddress: (address) =>
                set({ addresses: [address, ...get().addresses] }),
            updateAddress: (address) =>
                set({
                    addresses: get().addresses.map((a) =>
                        a.id === address.id ? address : a,
                    ),
                }),
            removeAddress: (id) =>
                set({ addresses: get().addresses.filter((a) => a.id !== id) }),
            reset: () => set({ addresses: [] }),
        }),
        {
            name: "addresses-store",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

export const useAddresses = () => useAddressesStore((s) => s.addresses);
