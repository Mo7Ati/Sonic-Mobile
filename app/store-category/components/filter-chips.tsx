import { useThemeColors } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { Pressable, ScrollView, StyleSheet } from "react-native";

const CHIPS = ["Sort by", "Offers", "Rating 4.0+", "Fast delivery"];

export default function FilterChips() {
  const colors = useThemeColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {CHIPS.map((chip, index) => (
        <Pressable
          key={chip}
          style={[styles.chip, { borderColor: colors.border, backgroundColor: colors.card }]}
        >
          {index === 0 && (
            <Ionicons name="swap-vertical" size={14} color={colors.foreground} style={{ marginRight: 4 }} />
          )}
          <Text style={[styles.chipText, { color: colors.foreground }]}>{chip}</Text>
          {index === 0 && (
            <Ionicons name="chevron-down" size={12} color={colors.foreground} style={{ marginLeft: 2 }} />
          )}
        </Pressable>
      ))}
    </ScrollView>
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
});
