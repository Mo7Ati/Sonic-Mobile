import { AddressSelector } from "@/app/addresses/_components/AddressSelector";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useBranchPaymentMethods } from "@/hooks/react-query-hooks/use-orders";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getAddressFieldsSummary, formatAmount } from "@/lib/utils.";
import { useLastSelectedAddress } from "@/stores/app-prefs-store";
import {
    selectCartBranchId,
    selectItemsCount,
    selectSubtotal,
    useCartStore,
} from "@/stores/cart-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    I18nManager,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAYMENT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
    bop: "business-outline",
    palpay: "card-outline",
    jawwal_pay: "phone-portrait-outline",
};

export default function CheckoutScreen() {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation(["checkout", "general"]);
    const router = useRouter();

    const cart = useCartStore((s) => s.cart);
    const subtotal = useCartStore(selectSubtotal);
    const itemsCount = useCartStore(selectItemsCount);
    const branchId = useCartStore(selectCartBranchId);

    const selectedAddress = useLastSelectedAddress();

    const { data: paymentMethods, isLoading: methodsLoading } =
        useBranchPaymentMethods(branchId);

    const [selectedMethodId, setSelectedMethodId] = useState<number | null>(
        null,
    );
    const [notes, setNotes] = useState("");
    const [addressPickerVisible, setAddressPickerVisible] = useState(false);

    const total = subtotal;

    const handleContinue = () => {
        if (!selectedAddress) {
            Alert.alert(t("checkout:title"), t("checkout:select_address_error"));
            return;
        }

        if (!selectedMethodId) {
            Alert.alert(t("checkout:title"), t("checkout:select_payment_error"));
            return;
        }

        router.push({
            pathname: "/pay",
            params: {
                methodId: String(selectedMethodId),
                notes: notes.trim(),
            },
        });
    };

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
                    name="receipt-outline"
                    size={64}
                    color={colors.mutedForeground}
                />
                <Text
                    style={[
                        styles.emptyText,
                        { color: colors.mutedForeground, fontFamily: font.regular },
                    ]}
                >
                    {t("general:empty.nothing_to_show")}
                </Text>
                <Pressable
                    onPress={() => router.replace("/(tabs)")}
                    style={[
                        styles.emptyButton,
                        { backgroundColor: colors.primary },
                    ]}
                >
                    <Text
                        style={[
                            styles.emptyButtonText,
                            { color: colors.primaryForeground, fontFamily: font.bold },
                        ]}
                    >
                        {t("checkout:ok")}
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
                <Text
                    style={[
                        styles.headerTitle,
                        { color: colors.foreground, fontFamily: font.bold },
                    ]}
                >
                    {t("checkout:title")}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Delivery address */}
                    <SectionHeader
                        title={t("checkout:delivery_address")}
                        colors={colors}
                        font={font}
                        action={
                            selectedAddress
                                ? {
                                      label: t("checkout:change"),
                                      onPress: () =>
                                          setAddressPickerVisible(true),
                                  }
                                : undefined
                        }
                    />
                    {selectedAddress ? (
                        <Pressable
                            onPress={() => setAddressPickerVisible(true)}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Ionicons
                                name="location-outline"
                                size={22}
                                color={colors.primary}
                            />
                            <View style={styles.cardBody}>
                                <Text
                                    style={[
                                        styles.cardTitle,
                                        {
                                            color: colors.foreground,
                                            fontFamily: font.semiBold,
                                        },
                                    ]}
                                >
                                    {selectedAddress.name}
                                </Text>
                                <Text
                                    style={[
                                        styles.cardSubtitle,
                                        {
                                            color: colors.mutedForeground,
                                            fontFamily: font.regular,
                                        },
                                    ]}
                                    numberOfLines={2}
                                >
                                    {getAddressFieldsSummary(selectedAddress)}
                                </Text>
                            </View>
                            <Ionicons
                                name={
                                    I18nManager.isRTL
                                        ? "chevron-back"
                                        : "chevron-forward"
                                }
                                size={20}
                                color={colors.mutedForeground}
                            />
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={() =>
                                router.push({
                                    pathname: "/addresses/add",
                                    params: { selectOnCreate: "1" },
                                })
                            }
                            style={[
                                styles.addCard,
                                { borderColor: colors.border },
                            ]}
                        >
                            <Ionicons
                                name="add-circle-outline"
                                size={22}
                                color={colors.primary}
                            />
                            <Text
                                style={[
                                    styles.addCardText,
                                    {
                                        color: colors.foreground,
                                        fontFamily: font.semiBold,
                                    },
                                ]}
                            >
                                {t("checkout:add_address")}
                            </Text>
                        </Pressable>
                    )}

                    {/* Payment method */}
                    <SectionHeader
                        title={t("checkout:payment_method")}
                        colors={colors}
                        font={font}
                    />
                    <View style={styles.optionsGroup}>
                        {methodsLoading ? (
                            <ActivityIndicator color={colors.primary} />
                        ) : !paymentMethods || paymentMethods.length === 0 ? (
                            <Text
                                style={[
                                    styles.cardSubtitle,
                                    {
                                        color: colors.mutedForeground,
                                        fontFamily: font.regular,
                                    },
                                ]}
                            >
                                {t("checkout:no_payment_methods")}
                            </Text>
                        ) : (
                            paymentMethods.map((method) => {
                                const selected = method.id === selectedMethodId;
                                return (
                                    <Pressable
                                        key={method.id}
                                        onPress={() =>
                                            setSelectedMethodId(method.id)
                                        }
                                        style={[
                                            styles.card,
                                            {
                                                backgroundColor: selected
                                                    ? colors.accent
                                                    : colors.card,
                                                borderColor: selected
                                                    ? colors.primary
                                                    : colors.border,
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name={
                                                PAYMENT_ICONS[
                                                    method.type.value
                                                ] ?? "wallet-outline"
                                            }
                                            size={22}
                                            color={
                                                selected
                                                    ? colors.primary
                                                    : colors.mutedForeground
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.cardTitle,
                                                styles.flex,
                                                {
                                                    color: colors.foreground,
                                                    fontFamily: font.medium,
                                                },
                                            ]}
                                        >
                                            {method.type.label}
                                        </Text>
                                        <Ionicons
                                            name={
                                                selected
                                                    ? "radio-button-on"
                                                    : "radio-button-off"
                                            }
                                            size={22}
                                            color={
                                                selected
                                                    ? colors.primary
                                                    : colors.mutedForeground
                                            }
                                        />
                                    </Pressable>
                                );
                            })
                        )}
                    </View>

                    {/* Items summary */}
                    <SectionHeader
                        title={`${t("checkout:items")} (${itemsCount})`}
                        colors={colors}
                        font={font}
                    />
                    <View
                        style={[
                            styles.itemsCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        {cart.items.map((item, index) => (
                            <View
                                key={item.id}
                                style={[
                                    styles.itemRow,
                                    index > 0 && {
                                        borderTopColor: colors.border,
                                        borderTopWidth: StyleSheet.hairlineWidth,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.itemQty,
                                        {
                                            color: colors.mutedForeground,
                                            fontFamily: font.semiBold,
                                        },
                                    ]}
                                >
                                    {item.quantity}×
                                </Text>
                                <Text
                                    style={[
                                        styles.itemName,
                                        styles.flex,
                                        {
                                            color: colors.foreground,
                                            fontFamily: font.regular,
                                        },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {item.name}
                                </Text>
                                <Text
                                    style={[
                                        styles.itemPrice,
                                        {
                                            color: colors.foreground,
                                            fontFamily: font.semiBold,
                                        },
                                    ]}
                                >
                                    {formatAmount(item.total_price)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Notes */}
                    <SectionHeader
                        title={t("checkout:notes")}
                        colors={colors}
                        font={font}
                    />
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
                        placeholder={t("checkout:notes_placeholder")}
                        placeholderTextColor={colors.placeholder}
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        textAlign={I18nManager.isRTL ? "right" : "left"}
                    />

                    {/* Order summary */}
                    <SectionHeader
                        title={t("checkout:order_summary")}
                        colors={colors}
                        font={font}
                    />
                    <View style={styles.summaryGroup}>
                        <SummaryRow
                            label={t("checkout:subtotal")}
                            value={formatAmount(subtotal)}
                            colors={colors}
                            font={font}
                        />
                        <SummaryRow
                            label={t("checkout:total")}
                            value={formatAmount(total)}
                            colors={colors}
                            font={font}
                            emphasized
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <Pressable
                    onPress={handleContinue}
                    style={[
                        styles.placeOrderButton,
                        { backgroundColor: colors.primary },
                    ]}
                >
                    <Text
                        style={[
                            styles.placeOrderText,
                            {
                                color: colors.primaryForeground,
                                fontFamily: font.bold,
                            },
                        ]}
                    >
                        {`${t("checkout:continue_to_payment")} · ${formatAmount(total)}`}
                    </Text>
                </Pressable>
            </View>

            <AddressSelector
                visible={addressPickerVisible}
                onClose={() => setAddressPickerVisible(false)}
            />
        </SafeAreaView>
    );
}

function SectionHeader({
    title,
    action,
    colors,
    font,
}: {
    title: string;
    action?: { label: string; onPress: () => void };
    colors: ReturnType<typeof useAppTheme>["colors"];
    font: ReturnType<typeof useAppTheme>["font"];
}) {
    return (
        <View style={styles.sectionHeader}>
            <Text
                style={[
                    styles.sectionTitle,
                    { color: colors.foreground, fontFamily: font.bold },
                ]}
            >
                {title}
            </Text>
            {action && (
                <Pressable onPress={action.onPress} hitSlop={8}>
                    <Text
                        style={[
                            styles.sectionAction,
                            { color: colors.link, fontFamily: font.medium },
                        ]}
                    >
                        {action.label}
                    </Text>
                </Pressable>
            )}
        </View>
    );
}

function SummaryRow({
    label,
    value,
    emphasized,
    colors,
    font,
}: {
    label: string;
    value: string;
    emphasized?: boolean;
    colors: ReturnType<typeof useAppTheme>["colors"];
    font: ReturnType<typeof useAppTheme>["font"];
}) {
    return (
        <View style={styles.summaryRow}>
            <Text
                style={[
                    emphasized ? styles.summaryTotalLabel : styles.summaryLabel,
                    {
                        color: emphasized
                            ? colors.foreground
                            : colors.mutedForeground,
                        fontFamily: emphasized ? font.bold : font.regular,
                    },
                ]}
            >
                {label}
            </Text>
            <Text
                style={[
                    emphasized ? styles.summaryTotalValue : styles.summaryValue,
                    {
                        color: colors.foreground,
                        fontFamily: emphasized ? font.bold : font.medium,
                    },
                ]}
            >
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    flex: { flex: 1 },
    centered: {
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.tight,
        paddingHorizontal: Spacing.gutter,
    },
    emptyText: { fontSize: 15, textAlign: "center" },
    emptyButton: {
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.full,
    },
    emptyButtonText: { fontSize: 15 },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.tight,
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    headerSpacer: { width: 38, height: 38 },
    headerTitle: { fontSize: 18 },

    // Content
    scrollContent: {
        paddingHorizontal: Spacing.gutter,
        paddingBottom: Spacing.lg,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    sectionTitle: { fontSize: 16, textAlign: "left" },
    sectionAction: { fontSize: 14 },

    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.tight,
        borderWidth: 1.5,
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
    },
    cardBody: { flex: 1 },
    cardTitle: { fontSize: 15, textAlign: "left" },
    cardSubtitle: {
        fontSize: 13,
        lineHeight: 19,
        marginTop: 2,
        textAlign: "left",
    },

    addCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.sm,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderRadius: BorderRadius.xl,
        paddingVertical: Spacing.md,
    },
    addCardText: { fontSize: 15 },

    optionsGroup: { gap: Spacing.sm },

    itemsCard: {
        borderWidth: 1,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.md,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
        paddingVertical: Spacing.tight,
    },
    itemQty: { fontSize: 14, minWidth: 28, textAlign: "left" },
    itemName: { fontSize: 14, textAlign: "left" },
    itemPrice: { fontSize: 14 },

    notesInput: {
        borderWidth: 1,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.tight,
        fontSize: 14,
        minHeight: 80,
        lineHeight: 22,
    },

    summaryGroup: { gap: Spacing.sm },
    summaryRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    summaryLabel: { fontSize: 14 },
    summaryValue: { fontSize: 14 },
    summaryTotalLabel: { fontSize: 16 },
    summaryTotalValue: { fontSize: 17 },

    // Footer
    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.tight,
        paddingBottom: Spacing.sm,
    },
    placeOrderButton: {
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.xl,
        alignItems: "center",
        justifyContent: "center",
    },
    placeOrderText: { fontSize: 16 },
});
