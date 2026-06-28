import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as addressApi from '@/services/addresses/address-service';
import type {
    Address,
    AddressFieldTemplate,
    StoreAddressPayload,
    UpdateAddressPayload,
} from '@/services/addresses/types';

export const addressesKey = ['addresses'] as const;
export const addressFieldsKey = ['address-fields'] as const;

export function useAddresses() {
    return useQuery<Address[]>({
        queryKey: addressesKey,
        queryFn: addressApi.fetchAddresses,
    });
}

export function useAddressFields() {
    return useQuery<AddressFieldTemplate[]>({
        queryKey: addressFieldsKey,
        queryFn: addressApi.fetchAddressFields,
        staleTime: 1000 * 60 * 60 * 24,
    });
}

export function useCreateAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: StoreAddressPayload) => addressApi.createAddress(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressesKey });
        },
    });
}

export function useUpdateAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateAddressPayload }) =>
            addressApi.updateAddress(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressesKey });
        },
    });
}

export function useDeleteAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => addressApi.deleteAddress(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressesKey });
        },
    });
}
