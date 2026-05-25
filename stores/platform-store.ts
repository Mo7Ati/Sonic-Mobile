import { Address, AddressFieldTemplate } from "@/services/addresses/types";
import { Customer } from "@/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PlatformState {
    customer: Customer | null;
    addresses: Address[];
    platformAddressFields: AddressFieldTemplate[];
    /** Client-only: persisted locally, never sent to or read from the API. */
    lastSelectedAddress: Address | null;

    setCustomer: (customer: Customer | null) => void;
    setAddresses: (addresses: Address[]) => void;
    setLastSelectedAddress: (address: Address | null) => void;

    reset: () => void;
}

export const usePlatformStore = create<PlatformState>()(
    persist(
        (set) => ({
            customer: null,
            addresses: [],
            platformAddressFields: [],
            lastSelectedAddress: null,
            setCustomer: (customer) => set({ customer }),
            setAddresses: (addresses) => set({ addresses }),
            setLastSelectedAddress: (address) => set({ lastSelectedAddress: address }),
            reset: () =>
                set({
                    customer: null,
                    addresses: [],
                    platformAddressFields: [],
                    lastSelectedAddress: null,
                }),
        }),
        {
            name: "platform-store",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

export const useCustomer = () => usePlatformStore((state) => state.customer);

export const useAddresses = () => usePlatformStore((state) => state.addresses);

export const usePlatformAddressFields = () => usePlatformStore((state) => state.platformAddressFields);

export const useLastSelectedAddress = () =>
    usePlatformStore((state) => state.lastSelectedAddress ?? state.addresses[state.addresses.length - 1] ?? null);
