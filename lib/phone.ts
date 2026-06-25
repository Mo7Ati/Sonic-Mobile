export const PHONE_REGEX = /^05[69]\d{7}$/;

export function normalizePhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  if (digits.length === 9 && (digits.startsWith('6') || digits.startsWith('9'))) {
    return `0${digits}`;
  }

  return digits;
}

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}
