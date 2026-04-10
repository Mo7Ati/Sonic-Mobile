// ── Section Types (matching Laravel API) ──────────────────────────────

import { Branch } from "../branch/types";
import { StoreCategory } from "../store-categories/types";

export interface Section {
    id: number;
    title: string | null;
    description: string | null;
    type: string;
    data: SectionItem[] | WrittenBannerData | StoreCategory[] | Branch[] | UnPaidOrdersData | null;
    store_category_id?: number;
    group_id?: number;
}

// ── Section Item (banners, list items) ────────────────────────────────

export interface SectionItem {
    id: number;
    type: string;
    data: {
        image: string | null;
        name?: string;
        group_id?: number;
        store_id?: number;
        store_category_id?: number;
        external_link?: string;
    };
}

// ── Banner ( Main Banners, Square Banners, Rectangle Banners ) ────────────────────────────────────────────────────

export interface BannerData {
    image: string | null;
    name?: string;
    group_id?: number;
    store_id?: number;
    store_category_id?: number;
    external_link?: string;
}

// ── Written Banner ────────────────────────────────────────────────────

export interface WrittenBannerData {
    name: string;
    text_color: string;
    background_color: string;
}

// ── Unpaid Orders ─────────────────────────────────────────────────────

export interface UnPaidOrdersData {
    orders_count: number;
}

