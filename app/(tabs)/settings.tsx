import { AccountHeader } from '@/components/settings/account-header';
import { LanguageSelector } from '@/components/settings/language-selector';
import { MenuGroup, type MenuItem } from '@/components/settings/menu-group';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { useCustomPages } from '@/hooks/react-query-hooks/use-config';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { colors } = useAppTheme();
    const { t } = useTranslation(['settings', 'general']);
    const router = useRouter();
    const [languageVisible, setLanguageVisible] = useState(false);

    const customPages = useCustomPages();

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

    const customPageItems: MenuItem[] = customPages.map((page, index) => ({
        key: `custom-page-${index}`,
        label: page.title,
        icon: 'document-text-outline',
        onPress: () =>
            router.push({
                pathname: '/custom-page/[index]',
                params: { index: String(index) },
            }),
    }));

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

                {customPageItems.length > 0 ? (
                    <MenuGroup items={customPageItems} />
                ) : null}

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
