import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { I18nManager, Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from 'react-i18next';

interface SectionHeaderProps {
  title: string | null;
  description?: string | null;
  onSeeAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, onSeeAll }) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation('general');

  if (!title) return null;

  return (
    <View style={styles.row}>
      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        {description ? (
          <Text style={[styles.description, { color: colors.mutedForeground }]}>{description}</Text>
        ) : null}
      </View>
      {onSeeAll ? (
        <Pressable
          onPress={onSeeAll}
          style={({ pressed }) => [styles.seeAll, pressed && styles.seeAllPressed]}>
          <Text style={[styles.seeAllText, { color: colors.primary }]}>{t('actions.see_all')}</Text>
          <Ionicons name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"} size={14} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginBottom: Spacing.tight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.gutter,
  },
  titleBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    marginTop: Spacing.xs / 2,
    fontSize: 12,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  seeAllPressed: {
    opacity: 0.6,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
