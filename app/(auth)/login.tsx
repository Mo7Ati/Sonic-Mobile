import { AuthButton } from '@/components/ui/auth-button';
import { AuthInput } from '@/components/ui/auth-input';
import { useAuth } from '@/contexts/auth-context';
import { parseApiError, type ApiError } from '@/lib/api';
import { Link } from 'expo-router';
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

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

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
          text1: 'Account Deactivated',
          text2: 'Your account has been deactivated. Please contact support.',
          visibilityTime: 5000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
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
            <Text style={styles.brand}>Sonic</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
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

            <Controller
              control={control}
              name="password"
              rules={{ required: 'Password is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Password"
                  icon="lock-closed-outline"
                  placeholder="Enter your password"
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
                title="Forgot password?"
                onPress={() => {}}
                variant="text"
                style={styles.forgotButton}
              />
            </Link>

            <AuthButton
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <Link href="/(auth)/register" asChild>
              <AuthButton title="Sign Up" onPress={() => {}} variant="text" />
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
    marginBottom: 36,
  },
  brand: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0a7ea4',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  form: {
    width: '100%',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    minHeight: 32,
  },
  submitButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 15,
    color: '#6b7280',
  },
});
