export interface CartBranch {
    id: number;
    name: string;
    logo: string | null;
    address: string | null;
}

export interface CartItemOption {
    group_id: number;
    group_name: string;
    item_id: number;
    item_name: string;
    price: number;
}

export interface CartItemAddition {
    id: number;
    name: string;
    price: number;
}

export interface CartItem {
    id: number;
    product_id: number;
    name: string;
    image: string | null;
    quantity: number;
    unit_price: number;
    compare_price: number | null;
    options_data: CartItemOption[] | null;
    options_amount: number;
    additions_data: CartItemAddition[] | null;
    additions_amount: number;
    total_price: number;
}

export interface Cart {
    id: number;
    branch: CartBranch;
    items: CartItem[];
    items_count: number;
    subtotal: number;
}

export interface AddCartItemPayload {
    branch_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    options?: CartItemOption[];
    additions?: CartItemAddition[];
    force_replace?: boolean;
}
