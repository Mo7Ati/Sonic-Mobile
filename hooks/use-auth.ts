import {
    forgotPassword,
    login,
    logout,
    refreshUser,
    register,
    resendVerification,
    resetPassword,
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
        login,
        register,
        logout,
        refreshUser,
        forgotPassword,
        resetPassword,
        resendVerification,
    };
}
