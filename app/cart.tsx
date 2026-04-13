import { BorderRadius, Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import {
    selectItemsCount,
    selectSubtotal,
    useCartStore,
} from "@/stores/cart-store";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { CartItem as CartItemType } from "@/services/cart/types";

export default function CartScreen() {
    const { colors } = useAppTheme();
    const { t } = useTranslation(["cart", "general"]);
    const router = useRouter();

    const cart = useCartStore((s) => s.cart);
    const isLoading = useCartStore((s) => s.isLoading);
    const itemsCount = useCartStore(selectItemsCount);
    const subtotal = useCartStore(selectSubtotal);
    const clearCart = useCartStore((s) => s.clearCart);

    const handleClear = () => {
        Alert.alert(t("cart:clear_cart"), t("cart:clear_cart_confirm"), [
            { text: t("general:actions.go_back"), style: "cancel" },
            {
                text: t("cart:clear_cart"),
                style: "destructive",
                onPress: () => {
                    clearCart();
                    router.back();
                },
            },
        ]);
    };

    if (isLoading && !cart) {
        return (
            <SafeAreaView
                style={[
                    styles.screen,
                    styles.centered,
                    { backgroundColor: colors.background },
                ]}
            >
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <SafeAreaView
                style={[
                    styles.screen,
                    styles.centered,
                    { backgroundColor: colors.background },
                ]}
            >
                <Ionicons
                    name="cart-outline"
                    size={64}
                    color={colors.mutedForeground}
                />
                <Text
                    style={[styles.emptyTitle, { color: colors.foreground }]}
                >
                    {t("cart:empty_title")}
                </Text>
                <Text
                    style={[
                        styles.emptySubtitle,
                        { color: colors.mutedForeground },
                    ]}
                >
                    {t("cart:empty_subtitle")}
                </Text>
                <Pressable
                    onPress={() => router.back()}
                    style={[
                        styles.startShoppingButton,
                        { backgroundColor: colors.primary },
                    ]}
                >
                    <Text
                        style={[
                            styles.startShoppingText,
                            { color: colors.primaryForeground },
                        ]}
                    >
                        {t("cart:start_shopping")}
                    </Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={[styles.screen, { backgroundColor: colors.background }]}
        >
            {/* Header */}
            <View
                style={[
                    styles.header,
                    { borderBottomColor: colors.border },
                ]}
            >
                <Pressable onPress={() => router.back()} hitSlop={8}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={colors.foreground}
                    />
                </Pressable>
                <View style={styles.headerCenter}>
                    <Text
                        style={[
                            styles.headerTitle,
                            { color: colors.foreground },
                        ]}
                    >
                        {t("cart:title")}
                    </Text>
                    <Text
                        style={[
                            styles.headerSubtitle,
                            { color: colors.mutedForeground },
                        ]}
                    >
                        {cart.branch.name}
                    </Text>
                </View>
                <Pressable onPress={handleClear} hitSlop={8}>
                    <Ionicons
                        name="trash-outline"
                        size={22}
                        color={colors.destructive}
                    />
                </Pressable>
            </View>

            {/* Items */}
            <FlatList
                data={cart.items}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <CartItemRow item={item} branchId={cart.branch.id} />
                )}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => (
                    <View
                        style={[
                            styles.separator,
                            { backgroundColor: colors.border },
                        ]}
                    />
                )}
            />

            {/* Footer */}
            <View
                style={[styles.footer, { borderTopColor: colors.border }]}
            >
                <View style={styles.footerRow}>
                    <Text
                        style={[
                            styles.subtotalLabel,
                            { color: colors.mutedForeground },
                        ]}
                    >
                        {t("cart:subtotal")} ({itemsCount}{" "}
                        {itemsCount === 1
                            ? t("cart:items_count_one")
                            : t("cart:items_count", { count: itemsCount })}
                        )
                    </Text>
                    <Text
                        style={[
                            styles.subtotalValue,
                            { color: colors.foreground },
                        ]}
                    >
                        {subtotal.toFixed(2)} {t("general:currency.egp")}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

function CartItemRow({ item, branchId }: { item: CartItemType; branchId: number }) {
    const { colors } = useAppTheme();
    const { t } = useTranslation(["cart", "general"]);
    const router = useRouter();
    const updateItemQuantity = useCartStore((s) => s.updateItemQuantity);
    const removeItem = useCartStore((s) => s.removeItem);

    const handleDecrement = () => {
        if (item.quantity <= 1) {
            removeItem(item.id);
        } else {
            updateItemQuantity(item.id, item.quantity - 1);
        }
    };

    const handleIncrement = () => {
        updateItemQuantity(item.id, item.quantity + 1);
    };

    const handleEdit = () => {
        router.push({
            pathname: "/product/[id]",
            params: {
                id: item.product_id,
                branchId,
                editCartItemId: item.id,
            },
        });
    };

    return (
        <Pressable onPress={handleEdit} style={[styles.itemRow, { backgroundColor: colors.card }]}>
            {item.image ? (
                <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                    contentFit="cover"
                />
            ) : (
                <View
                    style={[
                        styles.itemImage,
                        styles.itemImagePlaceholder,
                        { backgroundColor: colors.muted },
                    ]}
                >
                    <Ionicons
                        name="fast-food-outline"
                        size={24}
                        color={colors.mutedForeground}
                    />
                </View>
            )}

            <View style={styles.itemDetails}>
                <Text
                    style={[styles.itemName, { color: colors.foreground }]}
                    numberOfLines={2}
                >
                    {item.name}
                </Text>

                {item.options_data && item.options_data.length > 0 && (
                    <Text
                        style={[
                            styles.itemMeta,
                            { color: colors.mutedForeground },
                        ]}
                        numberOfLines={1}
                    >
                        {item.options_data
                            .map((o) => o.item_name)
                            .join(", ")}
                    </Text>
                )}

                {item.additions_data && item.additions_data.length > 0 && (
                    <Text
                        style={[
                            styles.itemMeta,
                            { color: colors.mutedForeground },
                        ]}
                        numberOfLines={1}
                    >
                        +{" "}
                        {item.additions_data.map((a) => a.name).join(", ")}
                    </Text>
                )}

                <View style={styles.itemFooter}>
                    <Text
                        style={[
                            styles.itemPrice,
                            { color: colors.foreground },
                        ]}
                    >
                        {item.total_price.toFixed(2)}{" "}
                        {t("general:currency.egp")}
                    </Text>

                    <View style={styles.quantityStepper}>
                        <Pressable
                            onPress={handleDecrement}
                            style={[
                                styles.stepperButton,
                                { backgroundColor: colors.muted },
                            ]}
                            hitSlop={4}
                        >
                            <Ionicons
                                name={
                                    item.quantity <= 1
                                        ? "trash-outline"
                                        : "remove"
                                }
                                size={16}
                                color={
                                    item.quantity <= 1
                                        ? colors.destructive
                                        : colors.mutedForeground
                                }
                            />
                        </Pressable>
                        <Text
                            style={[
                                styles.quantityText,
                                { color: colors.foreground },
                            ]}
                        >
                            {item.quantity}
                        </Text>
                        <Pressable
                            onPress={handleIncrement}
                            style={[
                                styles.stepperButton,
                                { backgroundColor: colors.primary },
                            ]}
                            hitSlop={4}
                        >
                            <Ionicons
                                name="add"
                                size={16}
                                color={colors.primaryForeground}
                            />
                        </Pressable>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    centered: {
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.tight,
        paddingHorizontal: Spacing.gutter,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: Spacing.md,
    },
    emptySubtitle: {
        fontSize: 14,
        fontWeight: "400",
        textAlign: "center",
    },
    startShoppingButton: {
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.xl,
    },
    startShoppingText: {
        fontSize: 15,
        fontWeight: "700",
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.tight,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerCenter: {
        flex: 1,
        marginHorizontal: Spacing.md,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    headerSubtitle: {
        fontSize: 13,
        fontWeight: "400",
    },

    // List
    listContent: {
        paddingVertical: Spacing.sm,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginHorizontal: Spacing.gutter,
    },

    // Item row
    itemRow: {
        flexDirection: "row",
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.tight,
        gap: Spacing.tight,
    },
    itemImage: {
        width: 72,
        height: 72,
        borderRadius: BorderRadius.lg,
    },
    itemImagePlaceholder: {
        alignItems: "center",
        justifyContent: "center",
    },
    itemDetails: {
        flex: 1,
        justifyContent: "center",
    },
    itemName: {
        fontSize: 15,
        fontWeight: "600",
    },
    itemMeta: {
        fontSize: 12,
        fontWeight: "400",
        marginTop: 2,
    },
    itemFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: Spacing.sm,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: "700",
    },
    quantityStepper: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
    },
    stepperButton: {
        width: 28,
        height: 28,
        borderRadius: BorderRadius.full,
        alignItems: "center",
        justifyContent: "center",
    },
    quantityText: {
        fontSize: 15,
        fontWeight: "700",
        minWidth: 20,
        textAlign: "center",
    },

    // Footer
    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.md,
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    subtotalLabel: {
        fontSize: 15,
        fontWeight: "500",
    },
    subtotalValue: {
        fontSize: 18,
        fontWeight: "800",
    },
});
