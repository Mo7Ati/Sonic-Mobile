import { BorderRadius, Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";

export default function Header() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => router.back()}
        style={[styles.iconBtn, { borderColor: colors.border }]}
        hitSlop={Spacing.sm}
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + Spacing.xs,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    marginHorizontal: Spacing.tight,
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
