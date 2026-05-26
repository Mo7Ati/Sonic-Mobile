import { bootstrap } from '@/services/bootstrap';
import { useAppPrefsStore } from '@/stores/app-prefs-store';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';

interface BootstrapProps {
    /** True once `useFonts` has resolved (loaded or errored). */
    fontsReady: boolean;
}

/**
 * Runs the app-start orchestration in parallel with `Stack` so the navigator
 * is alive from the first frame. The native splash stays up (set by
 * `preventAutoHideAsync` in the root layout) until both fonts and bootstrap
 * are done, the onboarding decision has been made, and the chosen route has
 * painted its first frame.
 */
export default function Bootstrap({ fontsReady }: BootstrapProps) {
    const router = useRouter();
    const started = useRef(false);

    useEffect(() => {
        if (!fontsReady || started.current) return;
        started.current = true;

        (async () => {
            try {
                await bootstrap();
                await ensureAppPrefsHydrated();

                if (!useAppPrefsStore.getState().onboardingCompleted) {
                    router.replace('/welcome');
                }

                // Defer the splash hide so the chosen route's first paint
                // lands before the native splash drops away — otherwise the
                // (tabs) anchor flashes its skeleton for a frame or two.
                await nextPaint();
            } finally {
                SplashScreen.hideAsync();
            }
        })();
    }, [fontsReady, router]);

    return null;
}

/**
 * Wait for zustand's persist middleware to rehydrate `app-prefs-store` from
 * AsyncStorage before we read `onboardingCompleted`. Hydration is usually
 * faster than the splash API call, but guard against the race anyway.
 */
function ensureAppPrefsHydrated(): Promise<void> {
    if (useAppPrefsStore.persist.hasHydrated()) return Promise.resolve();
    return new Promise((resolve) => {
        const unsub = useAppPrefsStore.persist.onFinishHydration(() => {
            unsub();
            resolve();
        });
    });
}

/** Resolve after two animation frames (one rendered paint). */
function nextPaint(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
}
