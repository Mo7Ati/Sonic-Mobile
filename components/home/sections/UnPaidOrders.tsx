import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { I18nManager, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { Section } from '@/services/home/home-types';
import { UnPaidOrdersData } from '@/services/home/home-types';

interface UnPaidOrdersProps {
  section: Section;
  onPress?: () => void;
}

export const UnPaidOrders: React.FC<UnPaidOrdersProps> = ({ section, onPress }) => {
  const data = section.data as UnPaidOrdersData;
  const { colors } = useAppTheme();
  const { t } = useTranslation('home');

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
            {t('unpaid_orders.title', { count: data.orders_count })}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{t('unpaid_orders.subtitle')}</Text>
        </View>

        <View style={[styles.payPill, { backgroundColor: colors.chart4 }]}>
          <Text style={[styles.payText, { color: colors.inverseForeground }]}>{t('unpaid_orders.pay')}</Text>
          <Ionicons name={I18nManager.isRTL ? "arrow-back" : "arrow-forward"} size={12} color={colors.inverseForeground} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Spacing.tight,
    paddingHorizontal: Spacing.gutter,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.tight,
  },
  iconCircle: {
    marginEnd: Spacing.tight,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
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
    gap: Spacing.xs,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.tight,
    paddingVertical: 6,
  },
  payText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
