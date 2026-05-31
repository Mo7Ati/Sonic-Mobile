export type PaymentMethodType = "bop" | "palpay" | "jawwal_pay";

export interface PaymentMethod {
    id: number;
    type: { value: PaymentMethodType; label: string };
    beneficiary_name: string;
    account_number: string | null;
    phone_number: string | null;
    instructions: string | null;
}

export interface ProofFile {
    uri: string;
    name: string;
    type: string;
}

export interface PlaceOrderPayload {
    address_id: number;
    payment_method_type: PaymentMethodType;
    proof: ProofFile;
    notes?: string;
}

export interface Order {
    id: number;
    status: { value: string; label: string };
    payment_status: { value: string; label: string };
    total: number;
    total_items_amount: number;
    delivery_amount: number;
    created_at: string;
}
