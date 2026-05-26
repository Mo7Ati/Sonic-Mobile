import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, Pressable, StyleSheet, type ViewStyle } from 'react-native';

interface AuthBackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
}

export function AuthBackButton({ onPress, style }: AuthBackButtonProps) {
  const { t } = useTranslation('general');
  const handlePress = onPress ?? (() => router.back());
  const iconName = I18nManager.isRTL ? 'chevron-forward' : 'chevron-back';

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      hitSlop={Spacing.tight}
      accessibilityRole="button"
      accessibilityLabel={t('actions.go_back')}
    >
      <Ionicons name={iconName} size={22} color={Colors.foreground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.muted,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
