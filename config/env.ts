
const DEFAULT_API_URL = 'http://192.168.1.158:8000'
  // ? 'http://192.168.1.158:8000'
  // : 'http://localhost:8000';

export const ENV = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_URL,
  /** Set `EXPO_PUBLIC_USE_MOCK_HOME=1` to use local mock sections instead of the API. */
  USE_MOCK_HOME:
    process.env.EXPO_PUBLIC_USE_MOCK_HOME === '1' ||
    process.env.EXPO_PUBLIC_USE_MOCK_HOME === 'true',
} as const;
