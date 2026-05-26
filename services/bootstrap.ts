import { getToken, removeToken } from "@/services/secure-store";
import { splashApi } from "@/services/splash";
import { useAddressesStore } from "@/stores/addresses-store";
import { useAuthStore } from "@/stores/auth-store";
import { usePlatformConfigStore } from "@/stores/platform-config-store";

/**
 * App-start orchestrator. Runs once on mount.
 *
 *   1. Read the persisted token and seed the auth store so the splash request
 *      goes out authenticated.
 *   2. Fetch /splash and fan out into the auth, addresses, and platform-config
 *      stores.
 *   3. If we held a token but the server returned a null customer, the token
 *      is stale — wipe it and downgrade to guest.
 *   4. On network failure, fall back to whatever is already persisted: trust
 *      the token if present, otherwise mark as guest.
 */
export async function bootstrap() {
    const token = await getToken();
    useAuthStore.setState({ token });

    try {
        const data = await splashApi();

        // Sync addresses from the API to the store
        useAddressesStore.getState().setAddresses(data.addresses);

        // Sync platform config from the API to the store
        usePlatformConfigStore.getState().setAddressFieldTemplates(data.platformAddressFields);
        usePlatformConfigStore.getState().setOnboardingSlides(data.onboardingSlides ?? []);

        // If the token is present and the customer is null, the token is stale — wipe it and downgrade to guest.
        if (token && !data.customer) {
            await removeToken();
            useAuthStore.setState({
                user: null,
                token: null,
                status: "guest",
            });
            return;
        }

        // Sync customer from the API to the store
        useAuthStore.setState({
            user: data.customer,
            status: data.customer ? "authenticated" : "guest",
        });
    } catch {
        // Offline / server down — keep the persisted stores as they are and
        // trust the token as the best available signal of identity.
        useAuthStore.setState({
            status: token ? "authenticated" : "guest",
        });
    }
}
