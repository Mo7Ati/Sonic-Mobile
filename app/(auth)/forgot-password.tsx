import { AuthButton } from '@/components/ui/auth-button';
import { AuthInput } from '@/components/ui/auth-input';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { parseApiError, type ApiError } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface ForgotForm {
  email: string;
}

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useTranslation(['auth', 'general']);

  const {
    control,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<ForgotForm>({
    defaultValues: { email: '' },
  });

  function applyServerErrors(apiError: ApiError) {
    if (apiError.errors?.email) {
      setError('email', { message: apiError.errors.email[0] });
    }
  }

  async function onSubmit(form: ForgotForm) {
    setLoading(true);
    try {
      await forgotPassword(form.email);
      setSent(true);
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

  if (sent) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.successScroll}>
          <View style={styles.successIcon}>
            <Ionicons name="mail-open-outline" size={64} color={Colors.link} />
          </View>
          <Text style={styles.successTitle}>{t('forgot_password.success_title')}</Text>
          <Text style={styles.successMessage}>
            {t('forgot_password.success_message', { email: getValues('email') })}
          </Text>
          <AuthButton
            title={t('shared.back_to_sign_in')}
            onPress={() => router.replace('/(auth)/login')}
            style={styles.backButton}
          />
          <AuthButton
            title={t('forgot_password.resend_email')}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            variant="outline"
            style={styles.resendButton}
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
              <Ionicons name="key-outline" size={32} color={Colors.link} />
            </View>
            <Text style={styles.title}>{t('forgot_password.title')}</Text>
            <Text style={styles.subtitle}>
              {t('forgot_password.subtitle')}
            </Text>
          </View>

          <View style={styles.form}>
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

            <AuthButton
              title={t('forgot_password.send_reset_link')}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.submitButton}
            />
          </View>

          <AuthButton
            title={t('shared.back_to_sign_in')}
            onPress={() => router.back()}
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
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
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
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
    backgroundColor: Colors.surfaceInfo,
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
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  emailHighlight: {
    fontWeight: '600',
    color: Colors.foreground,
  },
  backButton: {
    width: '100%',
    marginBottom: Spacing.tight,
  },
  resendButton: {
    width: '100%',
  },
});
