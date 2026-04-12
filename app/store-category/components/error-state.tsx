import { BorderRadius, Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation("general");

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t("errors.something_went_wrong")}
        </Text>
        <Text style={[styles.message, { color: colors.mutedForeground }]}>
          {message ?? t("errors.failed_to_load_data")}
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
            {t("actions.go_back")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.tight,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: Spacing.xs,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.tight,
    borderRadius: BorderRadius.xl,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
