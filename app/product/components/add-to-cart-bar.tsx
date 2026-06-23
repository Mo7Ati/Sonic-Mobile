import { BorderRadius, Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { formatAmount } from "@/lib/utils.";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AddToCartBarProps {
    totalPrice: number;
    quantity: number;
    allOptionsSelected: boolean;
    isEditing?: boolean;
    onIncrement: () => void;
    onDecrement: () => void;
    onAddToCart: () => void;
}

export default function AddToCartBar({
    totalPrice,
    quantity,
    allOptionsSelected,
    isEditing,
    onIncrement,
    onDecrement,
    onAddToCart,
}: AddToCartBarProps) {
    const { colors } = useAppTheme();
    const { t } = useTranslation(["product", "cart"]);
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    paddingBottom: Math.max(insets.bottom, Spacing.md),
                },
            ]}
        >
            {!allOptionsSelected && (
                <Text style={[styles.hint, { color: colors.mutedForeground }]}>
                    {t("product:complete_selections")}
                </Text>
            )}

            <View style={styles.row}>
                <Pressable
                    onPress={onAddToCart}
                    disabled={!allOptionsSelected}
                    style={[
                        styles.addButton,
                        {
                            backgroundColor: allOptionsSelected
                                ? colors.primary
                                : colors.muted,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.addButtonText,
                            {
                                color: allOptionsSelected
                                    ? colors.primaryForeground
                                    : colors.mutedForeground,
                            },
                        ]}
                    >
                        {isEditing ? t("cart:update_item") : t("product:add_to_cart")}{"  "}
                        {formatAmount(totalPrice)}
                    </Text>
                </Pressable>

                <View style={styles.quantityContainer}>
                    <Pressable
                        onPress={onDecrement}
                        style={[styles.qtyButton, { backgroundColor: colors.muted }]}
                        hitSlop={4}
                    >
                        <Ionicons name="remove" size={20} color={colors.mutedForeground} />
                    </Pressable>
                    <Text style={[styles.qtyText, { color: colors.foreground }]}>
                        {quantity}
                    </Text>
                    <Pressable
                        onPress={onIncrement}
                        style={[styles.qtyButton, { backgroundColor: colors.primary }]}
                        hitSlop={4}
                    >
                        <Ionicons name="add" size={20} color={colors.primaryForeground} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingTop: Spacing.tight,
        paddingHorizontal: Spacing.gutter,
    },
    hint: {
        fontSize: 13,
        fontWeight: "400",
        textAlign: "center",
        marginBottom: Spacing.sm,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.md,
    },
    addButton: {
        flex: 1,
        height: 48,
        borderRadius: BorderRadius.xl,
        alignItems: "center",
        justifyContent: "center",
    },
    addButtonText: {
        fontSize: 15,
        fontWeight: "700",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.tight,
    },
    qtyButton: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.full,
        alignItems: "center",
        justifyContent: "center",
    },
    qtyText: {
        fontSize: 18,
        fontWeight: "700",
        minWidth: 24,
        textAlign: "center",
    },
});
