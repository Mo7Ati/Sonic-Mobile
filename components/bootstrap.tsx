import { splashApi } from "@/services/splash";
import { usePlatformStore } from "@/stores/platform-store";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

export default function Bootstrap() {

    useEffect(() => {
        (async () => {
            try {
                const data = await splashApi();

                usePlatformStore.setState({
                    customer: data.customer,
                    addresses: data.addresses,
                    platformAddressFields: data.platformAddressFields,
                });
            } catch {
                // Network or server failure — render whatever is in the persisted store
                // (or the empty default). The app remains usable; callers can retry.
            } finally {
                SplashScreen.hide();
            }
        })();
    }, []);

    return null;
}
