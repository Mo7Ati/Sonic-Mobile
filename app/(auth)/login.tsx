import { AuthButton } from '@/components/ui/auth-button';
import { AuthInput } from '@/components/ui/auth-input';
import { FontFamily } from '@/constants/fonts';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { parseApiError, type ApiError } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function applyServerErrors(apiError: ApiError) {
    if (apiError.errors) {
      for (const [field, messages] of Object.entries(apiError.errors)) {
        if (field === 'email' || field === 'password') {
          setError(field, {
            message: messages[0],
          });
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
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t('login.title')}</Text>

            <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            {/* Email Input */}
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
                  placeholder={t('login.email_placeholder')}
                  keyboardType="email-address"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: t('general:validation.password_required'),
              }}
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

            {/* Forgot Password Link */}
            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>
                  {t('login.forgot_password')}
                </Text>
              </TouchableOpacity>
            </Link>

            <AuthButton
              title={t('login.submit')}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.submitButton}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />

              <Text style={styles.dividerText}>
                {t('login.or_continue_with')}
              </Text>

              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons
                  name="logo-google"
                  size={20}
                  color={Colors.foreground}
                />

                <Text style={styles.socialButtonText}>
                  {t('login.social_google')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Ionicons
                  name="logo-apple"
                  size={20}
                  color={Colors.foreground}
                />

                <Text style={styles.socialButtonText}>
                  {t('login.social_apple')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Continue as Guest Button */}
            <TouchableOpacity style={styles.guestButton} onPress={() => router.push('/')}>
              <Text style={styles.guestButtonText}>
                {t('login.continue_as_guest')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('login.no_account')}</Text>

            {/* Register Link */}
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerText}>
                  {t('shared.register')}
                </Text>
              </TouchableOpacity>
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },

  header: {
    marginBottom: Spacing.hero,
  },

  title: {
    fontSize: 32,
    fontFamily: FontFamily.bold,
    color: Colors.foreground,
    marginBottom: Spacing.sm,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: FontFamily.regular,
    color: Colors.mutedForeground,
  },

  form: {
    width: '100%',
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    color: Colors.primary,
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },

  submitButton: {
    marginTop: Spacing.xs,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },

  dividerText: {
    marginHorizontal: Spacing.tight,
    color: Colors.mutedForeground,
    fontSize: 13,
    fontFamily: FontFamily.medium,
  },

  socialButtons: {
    flexDirection: 'row',
    gap: Spacing.tight,
  },

  socialButton: {
    flex: 1,
    height: 52,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },

  socialButtonText: {
    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    color: Colors.foreground,
  },

  guestButton: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },

  guestButtonText: {
    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    color: Colors.primary,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.hero,
    gap: Spacing.narrow,
  },

  footerText: {
    fontSize: 15,
    fontFamily: FontFamily.regular,
    color: Colors.mutedForeground,
  },

  registerText: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },
});
