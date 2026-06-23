export type NotificationType = "order_status" | "custom";

export interface AppNotificationData {
    type?: NotificationType;
    order_id?: number;
    status?: string;
    status_label?: string;
    title?: string;
    body?: string;
    [key: string]: unknown;
}

export interface AppNotification {
    id: string;
    type: NotificationType | null;
    title: string | null;
    body: string | null;
    data: AppNotificationData;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface PaginatedNotifications {
    data: AppNotification[];
    meta: PaginationMeta;
}

export type DevicePlatform = "ios" | "android" | "web";
