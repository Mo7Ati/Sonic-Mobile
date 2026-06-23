import { SettingsListRow } from '@/components/settings/settings-list-row';
import { AuthBackButton } from '@/components/ui/auth-back-button';
import { BackButton } from '@/components/ui/back-button';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { useNotificationPermission } from '@/hooks/use-notification-permission';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    I18nManager,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function UserSettingsScreen() {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation(['settings', 'addresses', 'general']);
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();
    const { granted: notificationsGranted } = useNotificationPermission();
    const [loggingOut, setLoggingOut] = useState(false);

    const notificationStatus = notificationsGranted
        ? t('settings:user_settings.notifications_enabled')
        : t('settings:user_settings.notifications_disabled');

    const confirmLogout = () => {
        Alert.alert(t('settings:logout.confirm_title'), t('settings:logout.confirm_message'), [
            { text: t('settings:logout.cancel'), style: 'cancel' },
            {
                text: t('settings:logout.confirm'),
                style: 'destructive',
                onPress: async () => {
                    if (loggingOut) return;
                    setLoggingOut(true);
                    try {
                        await logout();
                        router.back();
                    } catch {
                        Toast.show({
                            type: 'error',
                            text1: t('general:errors.something_went_wrong'),
                        });
                    } finally {
                        setLoggingOut(false);
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView
            style={[styles.screen, { backgroundColor: colors.background }]}
            edges={['top']}
        >
            <View style={styles.header}>
                <BackButton />
                <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: font.bold }]}>
                    {t('settings:user_settings.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {isAuthenticated ? (
                    <SettingsListRow
                        label={t('settings:user_settings.general_information')}
                        onPress={() => router.push('/account-info')}
                    />
                ) : null}

                <SettingsListRow
                    label={t('addresses:title')}
                    onPress={() => router.push('/addresses')}
                />

                <SettingsListRow
                    label={t('settings:user_settings.notifications')}
                    value={notificationStatus}
                    showChevron={false}
                />

                {isAuthenticated ? (
                    <SettingsListRow
                        label={t('settings:logout.action')}
                        onPress={confirmLogout}
                        destructive
                        showChevron={false}
                        showDivider={false}
                    />
                ) : (
                    <SettingsListRow
                        label={t('settings:guest.login')}
                        onPress={() => router.push('/(auth)/login')}
                        showDivider={false}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.tight,
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: { fontSize: 18 },
    headerSpacer: { width: 38 },
});
