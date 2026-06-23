import {
    getNotifications,
    getUnreadCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/services/notifications/notifications-service";
import { useIsAuthenticated } from "@/stores/auth-store";
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

export const notificationsKey = ["notifications"] as const;
export const unreadCountKey = ["notifications-unread"] as const;

export function useNotifications() {
    const isAuthenticated = useIsAuthenticated();

    return useInfiniteQuery({
        queryKey: notificationsKey,
        queryFn: ({ pageParam }) => getNotifications(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.meta.current_page < lastPage.meta.last_page
                ? lastPage.meta.current_page + 1
                : undefined,
        enabled: isAuthenticated,
    });
}

export function useUnreadCount() {
    const isAuthenticated = useIsAuthenticated();

    return useQuery({
        queryKey: unreadCountKey,
        queryFn: getUnreadCount,
        enabled: isAuthenticated,
        staleTime: 30_000,
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => markNotificationAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationsKey });
            queryClient.invalidateQueries({ queryKey: unreadCountKey });
        },
    });
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => markAllNotificationsAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationsKey });
            queryClient.invalidateQueries({ queryKey: unreadCountKey });
        },
    });
}
