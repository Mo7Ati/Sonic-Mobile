import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { I18nManager, Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-color';
import type { Section } from '@/services/home/home-types';
import { UnPaidOrdersData } from '@/services/home/home-types';

interface UnPaidOrdersProps {
  section: Section;
  onPress?: () => void;
}

export const UnPaidOrders: React.FC<UnPaidOrdersProps> = ({ section, onPress }) => {
  const data = section.data as UnPaidOrdersData;
  const colors = useThemeColors();

  if (!data || data.orders_count === 0) return null;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, { borderColor: colors.chart4 }, pressed && { opacity: 0.85 }]}>
        <View style={styles.iconCircle}>
          <Ionicons name="alert-circle" size={18} color={colors.chart4} />
        </View>

        <View style={styles.textCol}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {data.orders_count} Unpaid {data.orders_count === 1 ? 'Order' : 'Orders'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Tap to complete payment</Text>
        </View>

        <View style={[styles.payPill, { backgroundColor: colors.chart4 }]}>
          <Text style={styles.payText}>Pay</Text>
          <Ionicons name={I18nManager.isRTL ? "arrow-back" : "arrow-forward"} size={12} color="#fff" />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconCircle: {
    marginEnd: 12,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 10,
  },
  payPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  payText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
});
