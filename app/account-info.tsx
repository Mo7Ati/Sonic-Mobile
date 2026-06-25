import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, I18nManager, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountInfoScreen() {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation(['settings', 'general']);
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/(auth)/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) {
        return (
            <View style={[styles.loading, { backgroundColor: colors.background }]}>
                <ActivityIndicator color={colors.primary} />
            </View>
        );
    }

    const fields = [
        { label: t('settings:account_info.name'), value: user.name ?? '—', icon: 'person-outline' as const },
        { label: t('settings:account_info.phone'), value: user.phone_number, icon: 'call-outline' as const },
    ];

    return (
        <SafeAreaView
            style={[styles.screen, { backgroundColor: colors.background }]}
            edges={['top']}
        >
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    hitSlop={8}
                    style={[styles.backButton, { borderColor: colors.border }]}
                >
                    <Ionicons
                        name={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
                        size={20}
                        color={colors.foreground}
                    />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: font.bold }]}>
                    {t('settings:user_settings.general_information')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {fields.map((field) => (
                    <View
                        key={field.label}
                        style={[styles.fieldCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                        <View style={styles.fieldHeader}>
                            <Ionicons name={field.icon} size={18} color={colors.mutedForeground} />
                            <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: font.regular }]}>
                                {field.label}
                            </Text>
                        </View>
                        <Text style={[styles.fieldValue, { color: colors.foreground, fontFamily: font.medium }]}>
                            {field.value}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
    content: {
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.sm,
        gap: Spacing.sm,
    },
    fieldCard: {
        borderWidth: 1,
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        gap: Spacing.xs,
    },
    fieldHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    fieldLabel: { fontSize: 13 },
    fieldValue: { fontSize: 16 },
});
