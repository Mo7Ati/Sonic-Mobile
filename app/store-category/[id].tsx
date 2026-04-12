import BranchCard from "@/components/branches/branch-card";
import BranchesListSkeleton from "@/components/branches/branches-list-skeleton";
import { SearchSection } from "@/components/home/SearchSection";
import SubCategoriesList from "@/components/store-categories/sub-categories-list";
import SubCategoriesSkeleton from "@/components/store-categories/sub-categories-skeleton";
import { Branch } from "@/services/branch/types";
import { Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ErrorState from "./components/error-state";
import FilterChips from "./components/filter-chips";
import Header from "./components/header";
import { useStoreCategoryPage } from "./hooks/use-store-category-page";

export default function StoreCategoryScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams();
  const page = useStoreCategoryPage(Number(id));
  const router = useRouter();

  const renderItem = useCallback(
    ({ item }: { item: Branch }) => (
      <BranchCard
        item={item}
        fullWidth
        onPress={() => router.push({ pathname: "/branch/[id]", params: { id: item.id } })}
      />
    ),
    [router]
  );

  if (page.error) {
    return <ErrorState message={page.error.message} />;
  }

  const hasSubCategories = (page.storeCategory?.sub_categories?.length ?? 0) > 0;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <Header />

      <FlatList
        data={page.isInitialLoading ? [] : page.branches}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <SearchSection
              placeholder="البحث عن فروع..."
              editable
              value={page.searchQuery}
              onChangeText={page.setSearchQuery}
            />
            <Text style={[styles.pageTitle, { color: colors.foreground }]}>
              {page.pageTitle}
            </Text>
            {page.isCategoryPending ? (
              <SubCategoriesSkeleton />
            ) : hasSubCategories ? (
              <SubCategoriesList
                subCategories={page.storeCategory!.sub_categories!}
                onPress={page.handleSubCategoryPress}
                activeSubCategory={page.activeSubCategory}
              />
            ) : null}
            <FilterChips filters={page.filters} onFiltersChange={page.setFilters} />
            {page.isInitialLoading && <BranchesListSkeleton />}
          </>
        }
        ListEmptyComponent={
          !page.isInitialLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="storefront-outline" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                {page.debouncedSearch
                  ? `No results for "${page.debouncedSearch}"`
                  : "No branches available"}
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          page.isFetchingNextPage ? (
            <ActivityIndicator style={styles.loadingMore} size="small" color={colors.primary} />
          ) : null
        }
        ItemSeparatorComponent={() => <View style={{ height: Spacing.tight }} />}
        contentContainerStyle={styles.scrollContent}
        style={page.isPlaceholderData ? styles.placeholderOpacity : undefined}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={page.handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.gutter,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
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
