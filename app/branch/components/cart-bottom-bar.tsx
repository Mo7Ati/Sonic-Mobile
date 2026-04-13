import { BorderRadius, Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import {
    selectCartBranchId,
    selectItemsCount,
    selectSubtotal,
    useCartStore,
} from "@/stores/cart-store";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CartBottomBarProps {
    branchId: number;
}

export default function CartBottomBar({ branchId }: CartBottomBarProps) {
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation(["cart", "general"]);
    const router = useRouter();

    const cartBranchId = useCartStore(selectCartBranchId);
    const itemsCount = useCartStore(selectItemsCount);
    const subtotal = useCartStore(selectSubtotal);

    if (cartBranchId !== branchId || itemsCount === 0) return null;

    return (
        <Pressable
            onPress={() => router.push("/cart")}
            style={[
                styles.container,
                {
                    backgroundColor: colors.primary,
                    paddingBottom: Math.max(insets.bottom, Spacing.tight),
                },
            ]}
        >
            <View style={styles.row}>
                <View style={styles.left}>
                    <View style={[styles.badge, { backgroundColor: colors.primaryForeground }]}>
                        <Text style={[styles.badgeText, { color: colors.primary }]}>
                            {itemsCount}
                        </Text>
                    </View>
                    <Text style={[styles.label, { color: colors.primaryForeground }]}>
                        {t("cart:view_cart")}
                    </Text>
                </View>
                <Text style={[styles.price, { color: colors.primaryForeground }]}>
                    {subtotal.toFixed(2)} {t("general:currency.egp")}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Spacing.tight,
        paddingHorizontal: Spacing.gutter,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
    },
    badge: {
        width: 24,
        height: 24,
        borderRadius: BorderRadius.full,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "800",
    },
    label: {
        fontSize: 15,
        fontWeight: "700",
    },
    price: {
        fontSize: 15,
        fontWeight: "700",
    },
});
