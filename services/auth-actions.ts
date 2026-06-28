import {
    logoutApi,
    resendOtpApi,
    sendOtpApi,
    updateProfileApi,
    verifyNewPhoneApi,
    verifyOtpApi,
    type Customer,
} from "@/services/auth";
import { meApi } from "@/services/customer";
import { removeToken, setToken } from "@/services/secure-store";
import { unregisterPushToken } from "@/services/notifications/registration";
import { clearSessionId } from "@/services/session";
import { addressesKey } from "@/hooks/react-query-hooks/use-addresses";
import { cartKey } from "@/hooks/react-query-hooks/use-cart";
import { meKey } from "@/hooks/react-query-hooks/use-me";
import { queryClient } from "@/lib/query-client";
import { useSessionStore } from "@/stores/session-store";
import { useAppPrefsStore } from "@/stores/app-prefs-store";
import { parseApiError } from "@/lib/api";

export async function sendOtp(phone_number: string): Promise<void> {
    return sendOtpApi(phone_number);
}

export async function resendOtp(phone_number: string): Promise<void> {
    return resendOtpApi(phone_number);
}

export async function verifyOtp(
    phone_number: string,
    otp: string,
): Promise<{ isNewCustomer: boolean; customer: Customer }> {
    const { customer, token, isNewCustomer } = await verifyOtpApi(phone_number, otp);
    await setToken(token);
    useSessionStore.setState({ token, status: "authenticated" });
    queryClient.setQueryData(meKey, customer);

    await clearSessionId();

    // Identity changed from guest to customer: refetch user-scoped data.
    queryClient.invalidateQueries({ queryKey: cartKey });
    queryClient.invalidateQueries({ queryKey: addressesKey });

    return { isNewCustomer, customer };
}

export async function updateProfile(
    name: string,
    phone_number: string,
): Promise<{ otpSent: boolean }> {
    const { otp_sent } = await updateProfileApi(name, phone_number);

    if (!otp_sent) {
        await refreshUser();
    }

    return { otpSent: otp_sent };
}

export async function verifyNewPhone(new_phone_number: string, otp: string): Promise<Customer> {
    await verifyNewPhoneApi(new_phone_number, otp);
    await refreshUser();

    const user = queryClient.getQueryData<Customer>(meKey);

    if (!user) {
        throw new Error("User not found after phone verification.");
    }

    return user;
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
 * does not hit the network. `queryClient.clear()` drops every server cache in
 * one call, replacing the previous per-store resets.
 */
export async function logoutLocal() {
    await removeToken();
    useSessionStore.setState({ token: null, status: "guest" });
    useAppPrefsStore.getState().reset();
    queryClient.clear();
}

export async function refreshUser() {
    try {
        const customer = await meApi();
        queryClient.setQueryData(meKey, customer);
    } catch (error) {
        const apiError = parseApiError(error);
        if (apiError.status === 401) await logoutLocal();
    }
}
