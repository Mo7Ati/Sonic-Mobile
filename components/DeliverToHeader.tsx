import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { FontFamily } from '@/constants/fonts';
import { selectItemsCount, useCartStore } from '@/stores/cart-store';

export type DeliverToHeaderProps = {
  caption?: string;
  address?: string;
  onAddressPress?: () => void;
};

export function DeliverToHeader({
  caption,
  address,
  onAddressPress,
}: DeliverToHeaderProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation('general');
  const router = useRouter();
  const itemsCount = useCartStore(selectItemsCount);
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

      <Pressable onPress={() => router.push('/cart')} hitSlop={8} style={styles.cartButton}>
        <Ionicons name="cart-outline" size={24} color={colors.foreground} />
        {itemsCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>
              {itemsCount > 99 ? '99+' : itemsCount}
            </Text>
          </View>
        )}
      </Pressable>
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
  cartButton: {
    position: 'relative',
    padding: Spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: 0,
    end: 0,
    minWidth: 18,
    height: 18,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
});
