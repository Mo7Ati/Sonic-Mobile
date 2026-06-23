import * as Notifications from 'expo-notifications';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export function useNotificationPermission() {
    const [granted, setGranted] = useState(false);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        const settings = await Notifications.getPermissionsAsync();
        setGranted(settings.status === 'granted');
        setLoading(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            void refresh();
        }, [refresh]),
    );

    const requestPermission = useCallback(async () => {
        const settings = await Notifications.getPermissionsAsync();
        if (settings.status === 'granted') {
            setGranted(true);
            return true;
        }

        const request = await Notifications.requestPermissionsAsync();
        const isGranted = request.status === 'granted';
        setGranted(isGranted);
        return isGranted;
    }, []);

    return { granted, loading, refresh, requestPermission };
}
