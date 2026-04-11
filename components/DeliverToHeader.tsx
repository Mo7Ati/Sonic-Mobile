import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-color';

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
  const colors = useThemeColors();

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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
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
    marginStart: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  iconButtonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
