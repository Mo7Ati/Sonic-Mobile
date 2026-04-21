import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';

import { DeliverToHeader } from '@/components/DeliverToHeader';
import { AddressSelector } from '@/components/AddressSelector';
import { useHomeSections } from '@/hooks/react-query-hooks/use-home-sections';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { parseApiError } from '@/lib/api';
import type { Section } from '@/services/home/home-types';
import { selectSelectedAddress, useAddressStore } from '@/stores/address-store';
import { HomePageSkeleton } from './HomePageSkeleton';
import { SectionRenderer } from './SectionRenderer';

export const HomePage = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t } = useTranslation(['general', 'addresses']);

  const selectedAddress = useAddressStore(selectSelectedAddress);
  const fetchAddresses = useAddressStore((s) => s.fetchAddresses);
  const fetchFieldTemplates = useAddressStore((s) => s.fetchFieldTemplates);
  const [selectorVisible, setSelectorVisible] = useState(false);

  useEffect(() => {
    fetchFieldTemplates();
    fetchAddresses();
  }, [fetchFieldTemplates, fetchAddresses]);

  const addressDisplay = selectedAddress
    ? selectedAddress.fields.map((f) => f.value).filter(Boolean).join(', ')
    : undefined;

  const {
    data: sections,
    isPending,
    isRefetching,
    error,
    refetch,
  } = useHomeSections();

  const renderSection = useCallback(
    ({ item }: { item: Section }) => (
      <SectionRenderer section={item} />
    ),
    [],
  );

  if (isPending) {
    return <HomePageSkeleton />;
  }

  if (error) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <View style={styles.errorBox}>
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>{parseApiError(error).message}</Text>
          <Pressable style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={() => void refetch()}>
            <Text style={[styles.retryLabel, { color: colors.primaryForeground }]}>{t('general:actions.retry')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <DeliverToHeader
        address={addressDisplay ?? t('addresses:add_delivery_address')}
        onAddressPress={() => setSelectorVisible(true)}
      />
      <AddressSelector
        visible={selectorVisible}
        onClose={() => setSelectorVisible(false)}
      />

      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t('general:empty.nothing_to_show')}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  errorBox: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['2xl'],
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.tight,
    borderRadius: BorderRadius.full,
  },
  retryLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 15,
    paddingHorizontal: Spacing.lg,
  },
});
