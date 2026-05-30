import { useBranches } from "@/hooks/react-query-hooks/use-branches-queries";
import { useStoreCategoryById } from "@/hooks/react-query-hooks/use-store-category";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { BranchFilters } from "@/services/branch/branch-service";
import { StoreCategory } from "@/services/store-categories/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_FILTERS, Filters } from "../components/filter-chips";


function buildBranchFilters(
  storeCategoryId: number,
  search: string | undefined,
  filters: Filters
): BranchFilters {
  return {
    store_category_id: storeCategoryId,
    search: search,
    sort_by: filters.sort !== "default" ? filters.sort : undefined,
  };
}

export default function useStoreCategoryPage(storeCategoryId: number) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 1500);

  const [activeSubCategory, setActiveSubCategory] = useState<StoreCategory | null>(null);

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);


  const {
    data: storeCategory,
    isPending: isCategoryPending,
    isRefetching: isCategoryRefetching,
    error: storeCategoryError,
  } = useStoreCategoryById(storeCategoryId);

  const isCategoryLoading = isCategoryPending || isCategoryRefetching;

  const activeCategoryId = activeSubCategory?.id ?? storeCategoryId;

  const branchFilters = useMemo(
    () => buildBranchFilters(activeCategoryId, debouncedSearch, filters),
    [activeCategoryId, debouncedSearch, filters]
  );

  const {
    data,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error: branchesError,
    fetchNextPage,
  } = useBranches(branchFilters);

  const isBranchesLoading = isFetching && !isFetchingNextPage;

  const branches = useMemo(() => {
    if (isBranchesLoading) {
      return [];
    }

    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data, isBranchesLoading]);

  // useEffect(() => {
  //   setActiveSubCategory(null);
  //   setSearchQuery("");
  //   setFilters(DEFAULT_FILTERS);
  // }, [storeCategoryId]);

  const handleSubCategoryPress = useCallback((sub: StoreCategory) => {
    setActiveSubCategory((prev) => (prev?.id === sub.id ? null : sub));
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  return {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    filters,
    setFilters,
    storeCategory,
    isCategoryLoading,
    activeSubCategory,
    handleSubCategoryPress,
    branches,
    isBranchesLoading,
    isFetchingNextPage,
    handleEndReached,
    error: storeCategoryError || branchesError,
    pageTitle: activeSubCategory?.name ?? storeCategory?.name,
  };
}
