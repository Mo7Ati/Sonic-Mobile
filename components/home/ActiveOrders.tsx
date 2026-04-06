import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-color';
import { SectionHeader } from './SectionHeader';
import type { ActiveOrder, Section } from './types';

interface ActiveOrdersProps {
  section: Section;
  onOrderPress?: (order: ActiveOrder) => void;
  onSeeAll?: () => void;
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; iconBg: string; icon: IoniconsName; progress: number }
> = {
  pending: { label: 'Pending', color: '#92400e', bg: '#fef3c7', iconBg: '#fde68a', icon: 'hourglass-outline', progress: 0.2 },
  confirmed: { label: 'Confirmed', color: '#1e40af', bg: '#dbeafe', iconBg: '#bfdbfe', icon: 'checkmark-circle-outline', progress: 0.4 },
  preparing: { label: 'Preparing', color: '#9a3412', bg: '#ffedd5', iconBg: '#fed7aa', icon: 'flame-outline', progress: 0.6 },
  on_the_way: { label: 'On the Way', color: '#065f46', bg: '#d1fae5', iconBg: '#a7f3d0', icon: 'bicycle-outline', progress: 0.8 },
  delivered: { label: 'Delivered', color: '#166534', bg: '#dcfce7', iconBg: '#bbf7d0', icon: 'checkmark-done-outline', progress: 1.0 },
};

const DEFAULT_STATUS = {
  label: 'Processing',
  color: '#475569',
  bg: '#f1f5f9',
  iconBg: '#e2e8f0',
  icon: 'ellipsis-horizontal' as IoniconsName,
  progress: 0.1,
};

export const ActiveOrders: React.FC<ActiveOrdersProps> = ({ section, onOrderPress, onSeeAll }) => {
  const orders = (section.data as ActiveOrder[]) || [];
  const colors = useThemeColors();

  const cardShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  };

  const renderOrder = useCallback(
    ({ item }: { item: ActiveOrder }) => {
      const status = STATUS_CONFIG[item.status] || DEFAULT_STATUS;

      return (
        <Pressable
          onPress={() => onOrderPress?.(item)}
          style={({ pressed }) => [styles.card, { backgroundColor: colors.card }, cardShadow, pressed && styles.cardPressed]}>
          <View style={styles.topRow}>
            <Text style={[styles.orderNum, { color: colors.mutedForeground }]}>#{item.order_number}</Text>
            <View style={[styles.badge, { backgroundColor: status.bg }]}>
              <Ionicons name={status.icon} size={11} color={status.color} />
              <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>

          <View style={styles.storeRow}>
            <View style={[styles.storeIcon, { backgroundColor: status.iconBg }]}>
              <Ionicons name="storefront" size={14} color={status.color} />
            </View>
            <View style={styles.storeTextCol}>
              {item.store_name ? (
                <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={1}>
                  {item.store_name}
                </Text>
              ) : null}
              <Text style={[styles.itemsHint, { color: colors.mutedForeground }]}>
                {item.items_count} {item.items_count === 1 ? 'item' : 'items'}
              </Text>
            </View>
            <Text style={[styles.total, { color: colors.foreground }]}>${item.total.toFixed(2)}</Text>
          </View>

          <View style={[styles.trackBg, { backgroundColor: colors.muted }]}>
            <View
              style={[
                styles.trackFill,
                { width: `${status.progress * 100}%`, backgroundColor: status.color },
              ]}
            />
          </View>
        </Pressable>
      );
    },
    [onOrderPress, colors]
  );

  if (orders.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title={section.title} description={section.description} onSeeAll={onSeeAll} />
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  card: {
    marginRight: 12,
    width: 240,
    overflow: 'hidden',
    borderRadius: 16,
    padding: 16,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
  topRow: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderNum: {
    fontSize: 11,
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  storeRow: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeIcon: {
    marginRight: 10,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  storeTextCol: {
    flex: 1,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemsHint: {
    fontSize: 10,
  },
  total: {
    fontSize: 14,
    fontWeight: '700',
  },
  trackBg: {
    height: 4,
    overflow: 'hidden',
    borderRadius: 9999,
  },
  trackFill: {
    height: '100%',
    borderRadius: 9999,
  },
  listContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
