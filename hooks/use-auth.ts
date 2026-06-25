import {
    logout,
    refreshUser,
    resendOtp,
    sendOtp,
    updateProfile,
    verifyNewPhone,
    verifyOtp,
} from "@/services/auth-actions";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
    const { user, token, status } = useAuthStore();

    return {
        user,
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
