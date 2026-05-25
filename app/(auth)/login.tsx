import { AuthButton } from '@/components/ui/auth-button';
import { AuthInput } from '@/components/ui/auth-input';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { parseApiError, type ApiError } from '@/lib/api';
import { Link } from 'expo-router';
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

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['auth', 'general']);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  function applyServerErrors(apiError: ApiError) {
    if (apiError.errors) {
      for (const [field, messages] of Object.entries(apiError.errors)) {
        if (field === 'email' || field === 'password') {
          setError(field, { message: messages[0] });
        }
      }
    }
  }

  async function onSubmit(form: LoginForm) {
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (error) {
      const apiError = parseApiError(error);
      if (apiError.status === 422) {
        applyServerErrors(apiError);
      } else if (apiError.status === 403) {
        Toast.show({
          type: 'error',
          text1: t('login.toast_deactivated_title'),
          text2: t('login.toast_deactivated_message'),
          visibilityTime: 5000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('login.toast_failed_title'),
          text2: apiError.message,
        });
      }
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.brand}>{t('shared.brand')}</Text>
            <Text style={styles.title}>{t('login.title')}</Text>
            <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
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

            <Controller
              control={control}
              name="password"
              rules={{ required: t('general:validation.password_required') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label={t('shared.password')}
                  icon="lock-closed-outline"
                  placeholder={t('login.password_placeholder')}
                  isPassword
                  autoComplete="password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <Link href="/(auth)/forgot-password" asChild>
              <AuthButton
                title={t('login.forgot_password')}
                onPress={() => {}}
                variant="text"
                style={styles.forgotButton}
              />
            </Link>

            <AuthButton
              title={t('shared.sign_in')}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('login.no_account')}</Text>
            <Link href="/(auth)/register" asChild>
              <AuthButton title={t('shared.sign_up')} onPress={() => {}} variant="text" />
            </Link>
          </View>
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
    marginBottom: Spacing.hero,
  },
  brand: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.link,
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.foreground,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.mutedForeground,
  },
  form: {
    width: '100%',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.sm,
    minHeight: 32,
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: 15,
    color: Colors.mutedForeground,
  },
});
