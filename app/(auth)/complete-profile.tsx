import { AuthButton } from '@/components/ui/auth-button';
import { AuthInput } from '@/components/ui/auth-input';
import { FontFamily } from '@/constants/fonts';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { parseApiError } from '@/lib/api';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

interface ProfileForm {
  name: string;
}

export default function CompleteProfileScreen() {
  const { updateProfile, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['auth', 'general']);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }

    if (user?.name) {
      router.replace('/');
    }
  }, [isAuthenticated, user?.name]);

  async function onSubmit(form: ProfileForm) {
    setLoading(true);

    try {
      await updateProfile(form.name.trim());
      router.replace('/');
    } catch (error) {
      const apiError = parseApiError(error);

      if (apiError.status === 422 && apiError.errors?.name) {
        setError('name', { message: apiError.errors.name[0] });
      } else {
        Toast.show({
          type: 'error',
          text1: t('complete_profile.toast_failed_title'),
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
            <Text style={styles.title}>{t('complete_profile.title')}</Text>
            <Text style={styles.subtitle}>{t('complete_profile.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              rules={{ required: t('general:validation.name_required') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label={t('complete_profile.name_label')}
                  icon="person-outline"
                  placeholder={t('complete_profile.name_placeholder')}
                  autoComplete="name"
                  autoFocus
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                />
              )}
            />

            <AuthButton
              title={t('complete_profile.submit')}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.submitButton}
            />
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
  submitButton: {
    marginTop: Spacing.xs,
  },
});
