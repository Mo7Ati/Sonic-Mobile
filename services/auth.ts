import api from './api';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  email_verified_at: string | null;
  is_active: boolean;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  extra: unknown;
}

export async function loginApi(email: string, password: string) {
  const { data } = await api.post<ApiResponse<{ customer: Customer; token: string }>>(
    '/login',
    { email, password },
  );
  return data.data;
}

export async function registerApi(params: {
  name: string;
  email: string;
  phone_number?: string;
  password: string;
  password_confirmation: string;
}) {
  const { data } = await api.post<ApiResponse<{ customer: Customer; token: string }>>(
    '/register',
    params,
  );
  return data.data;
}

export async function logoutApi() {
  await api.post('/logout');
}

export async function getUserApi() {
  const { data } = await api.get<ApiResponse<Customer>>('/user');
  return data.data;
}

export async function forgotPasswordApi(email: string) {
  const { data } = await api.post<ApiResponse>('/forgot-password', { email });
  return data;
}

export async function resetPasswordApi(params: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  const { data } = await api.post<ApiResponse>('/reset-password', params);
  return data;
}

export async function resendVerificationApi() {
  const { data } = await api.post<ApiResponse>('/email/verification-notification');
  return data;
}

export async function verifyEmailApi(id: string, hash: string, queryString: string) {
  const { data } = await api.get<ApiResponse>(
    `/email/verify/${id}/${hash}?${queryString}`,
  );
  return data;
}
