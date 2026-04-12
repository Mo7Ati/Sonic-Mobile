import { outfitFontsToLoad, FontFamily } from '@/constants/fonts';
import { Colors } from '@/constants/theme';
import { AuthProvider } from '@/contexts/auth-context';
import { initLanguage } from '@/lib/i18n';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { NativeModules, Text } from 'react-native';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

const appTheme: Theme = {
  dark: false,
  colors: {
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.card,
    text: Colors.foreground,
    border: Colors.border,
    notification: Colors.destructive,
  },
  fonts: {
    regular: { fontFamily: FontFamily.regular, fontWeight: '400' as const },
    medium: { fontFamily: FontFamily.medium, fontWeight: '500' as const },
    bold: { fontFamily: FontFamily.bold, fontWeight: '700' as const },
    heavy: { fontFamily: FontFamily.bold, fontWeight: '800' as const },
  },
};

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [langReady, setLangReady] = useState(false);
  const [fontsLoaded] = useFonts(outfitFontsToLoad);

  useEffect(() => {
    initLanguage().then((needsReload) => {
      if (needsReload) {
        NativeModules.DevSettings?.reload?.();
      } else {
        setLangReady(true);
      }
    });
  }, []);

  useEffect(() => {
    if (fontsLoaded && langReady) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, langReady]);

  // if (!langReady || !fontsLoaded) {
  //   return (
  //     <Text style={{ textAlign: 'center', marginTop: 60, fontSize: 16, color: Colors.foreground }}>
  //       Loading...
  //     </Text>
  //   );
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={appTheme}>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="store-category/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="branch/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="dark" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
