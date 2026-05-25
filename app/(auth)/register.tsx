import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthInput } from '@/components/ui/auth-input';
import { AuthButton } from '@/components/ui/auth-button';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { parseApiError, type ApiError } from '@/lib/api';

interface RegisterForm {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
}

export default function RegisterScreen() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['auth', 'general']);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      password: '',
      password_confirmation: '',
    },
  });

  const password = watch('password');

  function applyServerErrors(apiError: ApiError) {
    if (!apiError.errors) return;
    const fieldNames: (keyof RegisterForm)[] = [
      'name',
      'email',
      'phone_number',
      'password',
      'password_confirmation',
    ];
    for (const [field, messages] of Object.entries(apiError.errors)) {
      if (fieldNames.includes(field as keyof RegisterForm)) {
        setError(field as keyof RegisterForm, { message: messages[0] });
      }
    }
  }

  async function onSubmit(form: RegisterForm) {
    setLoading(true);
    try {
      const params = {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        ...(form.phone_number ? { phone_number: form.phone_number } : {}),
      };
      await register(params);
    } catch (error) {
      const apiError = parseApiError(error);
      if (apiError.status === 422) {
        applyServerErrors(apiError);
      } else {
        Toast.show({
          type: 'error',
          text1: t('register.toast_failed_title'),
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
            <Text style={styles.title}>{t('register.title')}</Text>
            <Text style={styles.subtitle}>{t('register.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              rules={{ required: t('general:validation.name_required') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label={t('register.full_name')}
                  icon="person-outline"
                  placeholder={t('register.name_placeholder')}
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
              name="phone_number"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label={t('register.phone_optional')}
                  icon="call-outline"
                  placeholder={t('register.phone_placeholder')}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone_number?.message}
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
                  label={t('shared.password')}
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
                  label={t('register.confirm_password')}
                  icon="lock-closed-outline"
                  placeholder={t('register.confirm_placeholder')}
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
              title={t('register.create_account')}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('register.have_account')}</Text>
            <Link href="/(auth)/login" asChild>
              <AuthButton title={t('shared.sign_in')} onPress={() => {}} variant="text" />
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
    paddingVertical: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg + Spacing.xs,
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
  submitButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: 15,
    color: Colors.mutedForeground,
  },
});
