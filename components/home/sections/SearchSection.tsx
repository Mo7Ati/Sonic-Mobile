import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { I18nManager, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@/hooks/use-app-theme';
import { BorderRadius, Spacing } from '@/constants/theme';

interface SearchSectionProps {
  onPress?: () => void;
  placeholder?: string;
  editable?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  onPress,
  placeholder,
  editable = false,
  value,
  onChangeText,
}) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation('home');
  const resolvedPlaceholder = placeholder ?? t('search_section.placeholder');

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={editable ? undefined : onPress}
        style={({ pressed }) => [
          styles.bar,
          { borderColor: colors.border },
          !editable && pressed && { opacity: 0.8 },
        ]}>
        <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
        {editable ? (
          <TextInput
            style={[styles.input, { color: colors.foreground, writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}
            placeholder={resolvedPlaceholder}
            placeholderTextColor={colors.placeholder}
            value={value}
            onChangeText={onChangeText}
            autoCapitalize="none"
            autoCorrect={false}
          />
        ) : (
          <Text style={[styles.placeholder, { color: colors.mutedForeground }]}>{resolvedPlaceholder}</Text>
        )}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Pressable style={styles.filterHit} hitSlop={Spacing.sm}>
          <Ionicons name="options-outline" size={18} color={colors.foreground} />
        </Pressable>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Spacing.tight,
    paddingHorizontal: Spacing.gutter,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.tight,
  },
  placeholder: {
    marginStart: Spacing.sm,
    flex: 1,
    fontSize: 14,
  },
  input: {
    marginStart: Spacing.sm + Spacing.xs,
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  divider: {
    height: 28,
    width: 1,
  },
  filterHit: {
    marginStart: Spacing.sm + Spacing.xs,
  },
});
