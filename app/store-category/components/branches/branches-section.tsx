import BranchesList from "@/app/branch/components/branches-list";
import BranchesListSkeleton from "@/app/branch/components/branches-list-skeleton";
import { Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { type Branch } from "@/services/branch/types";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
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
  const { colors } = useAppTheme();
  const { t } = useTranslation("store_category");
  const hasBranches = (branches?.length ?? 0) > 0;

  if (isLoading) {
    return (
      <View style={{ paddingHorizontal: Spacing.gutter }}>
        <BranchesListSkeleton />
      </View>
    );
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
          ? t("list.no_results", { query: searchQuery })
          : t("list.no_branches")}
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
