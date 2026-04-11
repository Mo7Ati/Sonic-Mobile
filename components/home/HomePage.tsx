import React, { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeliverToHeader } from '@/components/DeliverToHeader';
import { useHomeSections } from '@/hooks/react-query-hooks/use-home-sections';
import { useThemeColors } from '@/hooks/use-theme-color';
import { parseApiError } from '@/lib/api';
import type { Section } from '@/services/home/home-types';
import { HomePageSkeleton } from './HomePageSkeleton';
import { SectionRenderer } from './SectionRenderer';

export const HomePage = () => {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const {
    data: sections,
    isPending,
    isRefetching,
    error,
    refetch,
  } = useHomeSections();

  if (isPending) {
    return <HomePageSkeleton />;
  }

  if (error) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <View style={styles.errorBox}>
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>{parseApiError(error).message}</Text>
          <Pressable style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={() => void refetch()}>
            <Text style={[styles.retryLabel, { color: colors.primaryForeground }]}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const renderSection = useCallback(
    ({ item }: { item: Section }) => (
      <SectionRenderer section={item} />
    ),
    [],
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <DeliverToHeader />

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
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nothing to show yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  errorBox: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  retryLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 15,
    paddingHorizontal: 24,
  },
});
