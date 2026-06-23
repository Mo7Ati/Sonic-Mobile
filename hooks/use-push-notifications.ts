import {
    notificationsKey,
    unreadCountKey,
} from "@/hooks/react-query-hooks/use-notifications";
import {
    configureNotificationHandler,
    ensureAndroidChannel,
} from "@/services/notifications/push";
import { syncPushToken } from "@/services/notifications/registration";
import type { AppNotificationData } from "@/services/notifications/types";
import { useAuthStore } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, type Router } from "expo-router";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";

// Set the foreground presentation behavior once, at module load.
configureNotificationHandler();

/**
 * Wires up push notifications for the app:
 *   - registers this device's Expo token once the user is authenticated,
 *   - refreshes notification/order caches when a push lands in the foreground,
 *   - routes the user to the right screen when a notification is tapped.
 *
 * Mounted once, inside the React Query + Router providers.
 */
export function usePushNotifications(): void {
    const router = useRouter();
    const queryClient = useQueryClient();
    const status = useAuthStore((s) => s.status);
    const registeredRef = useRef(false);

    useEffect(() => {
        void ensureAndroidChannel();
    }, []);

    useEffect(() => {
        if (status === "authenticated" && !registeredRef.current) {
            registeredRef.current = true;
            void syncPushToken();
        }

        if (status === "guest") {
            registeredRef.current = false;
        }
    }, [status]);

    useEffect(() => {
        const received = Notifications.addNotificationReceivedListener(() => {
            queryClient.invalidateQueries({ queryKey: notificationsKey });
            queryClient.invalidateQueries({ queryKey: unreadCountKey });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        });

        const responded = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                routeFromNotification(
                    response.notification.request.content.data as AppNotificationData,
                    router,
                );
            },
        );

        // Cold start: the app was opened by tapping a notification.
        void Notifications.getLastNotificationResponseAsync().then((response) => {
            if (response) {
                routeFromNotification(
                    response.notification.request.content.data as AppNotificationData,
                    router,
                );
            }
        });

        return () => {
            received.remove();
            responded.remove();
        };
    }, [queryClient, router]);
}

function routeFromNotification(data: AppNotificationData, router: Router): void {
    if (data?.type === "order_status") {
        router.push("/orders");
        return;
    }

    router.push("/notifications");
}
