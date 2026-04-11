import { Colors } from '@/constants/theme';
import { AuthProvider } from '@/contexts/auth-context';
import "@/lib/i18n";
import { initLanguage } from '@/lib/i18n';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NativeModules } from 'react-native';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';

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
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '900' as const },
  },
};

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [langReady, setLangReady] = useState(false);

  useEffect(() => {
    initLanguage().then((needsReload) => {
      if (needsReload) {
        NativeModules.DevSettings?.reload?.();
      } else {
        setLangReady(true);
      }
    });
  }, []);

  if (!langReady) return <ThemedText style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Loading...</ThemedText>;

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
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
