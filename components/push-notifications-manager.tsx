import { usePushNotifications } from "@/hooks/use-push-notifications";

/**
 * Headless component that activates push notifications. Rendered inside the
 * React Query and Router providers so the hook can use both.
 */
export default function PushNotificationsManager() {
    usePushNotifications();
    return null;
}
