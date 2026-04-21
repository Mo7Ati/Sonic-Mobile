import * as addressApi from '@/services/addresses/address-service';
import type { Address, AddressFieldTemplate } from '@/services/addresses/types';
import { create } from 'zustand';

interface AddressState {
    addresses: Address[];
    selectedAddress: Address | null;
    fieldTemplates: AddressFieldTemplate[];
    isLoading: boolean;

    fetchFieldTemplates: () => Promise<void>;
    fetchAddresses: () => Promise<void>;
    setSelectedAddress: (address: Address | null) => void;
    reset: () => void;
}

export const useAddressStore = create<AddressState>()((set, get) => ({
    addresses: [],
    selectedAddress: null,
    fieldTemplates: [],
    isLoading: false,

    fetchFieldTemplates: async () => {
        try {
            const templates = await addressApi.fetchAddressFields();
            set({ fieldTemplates: templates });
        } catch {
            // keep existing templates on error
        }
    },

    fetchAddresses: async () => {
        set({ isLoading: true });
        try {
            const addresses = await addressApi.fetchAddresses();
            const current = get().selectedAddress;
            set({
                addresses,
                isLoading: false,
                // Auto-select first address if nothing is selected
                selectedAddress: current ?? addresses[0] ?? null,
            });
        } catch {
            set({ isLoading: false });
        }
    },

    setSelectedAddress: (address) => set({ selectedAddress: address }),

    reset: () =>
        set({
            addresses: [],
            selectedAddress: null,
            fieldTemplates: [],
            isLoading: false,
        }),
}));

// Selectors
export const selectSelectedAddress = (state: AddressState) => state.selectedAddress;
export const selectAddresses = (state: AddressState) => state.addresses;
export const selectFieldTemplates = (state: AddressState) => state.fieldTemplates;
export const selectHasAddresses = (state: AddressState) => state.addresses.length > 0;
