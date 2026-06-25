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

export interface UpdateProfileResult {
  otp_sent: boolean;
}

export async function sendOtpApi(phone_number: string): Promise<void> {
  await api.post<ApiResponse>('/login', { phone_number });
}

export async function resendOtpApi(phone_number: string): Promise<void> {
  await api.post<ApiResponse>('/resend-otp', { phone_number });
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

export async function updateProfileApi(
  name: string,
  phone_number: string,
): Promise<UpdateProfileResult> {
  const { data } = await api.patch<ApiResponse<UpdateProfileResult>>('/update-profile', {
    name,
    phone_number,
  });

  return data.data;
}

export async function verifyNewPhoneApi(new_phone_number: string, otp: string): Promise<void> {
  await api.post('/verify-new-phone', { new_phone_number, otp });
}

export async function logoutApi() {
  await api.post('/logout');
}
