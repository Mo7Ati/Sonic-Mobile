import { AuthBackButton } from '@/components/ui/auth-back-button';
import { AuthButton } from '@/components/ui/auth-button';
import { FontFamily } from '@/constants/fonts';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { parseApiError } from '@/lib/api';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

type OtpMode = 'login' | 'phone_change';

export default function VerifyOtpScreen() {
  const { verifyOtp, verifyNewPhone, resendOtp, updateProfile } = useAuth();
  const { t } = useTranslation(['auth', 'settings']);

  const params = useLocalSearchParams<{
    phone_number: string;
    mode?: OtpMode;
    name?: string;
  }>();

  const phoneNumber = params.phone_number;
  const name = params.name;
  const isPhoneChange = params.mode === 'phone_change';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  const inputRef = useRef<TextInput>(null);
  const verifyingRef = useRef(false);

  useEffect(() => {
    if (!phoneNumber) {
      router.replace(isPhoneChange ? '/account-info' : '/(auth)/login');
      return;
    }

    if (isPhoneChange && !name) {
      router.replace('/account-info');
    }
  }, [phoneNumber, name, isPhoneChange]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = useCallback(
    async (code: string) => {
      if (verifyingRef.current || code.length !== OTP_LENGTH || !phoneNumber) return;

      verifyingRef.current = true;
      setLoading(true);
      setError(undefined);

      try {
        if (isPhoneChange) {
          await verifyNewPhone(phoneNumber, code);

          Toast.show({
            type: 'success',
            text1: t('settings:account_info.phone_updated_title'),
            text2: t('settings:account_info.phone_updated_message'),
          });

          router.replace('/account-info');
          return;
        }

        const { isNewCustomer } = await verifyOtp(phoneNumber, code);

        if (isNewCustomer) {
          router.replace('/(auth)/complete-profile');
        } else {
          router.replace('/');
        }
      } catch (err) {
        const apiError = parseApiError(err);
        const otpError =
          apiError.errors?.otp?.[0] ??
          apiError.errors?.new_phone_number?.[0] ??
          apiError.errors?.code?.[0] ??
          apiError.message;

        setError(otpError);
        setOtp('');
        inputRef.current?.focus();

        if (apiError.status !== 422) {
          Toast.show({
            type: 'error',
            text1: t('otp.toast_failed_title'),
            text2: apiError.message,
          });
        }
      } finally {
        setLoading(false);
        verifyingRef.current = false;
      }
    },
    [phoneNumber, isPhoneChange, t, verifyOtp, verifyNewPhone],
  );

  useEffect(() => {
    if (otp.length === OTP_LENGTH) {
      handleVerify(otp);
    }
  }, [otp, handleVerify]);

  async function handleResend() {
    if (cooldown > 0 || resendLoading || !phoneNumber) return;

    if (isPhoneChange && !name) return;

    setResendLoading(true);
    setError(undefined);

    try {
      if (isPhoneChange) {
        await updateProfile(name!, phoneNumber);
      } else {
        await resendOtp(phoneNumber);
      }

      setCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp('');
      inputRef.current?.focus();
      Toast.show({
        type: 'success',
        text1: t('otp.toast_resent_title'),
        text2: t('otp.toast_resent_message'),
      });
    } catch (err) {
      const apiError = parseApiError(err);
      if (apiError.status === 422) {
        setCooldown(RESEND_COOLDOWN_SECONDS);
      }
      Toast.show({
        type: 'error',
        text1: t('otp.toast_failed_title'),
        text2: apiError.message,
      });
    } finally {
      setResendLoading(false);
    }
  }

  function handleChange(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setError(undefined);
    setOtp(digits);
  }

  const title = isPhoneChange
    ? t('settings:account_info.verify_phone_title')
    : t('otp.title');

  const subtitle = isPhoneChange
    ? t('settings:account_info.verify_phone_subtitle', { phone: phoneNumber })
    : t('otp.subtitle', { phone: phoneNumber });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backRow}>
        <AuthBackButton onPress={() => router.back()} />
      </View>

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
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <Pressable style={styles.otpRow} onPress={() => inputRef.current?.focus()}>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => {
              const digit = otp[index] ?? '';
              const isActive = index === otp.length && otp.length < OTP_LENGTH;

              return (
                <View
                  key={index}
                  style={[
                    styles.otpCell,
                    error ? styles.otpCellError : null,
                    isActive ? styles.otpCellActive : null,
                  ]}
                >
                  <Text style={styles.otpDigit}>{digit}</Text>
                </View>
              );
            })}
          </Pressable>

          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={handleChange}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            maxLength={OTP_LENGTH}
            style={styles.hiddenInput}
            autoFocus
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <AuthButton
            title={t('otp.verify')}
            onPress={() => handleVerify(otp)}
            loading={loading}
            disabled={otp.length !== OTP_LENGTH}
            style={styles.verifyButton}
          />

          <Pressable
            onPress={handleResend}
            disabled={cooldown > 0 || resendLoading}
            style={styles.resendButton}
          >
            <Text
              style={[
                styles.resendText,
                cooldown > 0 || resendLoading ? styles.resendTextDisabled : null,
              ]}
            >
              {cooldown > 0
                ? t('otp.resend_in', { seconds: cooldown })
                : t('otp.resend')}
            </Text>
          </Pressable>
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
  backRow: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
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
    marginBottom: Spacing.hero,
  },
  title: {
    fontSize: 28,
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
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  otpCell: {
    flex: 1,
    height: 56,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    backgroundColor: Colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpCellActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
  },
  otpCellError: {
    borderColor: Colors.destructive,
    backgroundColor: Colors.surfaceError,
  },
  otpDigit: {
    fontSize: 22,
    fontFamily: FontFamily.semiBold,
    color: Colors.foreground,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  errorText: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: Colors.destructive,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  verifyButton: {
    marginTop: Spacing.sm,
  },
  resendButton: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  resendText: {
    fontSize: 15,
    fontFamily: FontFamily.semiBold,
    color: Colors.primary,
  },
  resendTextDisabled: {
    color: Colors.mutedForeground,
  },
});
