import Header from '@/components/settings/header';
import LanguageSwitch from '@/components/settings/language-switch';
import { MenuGroup, type MenuItem } from '@/components/settings/menu-group';
import { UserCard } from '@/components/settings/user-card';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { FontFamily } from '@/constants/fonts';

export default function SettingsScreen() {
    const { colors } = useAppTheme();
    const { t } = useTranslation(['settings', 'addresses', 'general']);
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    const accountItems: MenuItem[] = [
        {
            key: 'orders',
            label: t('general:tab_bar.orders'),
            icon: 'bag-handle-outline',
            onPress: () => router.push('/orders'),
        },
        {
            key: 'addresses',
            label: t('addresses:title'),
            icon: 'location-outline',
            onPress: () => router.push('/addresses'),
        },
    ];

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
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Settings Header */}
                <Header />

                {/* User Card */}
                <UserCard />

                {/* Account Menu Group */}
                <MenuGroup title={t('settings:sections.account')} items={accountItems} />

                {/* Language Switch */}
                <LanguageSwitch />


                {/* Logout Button */}
                {isAuthenticated && (
                    <Pressable style={styles.logoutButton} onPress={confirmLogout}>
                        <Text style={styles.logoutButtonText}>{t('settings:logout.action')}</Text>
                    </Pressable>
                )}


                <View style={styles.footerSpacer} />
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({

    screen: { flex: 1 },

    content: { paddingBottom: Spacing.xl },
    footerSpacer: { height: Spacing.xl },
    logoutButton: {
        padding: Spacing.md,
        marginHorizontal: Spacing.gutter,
        marginTop: Spacing.md,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.destructive,
    },
    logoutButtonText: {
        textAlign: 'center',
        color: Colors.destructiveForeground,
        fontSize: 16,
    },
});
