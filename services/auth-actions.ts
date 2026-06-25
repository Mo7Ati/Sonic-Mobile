import {
    getUserApi,
    logoutApi,
    resendOtpApi,
    sendOtpApi,
    updateProfileApi,
    verifyOtpApi,
    type Customer,
    type OtpMeta,
} from "@/services/auth";
import { removeToken, setToken } from "@/services/secure-store";
import { unregisterPushToken } from "@/services/notifications/registration";
import { clearSessionId } from "@/services/session";
import { useAddressesStore } from "@/stores/addresses-store";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useAppPrefsStore } from "@/stores/app-prefs-store";
import { parseApiError } from "@/lib/api";

export async function sendOtp(phone_number: string): Promise<OtpMeta> {
    return sendOtpApi(phone_number);
}

export async function resendOtp(phone_number: string): Promise<OtpMeta> {
    return resendOtpApi(phone_number);
}

export async function verifyOtp(
    phone_number: string,
    otp: string,
): Promise<{ isNewCustomer: boolean; customer: Customer }> {
    const { customer, token, isNewCustomer } = await verifyOtpApi(phone_number, otp);
    await setToken(token);
    useAuthStore.setState({ user: customer, token, status: "authenticated" });

    await clearSessionId();
    useCartStore.getState().fetchCart();

    return { isNewCustomer, customer };
}

export async function updateProfile(name: string): Promise<Customer> {
    const customer = await updateProfileApi(name);
    useAuthStore.setState({ user: customer });
    return customer;
}

export async function logout() {
    await unregisterPushToken();

    try {
        await logoutApi();
    } catch {
        // Server logout may fail if the token is already invalid; proceed with
        // local cleanup either way.
    }
    await logoutLocal();
}

/**
 * Wipe client-side session state. Safe to call from the 401 interceptor —
 * does not hit the network.
 */
export async function logoutLocal() {
    await removeToken();
    useAuthStore.setState({ user: null, token: null, status: "guest" });
    useAddressesStore.getState().reset();
    useCartStore.getState().reset();
    useAppPrefsStore.getState().reset();
}

export async function refreshUser() {
    try {
        const user = await getUserApi();
        useAuthStore.setState({ user });
    } catch (error) {
        const apiError = parseApiError(error);
        if (apiError.status === 401) await logoutLocal();
    }
}
