import {
    forgotPasswordApi,
    getUserApi,
    loginApi,
    logoutApi,
    registerApi,
    resendVerificationApi,
    resetPasswordApi,
} from "@/services/auth";
import { removeToken, setToken } from "@/services/secure-store";
import { clearSessionId } from "@/services/session";
import { useAddressesStore } from "@/stores/addresses-store";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useAppPrefsStore } from "@/stores/app-prefs-store";
import { parseApiError } from "@/lib/api";

export async function login(email: string, password: string) {
    const { customer, token } = await loginApi(email, password);
    await setToken(token);
    useAuthStore.setState({ user: customer, token, status: "authenticated" });

    // The guest session has been merged server-side; drop our local id and
    // refresh the cart so the merged contents land in the store.
    await clearSessionId();
    useCartStore.getState().fetchCart();
}

export async function register(params: {
    name: string;
    email: string;
    phone_number?: string;
    password: string;
    password_confirmation: string;
}) {
    const { customer, token } = await registerApi(params);
    await setToken(token);
    useAuthStore.setState({ user: customer, token, status: "authenticated" });

    await clearSessionId();
    useCartStore.getState().fetchCart();
}

export async function logout() {
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

export async function forgotPassword(email: string) {
    const result = await forgotPasswordApi(email);
    return result.message;
}

export async function resetPassword(params: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}) {
    const result = await resetPasswordApi(params);
    return result.message;
}

export async function resendVerification() {
    const result = await resendVerificationApi();
    return result.message;
}
