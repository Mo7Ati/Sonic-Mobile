import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const SESSION_KEY = "guest_session_id";

let cachedSessionId: string | null = null;

export async function getOrCreateSessionId(): Promise<string> {
    if (cachedSessionId) return cachedSessionId;

    let sessionId = await AsyncStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = Crypto.randomUUID();
        await AsyncStorage.setItem(SESSION_KEY, sessionId);
    }

    cachedSessionId = sessionId;
    return sessionId;
}

export async function clearSessionId(): Promise<void> {
    cachedSessionId = null;
    await AsyncStorage.removeItem(SESSION_KEY);
}
