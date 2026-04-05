import { Ionicons } from '@expo/vector-icons';
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

import { useThemeColors } from '@/hooks/use-theme-color';
import { useHomeSections } from '@/hooks/react-query-hooks/use-home-sections';
import { parseApiError } from '@/services/api';
import { HomePageSkeleton } from './HomePageSkeleton';
import { SectionRenderer } from './SectionRenderer';
import type { Section } from './types';

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

  const header = (
    <View style={styles.header}>
      <View>
        <Text style={[styles.deliverLabel, { color: colors.mutedForeground }]}>Deliver to</Text>
        <Pressable style={styles.addressRow}>
          <Ionicons name="location" size={14} color={colors.primary} />
          <Text style={[styles.addressText, { color: colors.foreground }]}>Gaza - Rimal</Text>
          <Ionicons name="chevron-down" size={14} color={colors.foreground} style={styles.chevron} />
        </Pressable>
      </View>
      <View style={styles.headerActions}>
        <Pressable style={[styles.iconButton, { backgroundColor: colors.card }, styles.iconButtonShadow]}>
          <Ionicons name="notifications-outline" size={18} color={colors.foreground} />
        </Pressable>
        <Pressable style={[styles.iconButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="person" size={16} color={colors.primaryForeground} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      {header}

      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => {
          return item.id.toString();
        }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  deliverLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  addressRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '700',
  },
  chevron: {
    marginLeft: 2,
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
