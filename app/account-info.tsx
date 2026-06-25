import { AuthButton } from '@/components/ui/auth-button';
import { AuthInput } from '@/components/ui/auth-input';
import { FontFamily } from '@/constants/fonts';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { parseApiError } from '@/lib/api';
import { isValidPhone, normalizePhoneInput } from '@/lib/phone';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    I18nManager,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface AccountForm {
    name: string;
    phone_number: string;
}

export default function AccountInfoScreen() {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation(['settings', 'general']);
    const router = useRouter();
    const { user, isAuthenticated, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<AccountForm>({
        defaultValues: { name: '', phone_number: '' },
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/(auth)/login');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (user) {
            reset({
                name: user.name ?? '',
                phone_number: user.phone_number,
            });
        }
    }, [user, reset]);

    if (!isAuthenticated || !user) {
        return (
            <View style={[styles.loading, { backgroundColor: colors.background }]}>
                <ActivityIndicator color={colors.primary} />
            </View>
        );
    }

    async function onSubmit(form: AccountForm) {
        setLoading(true);

        try {
            const { otpSent } = await updateProfile(form.name.trim(), form.phone_number);

            if (otpSent) {
                router.push({
                    pathname: '/(auth)/verify-otp',
                    params: {
                        mode: 'phone_change',
                        phone_number: form.phone_number,
                        name: form.name.trim(),
                    },
                });
                return;
            }

            Toast.show({
                type: 'success',
                text1: t('settings:account_info.saved_title'),
                text2: t('settings:account_info.saved_message'),
            });
        } catch (error) {
            const apiError = parseApiError(error);

            if (apiError.status === 422) {
                if (apiError.errors?.name) {
                    setError('name', { message: apiError.errors.name[0] });
                }
                if (apiError.errors?.phone_number) {
                    setError('phone_number', { message: apiError.errors.phone_number[0] });
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: t('settings:account_info.save_failed_title'),
                    text2: apiError.message,
                });
            }
        } finally {
            setLoading(false);
        }
    }

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

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: t('general:validation.name_required') }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AuthInput
                                label={t('settings:account_info.name')}
                                icon="person-outline"
                                placeholder={t('settings:account_info.name_placeholder')}
                                autoComplete="name"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                error={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="phone_number"
                        rules={{
                            required: t('general:validation.phone_required'),
                            validate: (value) =>
                                isValidPhone(value) || t('general:validation.phone_invalid'),
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AuthInput
                                label={t('settings:account_info.phone')}
                                icon="call-outline"
                                placeholder={t('settings:account_info.phone_placeholder')}
                                keyboardType="phone-pad"
                                autoComplete="tel"
                                maxLength={10}
                                value={value}
                                onChangeText={(text) => onChange(normalizePhoneInput(text))}
                                onBlur={onBlur}
                                error={errors.phone_number?.message}
                            />
                        )}
                    />

                    <AuthButton
                        title={t('settings:account_info.save')}
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        style={styles.saveButton}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    screen: { flex: 1 },
    flex: { flex: 1 },
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
        paddingBottom: Spacing.xl,
        gap: Spacing.sm,
    },
    saveButton: {
        marginTop: Spacing.md,
    },
});
