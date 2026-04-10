export type StoreCategory = {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    sub_categories: StoreCategory[] | null;
}