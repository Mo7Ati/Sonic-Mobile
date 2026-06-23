import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { DevicePlatform } from "./types";

const PUSH_TOKEN_KEY = "expo_push_token";
export const ANDROID_CHANNEL_ID = "default";

/**
 * Decide how a notification behaves when it arrives while the app is in the
 * foreground. Set once at module load.
 */
export function configureNotificationHandler(): void {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
}

/**
 * Android requires an explicit channel; its id must match the `channelId` the
 * backend sends on each message.
 */
export async function ensureAndroidChannel(): Promise<void> {
    if (Platform.OS !== "android") return;

    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: "Default",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#F59E0B",
    });
}

export function currentPlatform(): DevicePlatform {
    if (Platform.OS === "ios") return "ios";
    if (Platform.OS === "android") return "android";
    return "web";
}

async function requestPermission(): Promise<boolean> {
    const settings = await Notifications.getPermissionsAsync();
    let granted = settings.status === "granted";

    if (!granted) {
        const request = await Notifications.requestPermissionsAsync();
        granted = request.status === "granted";
    }

    return granted;
}

function resolveProjectId(): string | undefined {
    return (
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId
    );
}

/**
 * Request permission and fetch this device's Expo push token.
 * Returns null on a non-device, when permission is denied, or on error.
 */
export async function getExpoPushToken(): Promise<string | null> {
    if (!Device.isDevice) {
        console.warn("[push] Push notifications require a physical device.");
        return null;
    }

    await ensureAndroidChannel();

    if (!(await requestPermission())) return null;

    const projectId = resolveProjectId();
    if (!projectId) {
        console.warn("[push] Missing EAS projectId; cannot fetch push token.");
        return null;
    }

    try {
        const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
        await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
        return token;
    } catch (error) {
        console.warn("[push] Failed to fetch Expo push token", error);
        return null;
    }
}

export async function getCachedPushToken(): Promise<string | null> {
    return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

export async function clearCachedPushToken(): Promise<void> {
    await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
}
