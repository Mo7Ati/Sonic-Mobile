import { AuthButton } from '@/components/ui/auth-button';
import { AuthInput } from '@/components/ui/auth-input';
import { useAuth } from '@/contexts/auth-context';
import { parseApiError, type ApiError } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
          text1: 'Error',
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
            <Ionicons name="mail-open-outline" size={64} color="#0a7ea4" />
          </View>
          <Text style={styles.successTitle}>Check your email</Text>
          <Text style={styles.successMessage}>
            We sent a password reset link to{' '}
            <Text style={styles.emailHighlight}>{getValues('email')}</Text>.
            {'\n\n'}
            Open the link in the email to reset your password. If you don&apos;t see
            it, check your spam folder.
          </Text>
          <AuthButton
            title="Back to Sign In"
            onPress={() => router.replace('/(auth)/login')}
            style={styles.backButton}
          />
          <AuthButton
            title="Resend Email"
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
              <Ionicons name="key-outline" size={32} color="#0a7ea4" />
            </View>
            <Text style={styles.title}>Forgot password?</Text>
            <Text style={styles.subtitle}>
              Enter your email and we&apos;ll send you a link to reset your password.
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Email"
                  icon="mail-outline"
                  placeholder="you@example.com"
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
              title="Send Reset Link"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.submitButton}
            />
          </View>

          <AuthButton
            title="Back to Sign In"
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
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: 8,
  },
  backLink: {
    marginTop: 24,
  },
  successScroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  emailHighlight: {
    fontWeight: '600',
    color: '#111827',
  },
  backButton: {
    width: '100%',
    marginBottom: 12,
  },
  resendButton: {
    width: '100%',
  },
});
