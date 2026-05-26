import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FontFamily } from '@/constants/fonts';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { selectItemsCount, useCartStore } from '@/stores/cart-store';
import { useLastSelectedAddress } from '@/stores/app-prefs-store';
import { AddressSelector } from '@/app/addresses/components/AddressSelector';

export function Header() {
  const { t } = useTranslation('general');
  const { colors } = useAppTheme();
  const router = useRouter();

  const [addressSelectorVisible, setAddressSelectorVisible] = useState(false);

  const address = useLastSelectedAddress();
  const addressDisplay = useMemo(() => address ? address.name : t('address_placeholder'), [address]);
  const itemsCount = useCartStore(selectItemsCount);

  return (
    <View style={styles.header}>
      <View style={styles.addressContainer}>
        <Ionicons name="location-outline" size={25} color={colors.primary} />
        <View>
          <Pressable style={styles.addressRow} onPress={() => setAddressSelectorVisible(true)}>
            <Text style={styles.addressText}>{t('deliver_to', { address: addressDisplay })}</Text>
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


      <AddressSelector
        visible={addressSelectorVisible}
        onClose={() => setAddressSelectorVisible(false)}
      />
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
