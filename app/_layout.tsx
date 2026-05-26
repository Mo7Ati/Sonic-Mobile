import Bootstrap from '@/components/bootstrap';
import { CairoFontsToLoad } from '@/constants/fonts';
import '@/lib/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import 'react-native-reanimated';
import Toast, { ToastProps } from 'react-native-toast-message';


SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [fontsLoaded, fontsError] = useFonts(CairoFontsToLoad);
  const fontsReady = fontsLoaded || !!fontsError;

  return (
    <QueryClientProvider client={queryClient}>
      <Toast />
      <Bootstrap fontsReady={fontsReady} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="store-category/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="branch/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="addresses/index" options={{ headerShown: false }} />
        <Stack.Screen name="addresses/add" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
