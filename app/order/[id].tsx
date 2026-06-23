import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    I18nManager,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { OrderDetailItem } from "@/components/orders/order-detail-item";
import { BorderRadius, Spacing } from "@/constants/theme";
import { FontFamily } from "@/constants/fonts";
import { useOrder } from "@/hooks/react-query-hooks/use-orders";
import { useAppTheme } from "@/hooks/use-app-theme";
import { parseApiError } from "@/lib/api";
import {
    formatOrderAddress,
} from "@/lib/order-utils";
import { BackButton } from "@/components/ui/back-button";

function SummaryRow({
    label,
    value,
    bold,
}: {
    label: string;
    value: string;
    bold?: boolean;
}) {
    const { colors } = useAppTheme();

    return (
        <View style={styles.summaryRow}>
            <Text
                style={[
                    styles.summaryLabel,
                    { color: colors.mutedForeground },
                    bold && { color: colors.foreground, fontFamily: FontFamily.semiBold },
                ]}
            >
                {label}
            </Text>
            <Text
                style={[
                    styles.summaryValue,
                    { color: colors.foreground },
                    bold && { fontFamily: FontFamily.bold, fontSize: 17 },
                ]}
            >
                {value}
            </Text>
        </View>
    );
}

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const orderId = Number(id);
    const router = useRouter();
    const { colors } = useAppTheme();
    const { t } = useTranslation(["orders", "checkout", "general"]);

    const { data: order, isLoading, error, refetch, isRefetching } = useOrder(
        Number.isFinite(orderId) ? orderId : null,
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator color={colors.primary} size="large" />
                </View>
            );
        }

        if (error || !order) {
            return (
                <View style={styles.center}>
                    <Text style={[styles.muted, { color: colors.mutedForeground }]}>
                        {parseApiError(error).message}
                    </Text>
                    <Pressable
                        style={[styles.retryButton, { backgroundColor: colors.primary }]}
                        onPress={() => void refetch()}
                    >
                        <Text style={[styles.retryLabel, { color: colors.primaryForeground }]}>
                            {t("general:actions.retry")}
                        </Text>
                    </Pressable>
                </View>
            );
        }

        const addressSummary = formatOrderAddress(order.address_data);
        const isPaymentPending = order.payment_status.value === "wait_for_confirmation";

        return (
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.storeHeader}>
                        <View
                            style={[
                                styles.storeLogoWrap,
                                {
                                    backgroundColor: colors.muted,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            {order.branch.logo ? (
                                <Image source={{ uri: order.branch.logo }} style={styles.storeLogo} contentFit="cover" />
                            ) : (
                                <Ionicons name="storefront-outline" size={20} color={colors.mutedForeground} />
                            )}
                        </View>

                        <View style={styles.storeTextWrap}>
                            <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={2}>
                                {order.branch.name}
                            </Text>
                        </View>
                    </View>

                    <Text style={[styles.placedAt, { color: colors.mutedForeground }]}>
                        {order.created_at}
                    </Text>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.statusRow}>
                        <Text style={[styles.statusLabel, { color: colors.mutedForeground }]}>
                            {t("orders:detail.order_status")}:
                        </Text>
                        <View
                            style={[
                                styles.badge,
                                { backgroundColor: order.status.backgroundColor ?? colors.muted },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.badgeText,
                                    { color: order.status.textColor ?? colors.foreground },
                                ]}
                            >
                                {order.status.label}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statusRow}>
                        <Text style={[styles.statusLabel, { color: colors.mutedForeground }]}>
                            {t("orders:detail.payment_status")}:
                        </Text>
                        <View style={[styles.badge, { backgroundColor: colors.muted }]}>
                            <Text style={[styles.badgeText, { color: colors.foreground }]}>
                                {order.payment_status.label}
                            </Text>
                        </View>
                    </View>
                </View>

                {!!addressSummary && (
                    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                            {t("checkout:delivery_address")}
                        </Text>
                        <Text style={[styles.sectionBody, { color: colors.mutedForeground }]}>
                            {addressSummary}
                        </Text>
                    </View>
                )}

                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                        {t("checkout:items")}
                    </Text>

                    {order.items?.map((item) => (
                        <OrderDetailItem key={item.id} item={item} />
                    ))}
                </View>

                {!!order.notes && (
                    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                            {t("checkout:notes")}
                        </Text>
                        <Text style={[styles.sectionBody, { color: colors.mutedForeground }]}>
                            {order.notes}
                        </Text>
                    </View>
                )}

                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                        {t("checkout:order_summary")}
                    </Text>

                    <SummaryRow
                        label={t("checkout:subtotal")}
                        value={`${Number(order.total_items_amount).toFixed(2)} ${t("general:currency.egp")}`}
                    />
                    <SummaryRow
                        label={t("checkout:delivery_fee")}
                        value={`${Number(order.delivery_amount).toFixed(2)} ${t("general:currency.egp")}`}
                    />
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <SummaryRow
                        label={t("checkout:total")}
                        value={`${Number(order.total).toFixed(2)} ${t("general:currency.egp")}`}
                        bold
                    />
                </View>
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <BackButton />
                <Text style={[styles.headerTitle, { color: colors.foreground }]}>
                    {t("orders:detail.title")}
                </Text>

                <View style={styles.headerSpacer} />
            </View>

            {renderContent()}

            {isRefetching && !isLoading && (
                <ActivityIndicator style={styles.refetching} color={colors.primary} />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.sm,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    backButton: {
        width: 40,
    },
    headerTitle: {
        flex: 1,
        fontSize: 17,
        fontFamily: FontFamily.semiBold,
        textAlign: "center",
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        padding: Spacing.gutter,
        gap: Spacing.tight,
        paddingBottom: Spacing.xl,
    },
    heroCard: {
        borderRadius: BorderRadius.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: Spacing.md,
        gap: Spacing.xs,
        alignItems: "flex-start",
    },
    storeHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.tight,
        alignSelf: "stretch",
    },
    storeLogoWrap: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.full,
        borderWidth: StyleSheet.hairlineWidth,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
    },
    storeLogo: {
        width: "100%",
        height: "100%",
    },
    storeTextWrap: {
        flex: 1,
        minWidth: 0,
        gap: 2,
        alignItems: "flex-start",
    },
    storeLabel: {
        fontSize: 11,
        fontFamily: FontFamily.medium,
    },
    storeName: {
        fontSize: 20,
        fontFamily: FontFamily.bold,
    },
    placedAt: {
        fontSize: 13,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: Spacing.tight,
        alignSelf: "stretch",
    },
    statusLabel: {
        fontSize: 14,
        fontFamily: FontFamily.medium,
        flexShrink: 0,
    },
    badge: {
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.tight,
        paddingVertical: 4,
    },
    badgeText: {
        fontSize: 12,
        fontFamily: FontFamily.semiBold,
    },
    paymentAlert: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.tight,
        paddingVertical: Spacing.xs,
        marginTop: Spacing.xs,
    },
    paymentAlertText: {
        fontSize: 13,
        fontFamily: FontFamily.semiBold,
    },
    section: {
        borderRadius: BorderRadius.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: Spacing.md,
        gap: Spacing.xs,
        alignItems: "flex-start",
    },
    sectionTitle: {
        fontSize: 15,
        fontFamily: FontFamily.semiBold,
        marginBottom: 2,
    },
    sectionBody: {
        fontSize: 14,
        lineHeight: 20,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 4,
    },
    summaryLabel: {
        fontSize: 14,
    },
    summaryValue: {
        fontSize: 14,
        fontFamily: FontFamily.medium,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginVertical: Spacing.xs,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: Spacing.xl,
        gap: Spacing.tight,
    },
    muted: {
        fontSize: 15,
        textAlign: "center",
    },
    retryButton: {
        marginTop: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.full,
    },
    retryLabel: {
        fontSize: 15,
        fontFamily: FontFamily.semiBold,
    },
    refetching: {
        position: "absolute",
        top: 72,
        alignSelf: "center",
    },
});
