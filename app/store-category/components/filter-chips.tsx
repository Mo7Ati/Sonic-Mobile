import { useThemeColors } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Default", value: "default" },
  { label: "Rating", value: "rating" },
  { label: "Delivery time", value: "delivery_time" },
  { label: "Delivery fee", value: "delivery_fee" },
];

const SORT_LABELS: Record<SortOption, string> = {
  default: "Sort by",
  rating: "Rating",
  delivery_time: "Delivery time",
  delivery_fee: "Delivery fee",
};

type ToggleKey = "offers" | "rating4Plus" | "fastDelivery";

const TOGGLE_CHIPS: { key: ToggleKey; label: string }[] = [
  { key: "offers", label: "Offers" },
  { key: "rating4Plus", label: "Rating 4.0+" },
  { key: "fastDelivery", label: "Fast delivery" },
];

interface Props {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function FilterChips({ filters, onFiltersChange }: Props) {
  const colors = useThemeColors();
  const [sortModalVisible, setSortModalVisible] = useState(false);

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
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.chipText,
              { color: sortActive ? colors.primary : colors.foreground },
            ]}
          >
            {SORT_LABELS[filters.sort]}
          </Text>
          <Ionicons
            name="chevron-down"
            size={12}
            color={sortActive ? colors.primary : colors.foreground}
            style={{ marginLeft: 2 }}
          />
        </Pressable>

        {/* Toggle chips */}
        {TOGGLE_CHIPS.map(({ key, label }) => {
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
            style={[styles.modal, { backgroundColor: colors.card }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              Sort by
            </Text>

            {SORT_OPTIONS.map((option) => {
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
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "75%",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    paddingVertical: 8,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
