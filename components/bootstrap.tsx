import { splashApi } from "@/services/splash";
import { useSplashStore } from "@/stores/splash-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export default function Bootstrap() {

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await splashApi();
                if (cancelled) return;
                useSplashStore.getState().setData(data);
            } catch {
                // Network or server failure — render whatever is in the persisted store
                // (or the empty default). The app remains usable; callers can retry.
            } finally {
                if (!cancelled) {
                    await SplashScreen.hideAsync().catch(() => { });
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return null;
}
