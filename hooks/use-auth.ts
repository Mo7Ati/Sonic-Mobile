import {
    logout,
    refreshUser,
    resendOtp,
    sendOtp,
    updateProfile,
    verifyNewPhone,
    verifyOtp,
} from "@/services/auth-actions";
import { useCustomer } from "@/hooks/react-query-hooks/use-me";
import { useSessionStore } from "@/stores/session-store";

export function useAuth() {
    const token = useSessionStore((s) => s.token);
    const status = useSessionStore((s) => s.status);
    const { data: user } = useCustomer();

    return {
        user: user ?? null,
        token,
        status,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        sendOtp,
        verifyOtp,
        resendOtp,
        updateProfile,
        verifyNewPhone,
        logout,
        refreshUser,
    };
}
