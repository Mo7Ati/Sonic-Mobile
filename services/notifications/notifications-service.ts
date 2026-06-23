import api, { type ApiResponse } from "@/lib/api";
import type { DevicePlatform, PaginatedNotifications } from "./types";

export async function registerDeviceToken(
    expoToken: string,
    platform: DevicePlatform,
): Promise<void> {
    await api.post("/device-tokens", { expo_token: expoToken, platform });
}

export async function removeDeviceToken(expoToken: string): Promise<void> {
    await api.delete("/device-tokens", { data: { expo_token: expoToken } });
}

export async function getNotifications(page = 1): Promise<PaginatedNotifications> {
    const { data } = await api.get<ApiResponse<PaginatedNotifications>>(
        "/notifications",
        { params: { page } },
    );
    return data.data;
}

export async function getUnreadCount(): Promise<number> {
    const { data } = await api.get<ApiResponse<{ count: number }>>(
        "/notifications/unread-count",
    );
    return data.data.count;
}

export async function markNotificationAsRead(id: string): Promise<void> {
    await api.post(`/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
    await api.post("/notifications/read-all");
}
