import { Product } from "@/services/product/types";


export type BranchStatus = "available" | "busy" | "coming_soon" | "closed";


export interface Category {
    id: number;
    name: string;
    description: string | null;
}

export interface Branch {
    id: number;
    name: string;
    description: string | null;
    logo: string | null;
    cover_image: string | null;
    address: string | null;
    location: string | Record<string, any>; // depends if it's string or JSON
    delivery_time: string | null;
    delivery_fee: number | null;
    status: {
        label: string;
        value: BranchStatus;
        textColor: string;
        backgroundColor: string;
    };
    categories?: Category[];
    products?: Record<Category['name'], Product[]>;
}
