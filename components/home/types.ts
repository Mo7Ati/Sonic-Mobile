// ── Section Types (matching Laravel API) ──────────────────────────────

export interface Section {
  id: number;
  title: string | null;
  description: string | null;
  type: string;
  data: SectionItem[] | WrittenBannerData | StoreCategoryItem[] | ActiveOrder[] | Branch[] | UnPaidOrdersData | null;
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

// ── Written Banner ────────────────────────────────────────────────────

export interface WrittenBannerData {
  name: string;
  text_color: string;
  background_color: string;
}

// ── Store Category ────────────────────────────────────────────────────

export interface StoreCategoryItem {
  id: number;
  name: string;
  image?: string | null;
}

// ── Branch (for LIST_ITEMS sections) ──────────────────────────────────

export interface Branch {
  id: number;
  name: string;
  address?: string;
  store: Store;
  rating?: number;
  ratings_count?: number;
  delivery_time?: string;
  delivery_fee?: number;
  delivery_fee_before_discount?: number;
}

export interface Store {
  id: number;
  name: string;
  logo?: string;
  cover_image?: string;
}

// ── Active Order ──────────────────────────────────────────────────────

export interface ActiveOrder {
  id: number;
  order_number: string;
  status: string;
  store_name?: string;
  total: number;
  items_count: number;
  created_at: string;
}

// ── Unpaid Orders ─────────────────────────────────────────────────────

export interface UnPaidOrdersData {
  orders_count: number;
}

// ── Callbacks ─────────────────────────────────────────────────────────

export interface SectionCallbacks {
  onBannerPress?: (item: SectionItem) => void;
  onCategoryPress?: (category: StoreCategoryItem) => void;
  onBranchPress?: (branch: Branch) => void;
  onOrderPress?: (order: ActiveOrder) => void;
  onUnPaidPress?: () => void;
  onSearchPress?: () => void;
  onSeeAllPress?: (section: Section) => void;
}
