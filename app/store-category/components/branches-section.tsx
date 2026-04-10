import BranchesList from "@/components/branches/branches-list";
import BranchesListSkeleton from "@/components/branches/branches-list-skeleton";
import { useThemeColors } from "@/hooks/use-theme-color";
import { type Branch } from "@/hooks/react-query-hooks/use-branches-queries";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { StyleSheet, View } from "react-native";

interface BranchesSectionProps {
  branches: Branch[] | undefined;
  isLoading: boolean;
  isPlaceholderData: boolean;
  searchQuery: string;
}

export default function BranchesSection({
  branches,
  isLoading,
  isPlaceholderData,
  searchQuery,
}: BranchesSectionProps) {
  const colors = useThemeColors();
  const hasBranches = (branches?.length ?? 0) > 0;

  if (isLoading) {
    return <BranchesListSkeleton />;
  }

  if (hasBranches) {
    return (
      <View style={isPlaceholderData && styles.placeholderOpacity}>
        <BranchesList branches={branches ?? []} horizontal={false} />
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="storefront-outline" size={48} color={colors.mutedForeground} />
      <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
        {searchQuery
          ? `No results for "${searchQuery}"`
          : "No branches available"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholderOpacity: {
    opacity: 0.6,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});
