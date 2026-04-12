import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export type DeliverToHeaderProps = {
  caption?: string;
  address?: string;
  onAddressPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
};

export function DeliverToHeader({
  caption = 'Deliver to',
  address = 'Gaza - Rimal',
  onAddressPress,
  onNotificationsPress,
  onProfilePress,
}: DeliverToHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.header}>
      <View style={styles.addressContainer}>
        <Ionicons name="location-outline" size={20} color={colors.primary} />
        <View>
          <Text style={[styles.deliverLabel, { color: colors.mutedForeground }]}>{caption}</Text>
          <Pressable style={styles.addressRow} onPress={onAddressPress}>
            <Text style={styles.addressText}>{address}</Text>
            <Ionicons name="chevron-down" size={14} style={styles.chevron} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.gutter,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deliverLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'left',
  },
  addressRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 16,
    fontWeight: '700',
  },
  chevron: {
    marginStart: Spacing.xs,
  },
});
