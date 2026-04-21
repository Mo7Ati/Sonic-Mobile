import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as addressApi from '@/services/addresses/address-service';
import type { AddressFieldTemplate, Address, StoreAddressPayload, UpdateAddressPayload } from '@/services/addresses/types';
import Toast from 'react-native-toast-message';

const ADDRESSES_KEY = ['addresses'];
const ADDRESS_FIELDS_KEY = ['address-fields'];

export function useAddressFields() {
    return useQuery<AddressFieldTemplate[]>({
        queryKey: ADDRESS_FIELDS_KEY,
        queryFn: addressApi.fetchAddressFields,
    });
}

export function useAddresses() {
    return useQuery<Address[]>({
        queryKey: ADDRESSES_KEY,
        queryFn: addressApi.fetchAddresses,
    });
}

export function useCreateAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: StoreAddressPayload) => addressApi.createAddress(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
            Toast.show({
                text1: 'Address created successfully',
                type: 'success',
            });
        },
        onError: (error) => {
            Toast.show({
                text1: 'Failed to create address',
                type: 'error',
            });
        },
    });
}

export function useUpdateAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateAddressPayload }) =>
            addressApi.updateAddress(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
        },
    });
}

export function useDeleteAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => addressApi.deleteAddress(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
        },
    });
}
