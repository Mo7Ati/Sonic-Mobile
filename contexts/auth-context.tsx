import { parseApiError, setOnUnauthorized } from '@/lib/api';
import {
    forgotPasswordApi,
    getUserApi,
    loginApi,
    logoutApi,
    registerApi,
    resendVerificationApi,
    resetPasswordApi,
    type Customer,
} from '@/services/auth';
import { getToken, removeToken, setToken } from '@/services/secure-store';
import { clearSessionId } from '@/services/session';
import { useAddressStore } from '@/stores/address-store';
import { useCartStore } from '@/stores/cart-store';
import { usePlatformStore } from '@/stores/platform-store';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from 'react';

interface AuthState {
  user: Customer | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'RESTORE_TOKEN'; user: Customer; token: string }
  | { type: 'RESTORE_FAILED' }
  | { type: 'SIGN_IN'; user: Customer; token: string }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_USER'; user: Customer };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.user,
        token: action.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'RESTORE_FAILED':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        user: action.user,
        token: action.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.user,
      };
  }
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (params: {
    name: string;
    email: string;
    phone_number?: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (params: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<string>;
  resendVerification: () => Promise<string>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const splashData = usePlatformStore((s) => s.data);

  const handleSignOut = useCallback(async () => {
    await removeToken();
    dispatch({ type: 'SIGN_OUT' });
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      handleSignOut();
    });
  }, [handleSignOut]);

  // Hydrate auth state from the splash payload once Bootstrap has populated it.
  useEffect(() => {
    if (!splashData) return;
    let cancelled = false;

    (async () => {
      const storedToken = await getToken();
      if (cancelled) return;

      if (splashData.user && storedToken) {
        dispatch({ type: 'RESTORE_TOKEN', user: splashData.user, token: storedToken });
      } else {
        if (storedToken) await removeToken();
        dispatch({ type: 'RESTORE_FAILED' });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [splashData]);

  const login = useCallback(async (email: string, password: string) => {
    // Interceptor sends X-Session-Id automatically (no token yet) so server merges guest cart & addresses
    const result = await loginApi(email, password);
    await setToken(result.token);
    dispatch({ type: 'SIGN_IN', user: result.customer, token: result.token });

    // Clear guest session, then fetch the (possibly merged) cart & addresses
    await clearSessionId();
    useCartStore.getState().fetchCart();
    useAddressStore.getState().fetchAddresses();
  }, []);

  const register = useCallback(
    async (params: {
      name: string;
      email: string;
      phone_number?: string;
      password: string;
      password_confirmation: string;
    }) => {
      const result = await registerApi(params);
      await setToken(result.token);
      dispatch({ type: 'SIGN_IN', user: result.customer, token: result.token });

      // Clear guest session, then fetch the (possibly merged) cart & addresses
      await clearSessionId();
      useCartStore.getState().fetchCart();
      useAddressStore.getState().fetchAddresses();
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Server logout may fail if token is already expired; proceed with local cleanup
    }
    await handleSignOut();
    useCartStore.getState().reset();
    useAddressStore.getState().reset();
    usePlatformStore.setState({ lastSelectedAddressId: null });
  }, [handleSignOut]);

  const forgotPassword = useCallback(async (email: string) => {
    const result = await forgotPasswordApi(email);
    return result.message;
  }, []);

  const resetPassword = useCallback(
    async (params: {
      token: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      const result = await resetPasswordApi(params);
      return result.message;
    },
    [],
  );

  const resendVerification = useCallback(async () => {
    const result = await resendVerificationApi();
    return result.message;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await getUserApi();
      dispatch({ type: 'SET_USER', user });
    } catch (error) {
      const apiError = parseApiError(error);
      if (apiError.status === 401) {
        await handleSignOut();
      }
    }
  }, [handleSignOut]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      resendVerification,
      refreshUser,
    }),
    [state, login, register, logout, forgotPassword, resetPassword, resendVerification, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
