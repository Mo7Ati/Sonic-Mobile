import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AddressFieldTemplate } from "@/services/addresses/types";

interface PlatformConfigState {
    addressFieldTemplates: AddressFieldTemplate[];
    setAddressFieldTemplates: (templates: AddressFieldTemplate[]) => void;
}

export const usePlatformConfigStore = create<PlatformConfigState>()(
    persist(
        (set) => ({
            addressFieldTemplates: [],
            setAddressFieldTemplates: (addressFieldTemplates) =>
                set({ addressFieldTemplates }),
        }),
        {
            name: "platform-config-store",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

export const useAddressFieldTemplates = () => usePlatformConfigStore((s) => s.addressFieldTemplates);
