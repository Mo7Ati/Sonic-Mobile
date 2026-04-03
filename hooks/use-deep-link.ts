import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import Toast from 'react-native-toast-message';
import { verifyEmailApi } from '@/services/auth';
import { parseApiError } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';

function parseUrl(url: string) {
  try {
    return Linking.parse(url);
  } catch {
    return null;
  }
}

export function useDeepLink() {
  const { refreshUser, isAuthenticated } = useAuth();
  const processed = useRef(new Set<string>());

  async function handleUrl(url: string) {
    if (processed.current.has(url)) return;
    processed.current.add(url);

    const parsed = parseUrl(url);
    if (!parsed?.path) return;

    const path = parsed.path;

    // Email verification: .../email/verify/{id}/{hash}?expires=...&signature=...
    const verifyMatch = path.match(/email\/verify\/(\d+)\/([^/?]+)/);
    if (verifyMatch) {
      const [, id, hash] = verifyMatch;
      try {
        const fullUrl = new URL(url);
        const queryString = fullUrl.search.replace(/^\?/, '');
        await verifyEmailApi(id, hash, queryString);
        Toast.show({
          type: 'success',
          text1: 'Email Verified',
          text2: 'Your email has been verified successfully.',
        });
        if (isAuthenticated) {
          await refreshUser();
        }
      } catch (error) {
        const apiError = parseApiError(error);
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: apiError.message,
        });
      }
      return;
    }

    // Password reset: .../reset-password?token=...&email=...
    // Or custom scheme: sonic://reset-password?token=...&email=...
    if (path.includes('reset-password') || path.includes('password/reset')) {
      const token =
        parsed.queryParams?.token as string | undefined;
      const email =
        parsed.queryParams?.email as string | undefined;
      router.push({
        pathname: '/(auth)/reset-password',
        params: { token: token ?? '', email: email ?? '' },
      });
    }
  }

  useEffect(() => {
    // Handle URL that launched the app
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    // Handle URLs while app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    return () => subscription.remove();
  }, [isAuthenticated]);
}
