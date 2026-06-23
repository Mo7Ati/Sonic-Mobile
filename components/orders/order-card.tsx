import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { BorderRadius, Spacing } from "@/constants/theme";
import { FontFamily } from "@/constants/fonts";
import { useAppTheme } from "@/hooks/use-app-theme";
import {
    formatItemsBrief,
    formatOrderTime,
} from "@/lib/order-utils";
import { formatAmount } from "@/lib/utils.";
import type { Order } from "@/services/orders/types";
import { Image } from "expo-image";

interface OrderCardProps {
    order: Order;
    onPress?: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
    const { colors } = useAppTheme();
    const { t } = useTranslation("orders");

    const itemsBrief = formatItemsBrief(order.items);
    const isPaymentPending = order.payment_status.value === "wait_for_confirmation";

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
                pressed && { opacity: 0.9 },
            ]}
        >
            <View style={styles.topRow}>
                <View style={styles.storeInfo}>
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
                            <Image source={{ uri: order.branch.logo }} style={styles.storeLogo} />
                        ) : (
                            <Ionicons name="storefront-outline" size={16} color={colors.mutedForeground} />
                        )}
                    </View>

                    <View style={styles.storeTextWrap}>
                        <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={1}>
                            {order.branch.name}
                        </Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: order.status.backgroundColor ?? colors.muted },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            { color: order.status.textColor ?? colors.foreground },
                        ]}
                    >
                        {order.status.label}
                    </Text>
                </View>
            </View>

            {!!itemsBrief && (
                <Text
                    style={[styles.itemsBrief, { color: colors.mutedForeground }]}
                    numberOfLines={2}
                >
                    {itemsBrief}
                </Text>
            )}

            <View style={styles.bottomRow}>
                <Text style={[styles.time, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {order.created_at}
                </Text>

                <Text style={[styles.total, { color: colors.foreground }]}>
                    {formatAmount(order.total)}
                </Text>
            </View>

            {/* {isPaymentPending && (
                <View style={[styles.paymentBadge, { backgroundColor: colors.chart4 + "22" }]}>
                    <Ionicons name="alert-circle" size={14} color={colors.chart4} />
                    <Text style={[styles.paymentText, { color: colors.chart4 }]}>
                        {t("orders:payment_pending")}
                    </Text>
                </View>
            )} */}
        </Pressable>
    );
}

interface OrdersFilterTabsProps {
    value: "all" | "active";
    onChange: (value: "all" | "active") => void;
}

export function OrdersFilterTabs({ value, onChange }: OrdersFilterTabsProps) {
    const { colors } = useAppTheme();
    const { t } = useTranslation("orders");

    const tabs = [
        { key: "all" as const, label: t("filters.all") },
        { key: "active" as const, label: t("filters.active") },
    ];

    return (
        <View style={[styles.tabs, { backgroundColor: colors.muted }]}>
            {tabs.map((tab) => {
                const selected = value === tab.key;

                return (
                    <Pressable
                        key={tab.key}
                        onPress={() => onChange(tab.key)}
                        style={[styles.tab, selected && { backgroundColor: colors.card }]}
                    >
                        <Text
                            style={[
                                styles.tabLabel,
                                { color: selected ? colors.foreground : colors.mutedForeground },
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: BorderRadius.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: Spacing.md,
        gap: Spacing.xs,
        alignItems: "flex-start",
    },
    topRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: Spacing.tight,
        alignSelf: "stretch",
    },
    storeInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.tight,
        minWidth: 0,
    },
    storeLogoWrap: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.full,
        borderWidth: StyleSheet.hairlineWidth,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
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
        flex: 1,
        fontSize: 16,
        fontFamily: FontFamily.semiBold,
    },
    statusBadge: {
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.tight,
        paddingVertical: 4,
        flexShrink: 0,
        marginTop: 2,
    },
    statusText: {
        fontSize: 11,
        fontFamily: FontFamily.semiBold,
    },
    itemsBrief: {
        fontSize: 13,
        lineHeight: 18,
        alignSelf: "stretch",
    },
    storeLogo: {
        width: "100%",
        height: "100%",
    },
    bottomRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 2,
        alignSelf: "stretch",
        gap: Spacing.md,
    },
    time: {
        flex: 1,
        fontSize: 12,
    },
    total: {
        fontSize: 16,
        fontFamily: FontFamily.bold,
        flexShrink: 0,
    },
    paymentBadge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.tight,
        paddingVertical: 4,
        marginTop: 2,
    },
    paymentText: {
        fontSize: 11,
        fontFamily: FontFamily.semiBold,
    },
    tabs: {
        flexDirection: "row",
        marginHorizontal: Spacing.gutter,
        marginBottom: Spacing.tight,
        borderRadius: BorderRadius.lg,
        padding: 4,
        gap: 4,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.md,
    },
    tabLabel: {
        fontSize: 14,
        fontFamily: FontFamily.semiBold,
    },
});
