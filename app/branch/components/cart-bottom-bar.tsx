import { useAppTheme } from "@/hooks/use-app-theme";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Text } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CartBottomBarProps {
    minimumOrder?: number;
}

export default function CartBottomBar({ minimumOrder = 60 }: CartBottomBarProps) {
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation("branch");

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    paddingBottom: Math.max(insets.bottom, 12),
                },
            ]}
        >
            <Text style={[styles.text, { color: colors.mutedForeground }]}>
                {t("cart_bottom_bar.minimum_hint", { amount: minimumOrder.toFixed(2) })}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 14,
        paddingHorizontal: 20,
        borderTopWidth: StyleSheet.hairlineWidth,
        alignItems: "center",
    },
    text: {
        fontSize: 14,
        fontWeight: "500",
    },
});
