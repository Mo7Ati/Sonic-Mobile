import { useThemeColors } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";

export default function Header() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => router.back()}
        style={[styles.iconBtn, { borderColor: colors.border }]}
        hitSlop={8}
      >
        <Ionicons name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"} size={20} color={colors.foreground} />
      </Pressable>

      <View style={styles.center}>
        <Text style={[styles.deliverLabel, { color: colors.mutedForeground }]}>
          Deliver to{" "}
          <Text style={[styles.address, { color: colors.foreground }]} numberOfLines={1}>
            Nasr City - Mostafa El N...
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    marginHorizontal: 12,
  },
  deliverLabel: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: 'left',
  },
  address: {
    fontSize: 14,
    fontWeight: "700",
  },
});
