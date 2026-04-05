import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-color';

interface SectionHeaderProps {
  title: string | null;
  description?: string | null;
  onSeeAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, onSeeAll }) => {
  const colors = useThemeColors();

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
          <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  description: {
    marginTop: 2,
    fontSize: 12,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllPressed: {
    opacity: 0.6,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
