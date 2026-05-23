import { AuthProvider } from '@/contexts/auth-context';
import i18n from '@/lib/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
 
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="store-category/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="branch/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="product/[id]" options={{ headerShown: false, presentation: "modal" }} />
          <Stack.Screen name="cart" options={{ headerShown: false }} />
          <Stack.Screen name="addresses/index" options={{ headerShown: false }} />
          <Stack.Screen name="addresses/add" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: i18n.t('content.title', { ns: 'modal' }) }} />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
