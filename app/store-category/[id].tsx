import BranchesList from "@/components/branches/branches-list";
import BranchesListSkeleton from "@/components/branches/branches-list-skeleton";
import { SearchSection } from "@/components/home/SearchSection";
import SubCategoriesList from "@/components/store-categories/sub-categories-list";
import { useBranches } from "@/hooks/react-query-hooks/use-branches-queries";
import { useStoreCategoryById } from "@/hooks/react-query-hooks/use-store-category";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { useThemeColors } from "@/hooks/use-theme-color";
import { type StoreCategory } from "@/services/store-category";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTER_CHIPS = ["Sort by", "Offers", "Rating 4.0+", "Fast delivery"];

export default function StoreCategoryScreen() {
  const { id: categoryId } = useLocalSearchParams();
  const id = Number(categoryId);
  const { data, isPending, error } = useStoreCategoryById(id);
  const [activeSubCategory, setActiveSubCategory] = useState<StoreCategory | null>(null);
  const activeCategoryId = activeSubCategory?.id ?? id;
  const { data: branches, isFetching: isFetchingBranches } = useBranches(activeCategoryId);
  const colors = useThemeColors();
  const router = useRouter();

  if (isPending) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.destructive, textAlign: "center", marginTop: 40 }}>
          Error: {error.message}
        </Text>
      </SafeAreaView>
    );
  }

  const category = data.category;
  const displayedBranches = branches ?? [];


  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.headerIconBtn, { borderColor: colors.border }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerDeliverLabel, { color: colors.mutedForeground }]}>
            Deliver to{" "}
            <Text style={[styles.headerAddress, { color: colors.foreground }]} numberOfLines={1}>
              Nasr City - Mostafa El N...
            </Text>
          </Text>
        </View>

        {/* <Pressable style={[styles.headerIconBtn, { borderColor: colors.border }]}>
          <Ionicons name="heart-outline" size={20} color={colors.foreground} />
        </Pressable> */}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search bar */}
        <SearchSection placeholder="Search branches..." editable={true} />


        {/* Title */}
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>
          {activeSubCategory?.name ?? "All restaurants"}
        </Text>

        {/* Sub-categories horizontal list */}
        {(category.sub_categories?.length ?? 0) > 0 && (
          <SubCategoriesList
            subCategories={category.sub_categories ?? []}
            onPress={(sub) => setActiveSubCategory(prev => prev?.id === sub.id ? null : sub)}
            activeSubCategory={activeSubCategory}
          />
        )}

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTER_CHIPS.map((chip, index) => (
            <Pressable
              key={chip}
              style={[styles.filterChip, { borderColor: colors.border, backgroundColor: colors.card }]}
            >
              {index === 0 && (
                <Ionicons name="swap-vertical" size={14} color={colors.foreground} style={{ marginRight: 4 }} />
              )}
              <Text style={[styles.filterChipText, { color: colors.foreground }]}>{chip}</Text>
              {index === 0 && (
                <Ionicons name="chevron-down" size={12} color={colors.foreground} style={{ marginLeft: 2 }} />
              )}
            </Pressable>
          ))}
        </ScrollView>

        {/* Branches list */}
        {isFetchingBranches ? (
          <BranchesListSkeleton />
        ) : (
          <View>
            <BranchesList branches={displayedBranches} horizontal={false} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerDeliverLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  headerAddress: {
    fontSize: 14,
    fontWeight: "700",
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
  filtersRow: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 16,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
