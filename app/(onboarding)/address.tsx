import { AuthButton } from '@/components/ui/auth-button';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAppPrefsStore } from '@/stores/app-prefs-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingAddressScreen() {
    const { t } = useTranslation('onboarding');
    const router = useRouter();
    const setOnboardingCompleted = useAppPrefsStore((s) => s.setOnboardingCompleted);

    const finish = () => {
        setOnboardingCompleted(true);
        router.replace('/');
    };

    const addAddress = () => {
        setOnboardingCompleted(true);
        router.replace({ pathname: '/addresses/add', params: { next: '/' } });
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.content}>
                <View style={styles.iconWrap}>
                    <Ionicons name="location-outline" size={96} color={Colors.primary} />
                </View>
                <Text style={styles.title}>{t('address_prompt.title')}</Text>
                <Text style={styles.subtitle}>{t('address_prompt.subtitle')}</Text>
            </View>

            <View style={styles.actions}>
                <AuthButton
                    title={t('address_prompt.add_address')}
                    onPress={addAddress}
                />
                <AuthButton
                    title={t('address_prompt.skip')}
                    onPress={finish}
                    variant="text"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: Spacing.lg,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrap: {
        width: 140,
        height: 140,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.hero,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.foreground,
        textAlign: 'center',
        marginBottom: Spacing.tight,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.mutedForeground,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: Spacing.sm,
    },
    actions: {
        paddingBottom: Spacing.lg,
        gap: Spacing.tight,
    },
});
