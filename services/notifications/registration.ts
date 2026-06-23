import {
    clearCachedPushToken,
    currentPlatform,
    getCachedPushToken,
    getExpoPushToken,
} from "./push";
import { registerDeviceToken, removeDeviceToken } from "./notifications-service";

/**
 * Fetch this device's Expo push token and upload it to the backend.
 * Safe to call repeatedly — the server upserts by token.
 */
export async function syncPushToken(): Promise<void> {
    try {
        const token = await getExpoPushToken();
        if (!token) return;
        await registerDeviceToken(token, currentPlatform());
    } catch (error) {
        console.warn("[push] token sync failed", error);
    }
}

/**
 * Best-effort removal of this device's token from the server (on logout) so
 * the next user on this device doesn't receive the previous user's pushes.
 */
export async function unregisterPushToken(): Promise<void> {
    try {
        const token = await getCachedPushToken();
        if (token) await removeDeviceToken(token);
    } catch {
        // Ignore — the server prunes stale tokens when a send fails.
    } finally {
        await clearCachedPushToken();
    }
}
