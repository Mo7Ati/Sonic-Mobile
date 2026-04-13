export interface Product {
    id: number;
    name: string;
    description: string | null;
    keywords: string[];
    price: number;
    compare_price: number | null;
    quantity: number | null;
    image: string | null;
}

export interface OptionItem {
    id: number;
    name: string;
    price: string;
}

export interface OptionGroup {
    group_id: number;
    group: string;
    items: OptionItem[];
}

export interface Addition {
    id: number;
    name: string;
    price: string;
}

export interface ProductDetail extends Product {
    category: {
        id: number;
        name: string;
        description: string;
    };
    options: OptionGroup[];
    additions: Addition[];
}