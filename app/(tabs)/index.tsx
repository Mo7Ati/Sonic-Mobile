import React, { useCallback, useEffect } from 'react';
import {
  Button,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';

import { Header } from '@/components/home/Header';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useHomeSections } from '@/hooks/react-query-hooks/use-home-sections';
import { useAppTheme } from '@/hooks/use-app-theme';
import { parseApiError } from '@/lib/api';
import type { Section } from '@/services/home/home-types';
import { useLastSelectedAddress } from '@/stores/platform-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SectionRenderer } from '@/components/home/SectionRenderer';
import { HomePageSkeleton } from '@/components/home/HomePageSkeleton';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t } = useTranslation(['general', 'addresses']);

  const lastSelectedAddress = useLastSelectedAddress();

  useEffect(() => {
    refetch();
  }, [lastSelectedAddress]);


  const {
    data: sections,
    isPending,
    isRefetching,
    error,
    refetch,
  } = useHomeSections();

  const renderSection = useCallback(
    ({ item }: { item: Section }) => (
      <>
        <SectionRenderer section={item} />
        <Button title="clear storage" onPress={async () => {
          await AsyncStorage.clear();
          console.log(await AsyncStorage.getItem('appLanguage'));
        }} />
      </>
    ),
    [],
  );

  const renderContent = () => {
    if (isPending) {
      return <HomePageSkeleton />;
    }

    if (error) {
      return (
        <View style={styles.errorBox}>
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>{parseApiError(error).message}</Text>
          <Pressable style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={() => void refetch()}>
            <Text style={[styles.retryLabel, { color: colors.primaryForeground }]}>{t('general:actions.retry')}</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Header />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            tintColor={colors.primary}
            progressBackgroundColor={colors.background}
            progressViewOffset={insets.top}
          />
        }
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t('general:empty.nothing_to_show')}</Text>}
      />
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      {renderContent()}
    </View>
  );
}

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
}
);