import { SearchSection } from "@/components/home/SearchSection";
import SubCategoriesList from "@/components/store-categories/sub-categories-list";
import SubCategoriesSkeleton from "@/components/store-categories/sub-categories-skeleton";
import { useBranches } from "@/hooks/react-query-hooks/use-branches-queries";
import { useStoreCategoryById } from "@/hooks/react-query-hooks/use-store-category";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { useThemeColors } from "@/hooks/use-theme-color";
import { Text } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BranchesSection from "./components/branches-section";
import ErrorState from "./components/error-state";
import FilterChips from "./components/filter-chips";
import Header from "./components/header";
import { StoreCategory } from "@/services/store-categories/types";

export default function StoreCategoryScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams();
  const storeCategoryId = Number(id);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery);
  const [activeSubCategory, setActiveSubCategory] = useState<StoreCategory | null>(null);

  const { data: storeCategory, isPending: isCategoryPending, error: storeCategoryError } = useStoreCategoryById(storeCategoryId);

  const activeCategoryId = activeSubCategory?.id ?? storeCategoryId;
  const { data: branches, isFetching, error: branchesError, isPlaceholderData } = useBranches(activeCategoryId, debouncedSearch || undefined);

  const handleSubCategoryPress = useCallback((sub: StoreCategory) => {
    setActiveSubCategory(prev => (prev?.id === sub.id ? null : sub));
  }, []);

  if (storeCategoryError || branchesError) {
    return <ErrorState message={storeCategoryError?.message ?? branchesError?.message} />;
  }

  const hasSubCategories = (storeCategory?.sub_categories?.length ?? 0) > 0;
  const pageTitle = activeSubCategory?.name ?? storeCategory?.name;


  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <SearchSection
          placeholder="Search branches..."
          editable
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <Text style={[styles.pageTitle, { color: colors.foreground }]}>{pageTitle}</Text>

        {isCategoryPending ? (
          <SubCategoriesSkeleton />
        ) : hasSubCategories ? (
          <SubCategoriesList
            subCategories={storeCategory!.sub_categories!}
            onPress={handleSubCategoryPress}
            activeSubCategory={activeSubCategory}
          />
        ) : null}

        <FilterChips />

        <BranchesSection
          branches={branches}
          isLoading={isFetching && !isPlaceholderData}
          isPlaceholderData={isPlaceholderData}
          searchQuery={debouncedSearch}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
});
