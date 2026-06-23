import { AccountHeader } from '@/components/settings/account-header';
import { LanguageSelector } from '@/components/settings/language-selector';
import { MenuGroup, type MenuItem } from '@/components/settings/menu-group';
import { UserCard } from '@/components/settings/user-card';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { colors } = useAppTheme();
    const { t } = useTranslation(['settings', 'general']);
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [languageVisible, setLanguageVisible] = useState(false);

    const accountItems: MenuItem[] = [
        {
            key: 'orders',
            label: t('general:tab_bar.orders'),
            icon: 'bag-handle-outline',
            onPress: () => router.push('/orders'),
        },
        {
            key: 'language',
            label: t('general:language'),
            icon: 'globe-outline',
            onPress: () => setLanguageVisible(true),
        },
    ];

    return (
        <SafeAreaView
            style={[styles.screen, { backgroundColor: colors.background }]}
            edges={['top']}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <AccountHeader />

                <MenuGroup items={accountItems} />

                <View style={styles.footerSpacer} />
            </ScrollView>

            <LanguageSelector
                visible={languageVisible}
                onClose={() => setLanguageVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    content: { paddingBottom: Spacing.xl },
    footerSpacer: { height: Spacing.xl },
});
