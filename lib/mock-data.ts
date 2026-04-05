import type { Section } from './types';

export const mockSections: Section[] = [
    // ── Search ──────────────────────────────────────────────────────────
    {
        id: 1,
        title: null,
        description: null,
        type: 'search',
        data: null,
    },

    // ── Unpaid Orders Alert ─────────────────────────────────────────────
    {
        id: 2,
        title: null,
        description: null,
        type: 'un_paid_orders',
        data: { orders_count: 2 },
    },

    // ── Main Banners (hero carousel) ────────────────────────────────────
    {
        id: 3,
        title: 'Special Offers',
        description: 'Best deals for you today',
        type: 'main_banners',
        data: [
            { id: 1, type: 'group', data: { image: "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", group_id: 1, name: 'Summer Sale - Up to 50% Off' } },
            { id: 2, type: 'store', data: { image: "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", store_id: 2, name: 'Free Delivery All Weekend' } },
            { id: 3, type: 'store', data: { image: "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", store_id: 3, name: 'New Stores Near You' } },
        ],
    },

    // ── Store Categories ────────────────────────────────────────────────
    {
        id: 4,
        title: 'Categories',
        description: null,
        type: 'store_categories',
        data: [
            { id: 1, name: 'Restaurants' },
            { id: 2, name: 'Grocery' },
            { id: 3, name: 'Pharmacy' },
            { id: 4, name: 'Flowers' },
            { id: 5, name: 'Electronics' },
            { id: 6, name: 'Fashion' },
            { id: 7, name: 'Gaming' },
            { id: 8, name: 'Books' },
        ],
    },

    // ── Active Orders ───────────────────────────────────────────────────
    {
        id: 5,
        title: 'Your Active Orders',
        description: null,
        type: 'active_orders',
        data: [
            {
                id: 101,
                order_number: 'ORD-2048',
                status: 'on_the_way',
                store_name: 'Pizza Palace',
                total: 24.99,
                items_count: 3,
                created_at: '2026-04-04T10:30:00Z',
            },
            {
                id: 102,
                order_number: 'ORD-2047',
                status: 'preparing',
                store_name: 'Fresh Mart',
                total: 67.50,
                items_count: 12,
                created_at: '2026-04-04T09:15:00Z',
            },
        ],
    },

    // ── Square Banners ──────────────────────────────────────────────────
    {
        id: 6,
        title: 'Popular Picks',
        description: 'Trending right now',
        type: 'square_banners',
        data: [
            { id: 10, type: 'store', data: { image: null, store_id: 1, name: 'Burger House' } },
            { id: 11, type: 'store', data: { image: null, store_id: 2, name: 'Sushi World' } },
            { id: 12, type: 'group', data: { image: null, group_id: 1, name: 'Top Rated' } },
            { id: 13, type: 'store', data: { image: null, store_id: 3, name: 'Cafe Latte' } },
            { id: 14, type: 'store_category', data: { image: null, store_category_id: 1, name: 'Desserts' } },
        ],
    },

    // ── Written Banner ──────────────────────────────────────────────────
    {
        id: 7,
        title: null,
        description: 'Order now and get free delivery on your first 3 orders!',
        type: 'written_banner',
        data: {
            name: 'Free Delivery for New Users!',
            text_color: '#ffffff',
            background_color: '#7c3aed',
        },
    },

    // ── Rectangle Banners ───────────────────────────────────────────────
    {
        id: 8,
        title: 'Featured Collections',
        description: null,
        type: 'rectangle_banners',
        data: [
            { id: 20, type: 'group', data: { image: "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", group_id: 1, name: 'Healthy Eats' } },
            { id: 21, type: 'group', data: { image: "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", group_id: 2, name: 'Late Night Deals' } },
            { id: 22, type: 'store_category', data: { image: "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", store_category_id: 2, name: 'Quick Bites' } },
        ],
    },

    // ── Branch List (by store category) ─────────────────────────────────
    {
        id: 9,
        title: 'Top Restaurants',
        description: 'Best rated near you',
        type: 'store_category_list_items',
        store_category_id: 1,
        data: [
            {
                id: 1,
                name: 'Downtown Branch',
                address: '123 Main St',
                store: { id: 1, name: 'Pizza Palace', logo: null },
                rating: 4.8,
                delivery_time: '25-35 min',
                delivery_fee: 2.5,
            },
            {
                id: 2,
                name: 'Mall Branch',
                address: '456 Center Ave',
                store: { id: 2, name: 'Burger House', logo: null },
                rating: 4.5,
                delivery_time: '20-30 min',
                delivery_fee: 1.5,
            },
            {
                id: 3,
                name: 'Airport Road',
                address: '789 Airport Rd',
                store: { id: 3, name: 'Sushi World', logo: null },
                rating: 4.9,
                delivery_time: '30-40 min',
                delivery_fee: 3.0,
            },
            {
                id: 4,
                name: 'City Center',
                address: '321 Park Blvd',
                store: { id: 4, name: 'Cafe Latte', logo: null },
                rating: 4.6,
                delivery_time: '15-25 min',
                delivery_fee: 1.0,
            },
        ],
    },

    // ── Branch List (by group) ──────────────────────────────────────────
    {
        id: 10,
        title: 'Top Rated Stores',
        description: 'Handpicked just for you',
        type: 'group_list_items',
        group_id: 1,
        data: [
            {
                id: 5,
                name: 'Fresh Mart - West',
                address: '555 West Blvd',
                store: { id: 5, name: 'Fresh Mart', logo: null },
                rating: 4.7,
                delivery_time: '20-30 min',
                delivery_fee: 0,
            },
            {
                id: 6,
                name: 'Gadget Zone',
                address: '777 Tech Park',
                store: { id: 6, name: 'Gadget Zone', logo: null },
                rating: 4.4,
                delivery_time: '40-60 min',
                delivery_fee: 5.0,
            },
            {
                id: 7,
                name: 'Book Corner',
                address: '888 Library Rd',
                store: { id: 7, name: 'Book Corner', logo: null },
                rating: 4.9,
                delivery_time: '35-45 min',
                delivery_fee: 2.0,
            },
        ],
    },

    // ── Another Written Banner ──────────────────────────────────────────
    {
        id: 11,
        title: null,
        description: null,
        type: 'written_banner',
        data: {
            name: 'Refer a friend & earn $10 credit!',
            text_color: '#064e3b',
            background_color: '#d1fae5',
        },
    },
];
