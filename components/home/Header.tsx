import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FontFamily } from '@/constants/fonts';
import { BorderRadius, Spacing } from '@/constants/theme';
import { selectItemsCount, useCartStore } from '@/stores/cart-store';
import { useLastSelectedAddress } from '@/stores/app-prefs-store';
import { AddressSelector } from '@/app/addresses/components/AddressSelector';
import { getHeaderAddressSummary } from '@/lib/utils.';
import { Colors } from '@/constants/theme';

export function Header({ canSelectOtherAddress = true, showCartButton = true, showIcon = true }: { canSelectOtherAddress?: boolean, showCartButton?: boolean, showIcon?: boolean }) {
  const { t } = useTranslation('general');
  const router = useRouter();

  const [addressSelectorVisible, setAddressSelectorVisible] = useState(false);

  const address = useLastSelectedAddress();
  const addressDisplay = getHeaderAddressSummary(address) ?? t('address_placeholder');
  const itemsCount = useCartStore(selectItemsCount);

  return (
    <View style={styles.header}>
      <View style={styles.addressContainer}>
        {/* icon for location */}
        {showIcon && <Ionicons name="location-outline" size={20} color={Colors.primary} />}

        {/* deliver to label and address */}
        <View style={styles.addressTextContainer}>
          <Text style={styles.deliverLabel}>{t('deliver_to')}</Text>

          {/* address row */}
          <Pressable style={styles.addressRow} onPress={() => setAddressSelectorVisible(true)}>
            <Text style={styles.addressText}>{addressDisplay}</Text>
            <Ionicons name="chevron-down" size={14} style={styles.chevron} />
          </Pressable>
        </View>
      </View>

      <View style={styles.actions}>
        {
          showCartButton && <Pressable onPress={() => router.push('/cart')} hitSlop={8} style={styles.cartButton}>
            <Ionicons name="cart-outline" size={24} color={Colors.foreground} />
            {itemsCount > 0 && (
              <View style={[styles.badge, { backgroundColor: Colors.primary }]}>
                <Text style={[styles.badgeText, { color: Colors.primaryForeground }]}>
                  {itemsCount > 99 ? '99+' : itemsCount}
                </Text>
              </View>
            )}
          </Pressable>
        }
      </View>


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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  addressTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  deliverLabel: {
    fontSize: 16,
    textAlign: 'left',
    fontFamily: FontFamily.semiBold
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 14,
    marginTop: 1.7,
    fontFamily: FontFamily.regular,
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
