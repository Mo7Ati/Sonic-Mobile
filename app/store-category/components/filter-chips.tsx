import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export type SortOption = "default" | "rating" | "delivery_time" | "delivery_fee";

export interface Filters {
  sort: SortOption;
  offers: boolean;
  rating4Plus: boolean;
  fastDelivery: boolean;
}

export const DEFAULT_FILTERS: Filters = {
  sort: "default",
  offers: false,
  rating4Plus: false,
  fastDelivery: false,
};

type ToggleKey = "offers" | "rating4Plus" | "fastDelivery";

interface Props {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function FilterChips({ filters, onFiltersChange }: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("store_category");
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const sortOptions = useMemo(
    () =>
      [
        { label: t("filter_chips.sort_default"), value: "default" as const },
        { label: t("filter_chips.sort_rating"), value: "rating" as const },
        { label: t("filter_chips.sort_delivery_time"), value: "delivery_time" as const },
        { label: t("filter_chips.sort_delivery_fee"), value: "delivery_fee" as const },
      ] satisfies { label: string; value: SortOption }[],
    [t],
  );

  const sortChipLabels = useMemo(
    (): Record<SortOption, string> => ({
      default: t("filter_chips.sort_by"),
      rating: t("filter_chips.sort_rating"),
      delivery_time: t("filter_chips.sort_delivery_time"),
      delivery_fee: t("filter_chips.sort_delivery_fee"),
    }),
    [t],
  );

  const toggleChips = useMemo(
    () =>
      [
        { key: "offers" as const, label: t("filter_chips.toggle_offers") },
        { key: "rating4Plus" as const, label: t("filter_chips.toggle_rating") },
        { key: "fastDelivery" as const, label: t("filter_chips.toggle_fast") },
      ] satisfies { key: ToggleKey; label: string }[],
    [t],
  );

  const sortActive = filters.sort !== "default";

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {/* Sort chip */}
        <Pressable
          onPress={() => setSortModalVisible(true)}
          style={[
            styles.chip,
            sortActive
              ? { borderColor: colors.primary, backgroundColor: colors.primary + "20" }
              : { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Ionicons
            name="swap-vertical"
            size={14}
            color={sortActive ? colors.primary : colors.foreground}
            style={{ marginEnd: Spacing.xs }}
          />
          <Text
            style={[
              styles.chipText,
              { color: sortActive ? colors.primary : colors.foreground },
            ]}
          >
            {sortChipLabels[filters.sort]}
          </Text>
          <Ionicons
            name="chevron-down"
            size={12}
            color={sortActive ? colors.primary : colors.foreground}
            style={{ marginStart: 2 }}
          />
        </Pressable>

        {/* Toggle chips */}
        {toggleChips.map(({ key, label }) => {
          const active = filters[key];
          return (
            <Pressable
              key={key}
              onPress={() =>
                onFiltersChange({ ...filters, [key]: !filters[key] })
              }
              style={[
                styles.chip,
                active
                  ? { borderColor: colors.primary, backgroundColor: colors.primary + "20" }
                  : { borderColor: colors.border, backgroundColor: colors.card },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? colors.primary : colors.foreground },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setSortModalVisible(false)}>
          <View
            style={[
              styles.modal,
              { backgroundColor: colors.card, shadowColor: colors.shadow },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              {t("filter_chips.modal_title")}
            </Text>

            {sortOptions.map((option) => {
              const selected = filters.sort === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onFiltersChange({ ...filters, sort: option.value });
                    setSortModalVisible(false);
                  }}
                  style={[styles.sortOption, { borderBottomColor: colors.border }]}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      { color: selected ? colors.primary : colors.foreground },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selected && (
                    <Ionicons name="checkmark" size={18} color={colors.primary} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: Spacing.gutter,
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.modalOverlay,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "75%",
    borderRadius: BorderRadius["2xl"],
    paddingVertical: Spacing.tight,
    paddingHorizontal: Spacing.gutter,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
