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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    FlatList,
    I18nManager,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { CartItem as CartItemType } from "@/services/cart/types";

export default function CartScreen() {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation(["cart", "general"]);
    const router = useRouter();

    const cart = useCartStore((s) => s.cart);
    const isLoading = useCartStore((s) => s.isLoading);
    const itemsCount = useCartStore(selectItemsCount);
    const subtotal = useCartStore(selectSubtotal);
    const [notes, setNotes] = useState("");

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
                    style={[
                        styles.emptyTitle,
                        { color: colors.foreground, fontFamily: font.bold },
                    ]}
                >
                    {t("cart:empty_title")}
                </Text>
                <Text
                    style={[
                        styles.emptySubtitle,
                        { color: colors.mutedForeground, fontFamily: font.regular },
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
                            { color: colors.primaryForeground, fontFamily: font.bold },
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
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    hitSlop={8}
                    style={[styles.backButton, { borderColor: colors.border }]}
                >
                    <Ionicons
                        name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
                        size={20}
                        color={colors.foreground}
                    />
                </Pressable>
                <View style={styles.headerCenter}>
                    <Text
                        style={[
                            styles.headerTitle,
                            { color: colors.foreground, fontFamily: font.bold },
                        ]}
                    >
                        {t("cart:title")}
                    </Text>
                    <Text
                        style={[
                            styles.headerSubtitle,
                            { color: colors.mutedForeground, fontFamily: font.regular },
                        ]}
                    >
                        {cart.branch.name}
                    </Text>
                </View>
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
                ListFooterComponent={
                    <>
                        <View
                            style={[
                                styles.separator,
                                { backgroundColor: colors.border },
                            ]}
                        />
                        {/* Notes Input */}
                        <View style={styles.notesSection}>
                            <Text
                                style={[
                                    styles.notesLabel,
                                    { color: colors.foreground, fontFamily: font.semiBold },
                                ]}
                            >
                                {t("cart:notes")}
                            </Text>
                            <TextInput
                                style={[
                                    styles.notesInput,
                                    {
                                        color: colors.foreground,
                                        backgroundColor: colors.muted,
                                        borderColor: colors.border,
                                        fontFamily: font.regular,
                                    },
                                ]}
                                placeholder={t("cart:notes_placeholder")}
                                placeholderTextColor={colors.placeholder}
                                value={notes}
                                onChangeText={setNotes}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                textAlign="right"
                            />
                        </View>
                    </>
                }
            />

            {/* Footer */}
            <View
                style={[styles.footer, { borderTopColor: colors.border }]}
            >
                {/* Subtotal */}
                <View style={styles.footerRow}>
                    <Text
                        style={[
                            styles.subtotalValue,
                            { color: colors.foreground, fontFamily: font.bold },
                        ]}
                    >
                        {subtotal.toFixed(2)} {t("general:currency.egp")}
                    </Text>
                    <Text
                        style={[
                            styles.subtotalLabel,
                            { color: colors.mutedForeground, fontFamily: font.medium },
                        ]}
                    >
                        {t("cart:subtotal")} ({itemsCount}{" "}
                        {itemsCount === 1
                            ? t("cart:items_count_one")
                            : t("cart:items_count", { count: itemsCount })}
                        )
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonsRow}>
                    <Pressable
                        onPress={() => {
                            
                        }}
                        style={[
                            styles.checkoutButton,
                            { backgroundColor: colors.primary },
                        ]}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                { color: colors.primaryForeground, fontFamily: font.bold },
                            ]}
                        >
                            {t("cart:go_to_checkout")}
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push({
                            pathname: "/branch/[id]",
                            params: {
                                id: String(cart.branch.id),
                            },
                        })}
                        hitSlop={8}
                        style={[
                            styles.addMoreButton,
                            { backgroundColor: colors.foreground },
                        ]}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                { color: colors.background, fontFamily: font.bold },
                            ]}
                        >
                            {t("cart:add_more_items")}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

