import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AddressFieldTemplate } from "@/services/addresses/types";
import type { OnboardingSlide } from "@/services/onboarding/types";

export interface CustomPages {
    title: string;
    content: string;
}

interface PlatformConfigState {
    addressFieldTemplates: AddressFieldTemplate[];
    setAddressFieldTemplates: (templates: AddressFieldTemplate[]) => void;
    onboardingSlides: OnboardingSlide[];
    setOnboardingSlides: (slides: OnboardingSlide[]) => void;
    customPages: CustomPages[];
    setCustomPages: (pages: CustomPages[]) => void;
}

export const usePlatformConfigStore = create<PlatformConfigState>()(
    persist(
        (set) => ({
            addressFieldTemplates: [],
            setAddressFieldTemplates: (addressFieldTemplates) =>
                set({ addressFieldTemplates }),
            onboardingSlides: [],
            setOnboardingSlides: (onboardingSlides) =>
                set({ onboardingSlides }),
            customPages: [],
            setCustomPages: (customPages) =>
                set({ customPages }),
        }),
        {
            name: "platform-config-store",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

export const useAddressFieldTemplates = () => usePlatformConfigStore((s) => s.addressFieldTemplates);
export const useOnboardingSlides = () => usePlatformConfigStore((s) => s.onboardingSlides);
