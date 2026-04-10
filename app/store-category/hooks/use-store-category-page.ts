import { useBranches } from "@/hooks/react-query-hooks/use-branches-queries";
import { useStoreCategoryById } from "@/hooks/react-query-hooks/use-store-category";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { BranchFilters } from "@/services/branch";
import { StoreCategory } from "@/services/store-categories/types";
import { useCallback, useMemo, useState } from "react";
import { DEFAULT_FILTERS, Filters } from "../components/filter-chips";

function buildBranchFilters(
  storeCategoryId: number,
  search: string | undefined,
  filters: Filters
): BranchFilters {
  return {
    store_category_id: storeCategoryId,
    search: search || undefined,
    sort_by: filters.sort !== "default" ? filters.sort : undefined,
    offers: filters.offers || undefined,
    rating_4_plus: filters.rating4Plus || undefined,
    fast_delivery: filters.fastDelivery || undefined,
  };
}

export function useStoreCategoryPage(storeCategoryId: number) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery);
  const [activeSubCategory, setActiveSubCategory] = useState<StoreCategory | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const {
    data: storeCategory,
    isPending: isCategoryPending,
    error: storeCategoryError,
  } = useStoreCategoryById(storeCategoryId);

  const activeCategoryId = activeSubCategory?.id ?? storeCategoryId;

  const branchFilters = useMemo(
    () => buildBranchFilters(activeCategoryId, debouncedSearch, filters),
    [activeCategoryId, debouncedSearch, filters]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isPending: isBranchesPending,
    isPlaceholderData,
    error: branchesError,
  } = useBranches(branchFilters);

  const branches = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const handleSubCategoryPress = useCallback((sub: StoreCategory) => {
    setActiveSubCategory((prev) => (prev?.id === sub.id ? null : sub));
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isInitialLoading =
    isBranchesPending || (isFetching && !isPlaceholderData && !isFetchingNextPage);

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    filters,
    setFilters,
    storeCategory,
    isCategoryPending,
    activeSubCategory,
    handleSubCategoryPress,
    branches,
    isInitialLoading,
    isPlaceholderData,
    isFetchingNextPage,
    handleEndReached,
    error: storeCategoryError || branchesError,
    pageTitle: activeSubCategory?.name ?? storeCategory?.name,
  };
}
