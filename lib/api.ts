import axios, { AxiosError } from 'axios';
import { ENV } from '@/config/env';
import i18n from '@/lib/i18n';
import { getOrCreateSessionId } from '@/services/session';
import { useSessionStore } from '@/stores/session-store';

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  error_code?: number;
  status?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  extra: unknown;
}


const api = axios.create({
  baseURL: `${ENV.API_BASE_URL}/api/customer`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = useSessionStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    const sessionId = await getOrCreateSessionId();
    config.headers['X-Session-Id'] = sessionId;
  }
  config.headers['Accept-Language'] = i18n.language || 'en';
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Dynamic import avoids a circular dep: auth-actions imports parseApiError
      // from this module.
      const { logoutLocal } = await import('@/services/auth-actions');
      await logoutLocal();
    }
    return Promise.reject(error);
  },
);


export function parseApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return { message: 'Network error. Please check your connection and try again.' };
    }
    const data = error.response.data as Record<string, unknown> | undefined;
    return {
      message: (data?.message as string) || 'An unexpected error occurred.',
      errors: data?.errors as Record<string, string[]> | undefined,
      error_code: (data?.error_code as number) || undefined,
      status: error.response.status,
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'An unexpected error occurred.' };
}

export default api;
