export interface AddressFieldTemplate {
    key: string;
    label: Record<string, string>;
    is_required: boolean;
}

export interface AddressFieldValue {
    key: string;
    value: string;
}

export interface Address {
    id: number;
    name: string;
    fields: AddressFieldValue[];
    created_at: string;
    updated_at: string;
}

export interface StoreAddressPayload {
    name: string;
    fields: Record<string, string>;
}

export interface UpdateAddressPayload {
    name: string;
    fields: Record<string, string>;
}
