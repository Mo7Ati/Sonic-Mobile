import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SplashData } from "@/services/splash";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SplashState {
    data: SplashData | null;
    setData: (data: SplashData) => void;
    reset: () => void;
}

export const useSplashStore = create<SplashState>()(
    persist(
        (set) => ({
            data: null,
            setData: (data) => set({ data }),
            reset: () => set({ data: null }),
        }),
        {
            name: "splash-store",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

// Selectors
export const selectSplashUser = (state: SplashState) => state.data?.user ?? null;
export const selectSplashAddresses = (state: SplashState) => state.data?.addresses ?? [];
export const selectSplashAddressFields = (state: SplashState) =>
    state.data?.addressFields ?? [];
