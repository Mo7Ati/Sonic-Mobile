import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { FontFamily } from '@/constants/fonts';

export type DeliverToHeaderProps = {
  caption?: string;
  address?: string;
  onAddressPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
};

export function DeliverToHeader({
  caption,
  address,
  onAddressPress,
  onNotificationsPress,
  onProfilePress,
}: DeliverToHeaderProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation('general');
  const resolvedCaption = caption ?? t('deliver_to');
  const resolvedAddress = address ?? t('address_placeholder');

  return (
    <View style={styles.header}>
      <View style={styles.addressContainer}>
        <Ionicons name="location-outline" size={20} color={colors.primary} />
        <View>
          <Text style={[styles.deliverLabel, { color: colors.mutedForeground }]}>{resolvedCaption}</Text>
          <Pressable style={styles.addressRow} onPress={onAddressPress}>
            <Text style={styles.addressText}>{resolvedAddress}</Text>
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
    // fontWeight: '700',
    fontFamily: FontFamily.medium,
  },
  chevron: {
    marginStart: Spacing.xs,
  },
});
