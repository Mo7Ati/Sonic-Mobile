import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthInput } from '@/components/ui/auth-input';
import { AuthButton } from '@/components/ui/auth-button';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { parseApiError, type ApiError } from '@/lib/api';

interface ResetForm {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function ResetPasswordScreen() {
  const { resetPassword } = useAuth();
  const params = useLocalSearchParams<{ token?: string; email?: string }>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation(['auth', 'general']);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<ResetForm>({
    defaultValues: {
      token: params.token ?? '',
      email: params.email ?? '',
      password: '',
      password_confirmation: '',
    },
  });

  const password = watch('password');

  function applyServerErrors(apiError: ApiError) {
    if (!apiError.errors) return;
    const fieldNames: (keyof ResetForm)[] = [
      'token',
      'email',
      'password',
      'password_confirmation',
    ];
    for (const [field, messages] of Object.entries(apiError.errors)) {
      if (fieldNames.includes(field as keyof ResetForm)) {
        setError(field as keyof ResetForm, { message: messages[0] });
      }
    }
  }

  async function onSubmit(form: ResetForm) {
    setLoading(true);
    try {
      await resetPassword(form);
      setSuccess(true);
    } catch (error) {
      const apiError = parseApiError(error);
      if (apiError.status === 422) {
        applyServerErrors(apiError);
      } else {
        Toast.show({
          type: 'error',
          text1: t('general:errors.title'),
          text2: apiError.message,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.successScroll}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle-outline" size={64} color={Colors.successBright} />
          </View>
          <Text style={styles.successTitle}>{t('reset_password.success_title')}</Text>
          <Text style={styles.successMessage}>
            {t('reset_password.success_message')}
          </Text>
          <AuthButton
            title={t('shared.sign_in')}
            onPress={() => router.replace('/(auth)/login')}
            style={styles.signInButton}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark-outline" size={32} color={Colors.link} />
            </View>
            <Text style={styles.title}>{t('reset_password.title')}</Text>
            <Text style={styles.subtitle}>{t('reset_password.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="token"
              rules={{ required: t('general:validation.reset_token_required') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label={t('reset_password.reset_token')}
                  icon="key-outline"
                  placeholder={t('reset_password.token_placeholder')}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.token?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: t('general:validation.email_required'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('general:validation.email_invalid'),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label={t('shared.email')}
                  icon="mail-outline"
                  placeholder={t('shared.email_placeholder')}
                  keyboardType="email-address"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: t('general:validation.password_required'),
                minLength: { value: 8, message: t('general:validation.password_min') },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label={t('reset_password.new_password')}
                  icon="lock-closed-outline"
                  placeholder={t('register.password_placeholder')}
                  isPassword
                  autoComplete="new-password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password_confirmation"
              rules={{
                required: t('general:validation.password_confirm_required'),
                validate: (value) =>
                  value === password || t('general:validation.passwords_mismatch'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label={t('reset_password.confirm_new_password')}
                  icon="lock-closed-outline"
                  placeholder={t('reset_password.confirm_new_placeholder')}
                  isPassword
                  autoComplete="new-password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password_confirmation?.message}
                />
              )}
            />

            <AuthButton
              title={t('reset_password.submit')}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.submitButton}
            />
          </View>

          <AuthButton
            title={t('shared.back_to_sign_in')}
            onPress={() => router.replace('/(auth)/login')}
            variant="text"
            style={styles.backLink}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg + Spacing.xs,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceInfo,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.foreground,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.mutedForeground,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  backLink: {
    marginTop: Spacing.lg,
  },
  successScroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.surfaceSuccess,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.foreground,
    marginBottom: Spacing.tight,
  },
  successMessage: {
    fontSize: 15,
    color: Colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  signInButton: {
    width: '100%',
  },
});
