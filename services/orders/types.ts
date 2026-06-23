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

export interface OrderStatus {
    value: string;
    label: string;
    textColor?: string;
    backgroundColor?: string;
}

export interface OrderBranch {
    id: number;
    store_id: number;
    name: string;
    logo: string | null;
}

export interface OrderItemOption {
    id: number;
    group_id?: number;
    name: string | Record<string, string>;
    price?: number;
}

export interface OrderItemAddition {
    id: number;
    name: string | Record<string, string>;
    price?: number;
}

export interface OrderItem {
    id: number;
    product_id: number;
    name: string | Record<string, string>;
    image?: string | null;
    quantity: number;
    unit_price: number;
    options_data?: OrderItemOption[] | null;
    options_amount?: number;
    additions_data?: OrderItemAddition[] | null;
    additions_amount?: number;
    total_price: number;
}

export interface Order {
    id: number;
    status: OrderStatus;
    payment_status: OrderStatus;
    payment_method?: Record<string, unknown> | null;
    payment_proof?: string | null;
    branch: OrderBranch;
    address_data?: Record<string, unknown> | null;
    total: number;
    total_items_amount: number;
    delivery_amount: number;
    items: OrderItem[];
    notes: string | null;
    created_at: string;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface PaginatedOrders {
    data: Order[];
    meta: PaginationMeta;
}

export type OrdersFilter = "all" | "active";
