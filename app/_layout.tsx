import Bootstrap from '@/components/bootstrap';
import PushNotificationsManager from '@/components/push-notifications-manager';
import { AppDialogHost } from '@/components/ui/app-dialog';
import { CairoFontsToLoad } from '@/constants/fonts';
import '@/lib/i18n';
import { useAddressesStore } from '@/stores/addresses-store';
import { useAppPrefsStore } from '@/stores/app-prefs-store';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { FloatingDevTools } from '@buoy-gg/core';
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
  const { status } = useAuthStore();

  // const stores = {
  //   authStore: useAuthStore,
  //   cartStore: useCartStore,
  //   addressStore: useAddressesStore,
  //   appPrefsStore: useAppPrefsStore,
  // };

  return (
    <QueryClientProvider client={queryClient}>
      <Bootstrap fontsReady={fontsReady} />
      <PushNotificationsManager />
      {/* <FloatingDevTools zustandStores={stores} /> */}

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
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="user-settings" options={{ headerShown: false }} />
        <Stack.Screen name="account-info" options={{ headerShown: false }} />

        <Stack.Protected guard={status === "authenticated"}>
          <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="checkout" options={{ headerShown: false }} />
          <Stack.Screen name="pay" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
      <AppDialogHost />
      <Toast />
    </QueryClientProvider>
  );
}