function CartItemRow({
    item,
    branchId,
}: {
    item: CartItemType;
    branchId: number;
}) {
    const { colors, font } = useAppTheme();
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

    const hasDiscount =
        item.compare_price != null &&
        item.compare_price > 0 &&
        item.compare_price > item.unit_price;

    const optionsText = item.options_data
        ?.map((o) => o.item_name)
        .join(", ");
    const additionsText = item.additions_data
        ?.map((a) => a.name)
        .join(", ");
    const descriptionParts = [optionsText, additionsText].filter(Boolean);
    const description = descriptionParts.join(", ");

    return (
        <View style={styles.itemRow}>
            {/* Content side */}
            <View style={styles.itemContent}>
                {/* Name */}
                <Text
                    style={[
                        styles.itemName,
                        { color: colors.foreground, fontFamily: font.semiBold },
                    ]}
                    numberOfLines={2}
                >
                    {item.name}
                </Text>

                {/* Description (options + additions) */}
                {description ? (
                    <Text
                        style={[
                            styles.itemDescription,
                            { color: colors.mutedForeground, fontFamily: font.regular },
                        ]}
                        numberOfLines={2}
                    >
                        {item.quantity > 1 ? `${item.quantity}x ` : ""}
                        {description}
                    </Text>
                ) : null}

                {/* Edit link */}
                <Pressable onPress={handleEdit} hitSlop={6}>
                    <Text
                        style={[
                            styles.editLink,
                            { color: colors.link, fontFamily: font.medium },
                        ]}
                    >
                        {t("cart:edit")}
                    </Text>
                </Pressable>

                {/* Prices */}
                <View style={styles.priceRow}>
                    {hasDiscount && (
                        <Text
                            style={[
                                styles.comparePrice,
                                { color: colors.mutedForeground, fontFamily: font.regular },
                            ]}
                        >
                            {(item.compare_price! * item.quantity).toFixed(2)}
                        </Text>
                    )}
                    <Text
                        style={[
                            styles.itemPrice,
                            hasDiscount
                                ? { color: colors.primary, fontFamily: font.bold }
                                : { color: colors.foreground, fontFamily: font.bold },
                        ]}
                    >
                        {item.total_price.toFixed(2)}{" "}
                        {t("general:currency.egp")}
                    </Text>
                </View>
            </View>

            {/* Image + Stepper side */}
            <View style={styles.itemImageColumn}>
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
                            size={28}
                            color={colors.mutedForeground}
                        />
                    </View>
                )}

                {/* Quantity stepper */}
                <View style={styles.quantityStepper}>
                    <Pressable
                        onPress={handleIncrement}
                        style={[
                            styles.stepperButton,
                            { backgroundColor: colors.muted },
                        ]}
                        hitSlop={4}
                    >
                        <Ionicons
                            name="add"
                            size={16}
                            color={colors.foreground}
                        />
                    </Pressable>
                    <Text
                        style={[
                            styles.quantityText,
                            { color: colors.foreground, fontFamily: font.bold },
                        ]}
                    >
                        {item.quantity}
                    </Text>
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
                                    : colors.foreground
                            }
                        />
                    </Pressable>
                </View>
            </View>
        </View>
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
        marginTop: Spacing.md,
    },
    emptySubtitle: {
        fontSize: 14,
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
    },

    // Header
    backButton: {
        width: 38,
        height: 38,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.tight,
        justifyContent: "space-between",
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.tight,
    },
    headerCenter: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        textAlign: "left",
    },
    headerSubtitle: {
        fontSize: 13,
        textAlign: "left",
        marginTop: 2,
    },

    // List
    listContent: {
        paddingBottom: Spacing.md,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginHorizontal: Spacing.gutter,
    },

    // Item row
    itemRow: {
        flexDirection: "row",
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.md,
        gap: Spacing.tight,
    },
    itemContent: {
        flex: 1,
        justifyContent: "flex-start",
    },
    itemName: {
        fontSize: 15,
        textAlign: "left",
        lineHeight: 22,
    },
    itemDescription: {
        fontSize: 12,
        textAlign: "left",
        marginTop: 4,
        lineHeight: 18,
    },
    editLink: {
        fontSize: 13,
        marginTop: 6,
        textAlign: "left",
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
        marginTop: Spacing.sm,
    },
    comparePrice: {
        fontSize: 13,
        textDecorationLine: "line-through",
    },
    itemPrice: {
        fontSize: 15,
    },

    // Image + stepper column
    itemImageColumn: {
        alignItems: "center",
        gap: Spacing.sm,
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: BorderRadius.xl,
    },
    itemImagePlaceholder: {
        alignItems: "center",
        justifyContent: "center",
    },
    quantityStepper: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
    },
    stepperButton: {
        width: 30,
        height: 30,
        borderRadius: BorderRadius.full,
        alignItems: "center",
        justifyContent: "center",
    },
    quantityText: {
        fontSize: 15,
        minWidth: 20,
        textAlign: "center",
    },

    // Notes
    notesSection: {
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.md,
    },
    notesLabel: {
        fontSize: 14,
        marginBottom: Spacing.sm,
        textAlign: "left",
    },
    notesInput: {
        borderWidth: 1,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.tight,
        fontSize: 14,
        minHeight: 80,
        lineHeight: 22,
    },

    // Footer
    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.tight,
        paddingBottom: Spacing.sm,
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: Spacing.tight,
    },
    subtotalLabel: {
        fontSize: 14,
    },
    subtotalValue: {
        fontSize: 18,
    },
    buttonsRow: {
        flexDirection: "row",
        gap: Spacing.sm,
    },
    checkoutButton: {
        flex: 1,
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.xl,
        alignItems: "center",
        justifyContent: "center",
    },
    addMoreButton: {
        flex: 1,
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.xl,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 15,
    },
});
