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