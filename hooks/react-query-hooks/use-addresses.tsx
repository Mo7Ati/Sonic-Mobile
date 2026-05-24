import { useMutation } from '@tanstack/react-query';
import * as addressApi from '@/services/addresses/address-service';
import type { Address, StoreAddressPayload, UpdateAddressPayload } from '@/services/addresses/types';
import Toast from 'react-native-toast-message';

export function useCreateAddress() {
    return useMutation({
        mutationFn: (payload: StoreAddressPayload) => addressApi.createAddress(payload),
    });
}

export function useUpdateAddress() {
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateAddressPayload }) =>
            addressApi.updateAddress(id, payload),
    });
}

export function useDeleteAddress() {
    return useMutation({
        mutationFn: (id: number) => addressApi.deleteAddress(id),
    });
}
