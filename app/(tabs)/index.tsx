import React, { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';

import { Header } from '@/components/home/Header';
import { HomePageSkeleton } from '@/components/home/HomePageSkeleton';
import { SectionRenderer } from '@/components/home/SectionRenderer';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useHomeSections } from '@/hooks/react-query-hooks/use-home-sections';
import { useAppTheme } from '@/hooks/use-app-theme';
import { parseApiError } from '@/lib/api';
import { useLastSelectedAddress } from '@/stores/app-prefs-store';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t } = useTranslation(['general', 'addresses']);

  const lastSelectedAddress = useLastSelectedAddress();

  const {
    data: sections,
    isFetching,
    error,
    refetch,
  } = useHomeSections(lastSelectedAddress?.id);


  const renderContent = () => {
    if (isFetching) {
      return <>
        <Header />
        <HomePageSkeleton />
      </>
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
        renderItem={({ item }) => <SectionRenderer section={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Header />}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isFetching}
        //     onRefresh={() => void refetch()}
        //     tintColor={colors.primary}
        //     progressBackgroundColor={colors.background}
        //     progressViewOffset={insets.top}
        //   />
        // }
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