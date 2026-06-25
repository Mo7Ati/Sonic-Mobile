import api from '@/lib/api';

export interface Customer {
  id: number;
  name: string | null;
  phone_number: string;
  last_seen_at: string | null;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  extra: unknown;
}

export interface OtpMeta {
  expires_in: number;
  phone_masked: string;
}

export async function sendOtpApi(phone_number: string): Promise<OtpMeta> {
  const { data } = await api.post<ApiResponse<OtpMeta>>('/send-otp', { phone_number });
  return data.data;
}

export async function resendOtpApi(phone_number: string): Promise<OtpMeta> {
  const { data } = await api.post<ApiResponse<OtpMeta>>('/resend-otp', { phone_number });
  return data.data;
}

export async function verifyOtpApi(phone_number: string, otp: string) {
  const response = await api.post<ApiResponse<{ customer: Customer; token: string }>>(
    '/verify-otp',
    { phone_number, otp },
  );

  return {
    ...response.data.data,
    isNewCustomer: response.status === 201,
    message: response.data.message,
  };
}

export async function updateProfileApi(name: string): Promise<Customer> {
  const { data } = await api.patch<ApiResponse<Customer>>('/user', { name });
  return data.data;
}

export async function logoutApi() {
  await api.post('/logout');
}

export async function getUserApi() {
  const { data } = await api.get<ApiResponse<Customer>>('/user');
  return data.data;
}
