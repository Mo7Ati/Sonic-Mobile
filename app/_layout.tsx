import Bootstrap from '@/components/bootstrap';
import PushNotificationsManager from '@/components/push-notifications-manager';
import { CairoFontsToLoad } from '@/constants/fonts';
import '@/lib/i18n';
import { queryClient } from '@/lib/query-client';
import { useSessionStore } from '@/stores/session-store';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast, { ToastProps } from 'react-native-toast-message';
import { FloatingDevTools } from '@buoy-gg/core';

SplashScreen.preventAutoHideAsync();

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts(CairoFontsToLoad);
  const fontsReady = fontsLoaded || !!fontsError;
  const status = useSessionStore((s) => s.status);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 24,
      }}
    >
      <Bootstrap fontsReady={fontsReady} />
      <PushNotificationsManager />
      <FloatingDevTools />

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
        <Stack.Screen name="custom-page/[index]" options={{ headerShown: false }} />


        {/* protected routes */}
        <Stack.Protected guard={status === "authenticated"}>
          <Stack.Screen name="account-info" options={{ headerShown: false }} />
          <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="checkout" options={{ headerShown: false }} />
          <Stack.Screen name="pay" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
      {/* <AppDialogHost /> */}
      <Toast />
    </PersistQueryClientProvider>
  );
}
