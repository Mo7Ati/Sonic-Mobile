import BranchCard from "@/app/branch/components/branch-card";
import BranchesListSkeleton from "@/app/branch/components/branches-list-skeleton";
import { SearchSection } from "@/components/home/sections/SearchSection";
import SubCategoriesList from "@/app/store-category/components/sub-categories/sub-categories-list";
import SubCategoriesSkeleton from "@/app/store-category/components/sub-categories/sub-categories-skeleton";
import { Spacing } from "@/constants/theme";
import { FontFamily } from "@/constants/fonts";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Branch } from "@/services/branch/types";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Suspense, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ErrorState from "./components/error-state";
import FilterChips from "./components/filter-chips";
import useStoreCategoryPage from "./hooks/use-store-category-page";
import { Header } from "@/components/home/Header";
import Search from "./components/Search";
import { BackButton } from "@/components/ui/back-button";

const keyExtractor = (item: Branch) => item.id.toString();
const ItemSeparator = () => <View style={styles.separator} />;

export default function StoreCategoryScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams();
  const page = useStoreCategoryPage(Number(id));
  const router = useRouter();
  const { t } = useTranslation("store_category");

  const renderItem = useCallback(
    ({ item }: { item: Branch }) => (
      <View style={styles.cardWrapper}>
        <BranchCard
          item={item}
          fullWidth
          onPress={() => router.push({ pathname: "/branch/[id]", params: { id: item.id } })}
        />
      </View>
    ),
    [router]
  );

  if (page.error) {
    return <ErrorState message={page.error.message} />;
  }

  const hasSubCategories = (page.storeCategory?.sub_categories?.length ?? 0) > 0;

  const listHeader = (
    <>
      <View style={styles.headerWrapper}>
        <BackButton />
        <Header showCartButton={false} showIcon={false} />
      </View>

      <Search
        value={page.searchQuery}
        onChangeText={page.setSearchQuery}
        onClear={() => page.setSearchQuery('')}
        placeholder={t("list.search_placeholder")}
        style={styles.search}
      />

      <Text style={[styles.pageTitle, { color: colors.foreground }]}>
        {page.pageTitle}
      </Text>

      {page.isCategoryLoading ? (
        <SubCategoriesSkeleton />
      ) : hasSubCategories ? (
        <SubCategoriesList
          subCategories={page.storeCategory!.sub_categories!}
          onPress={page.handleSubCategoryPress}
          activeSubCategory={page.activeSubCategory}
        />
      ) : null}

      {page.isBranchesLoading && <BranchesListSkeleton />}
    </>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={page.branches}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          !page.isBranchesLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="storefront-outline" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                {page.debouncedSearch
                  ? t("list.no_results", { query: page.debouncedSearch })
                  : t("list.no_branches")}
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          page.isFetchingNextPage ? (
            <ActivityIndicator style={styles.loadingMore} size="small" color={colors.primary} />
          ) : null
        }
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={page.handleEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={7}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,

  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  cardWrapper: {
    paddingHorizontal: Spacing.tight,
  },
  separator: {
    height: Spacing.tight,
  },
  search: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    textAlign: 'left',
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing['2xl'],
    gap: Spacing.tight,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  placeholderOpacity: {
    opacity: 0.6,
  },
  loadingMore: {
    paddingVertical: Spacing.md,
  },
});
