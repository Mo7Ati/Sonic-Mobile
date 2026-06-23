import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { OrderCard, OrdersFilterTabs } from "@/components/orders/order-card";
import { OrdersSkeleton } from "@/components/orders/orders-skeleton";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { BorderRadius, Spacing } from "@/constants/theme";
import { FontFamily } from "@/constants/fonts";
import { useOrders } from "@/hooks/react-query-hooks/use-orders";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/hooks/use-auth";
import { parseApiError } from "@/lib/api";
import type { Order, OrdersFilter } from "@/services/orders/types";

export default function OrdersScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { colors } = useAppTheme();
    const { t } = useTranslation(["orders", "general"]);
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [filter, setFilter] = useState<OrdersFilter>("all");

    const {
        data,
        isLoading,
        isRefetching,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useOrders(filter);

    const orders = data?.pages.flatMap((page) => page.data) ?? [];

    const renderItem = useCallback(
        ({ item }: { item: Order }) => (
            <OrderCard
                order={item}
                onPress={() =>
                    router.push({
                        pathname: "/order/[id]",
                        params: { id: String(item.id) },
                    })
                }
            />
        ),
        [router],
    );

    const renderGuestState = () => (
        <View style={styles.center}>
            <View style={[styles.guestIcon, { backgroundColor: colors.muted }]}>
                <Ionicons name="receipt-outline" size={36} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                {t("orders:guest.title")}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
                {t("orders:guest.subtitle")}
            </Text>
            <Pressable
                style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push("/login")}
            >
                <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
                    {t("orders:guest.action")}
                </Text>
            </Pressable>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.center}>
            <Ionicons
                name={filter === "active" ? "time-outline" : "bag-handle-outline"}
                size={40}
                color={colors.mutedForeground}
            />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                {t(filter === "active" ? "orders:empty.active_title" : "orders:empty.title")}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
                {t(filter === "active" ? "orders:empty.active_subtitle" : "orders:empty.subtitle")}
            </Text>
        </View>
    );

    const renderContent = () => {
        if (authLoading) {
            return <OrdersSkeleton />;
        }

        if (!isAuthenticated) {
            return renderGuestState();
        }

        if (isLoading) {
            return <OrdersSkeleton />;
        }

        if (error) {
            return (
                <View style={styles.center}>
                    <Text style={[styles.muted, { color: colors.mutedForeground }]}>
                        {parseApiError(error).message}
                    </Text>
                    <Pressable
                        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                        onPress={() => void refetch()}
                    >
                        <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
                            {t("general:actions.retry")}
                        </Text>
                    </Pressable>
                </View>
            );
        }

        return (
            <FlatList
                data={orders}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={() => void refetch()}
                        tintColor={colors.primary}
                    />
                }
                onEndReachedThreshold={0.4}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        void fetchNextPage();
                    }
                }}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator style={styles.footer} color={colors.primary} />
                    ) : null
                }
                ListEmptyComponent={renderEmptyState}
            />
        );
    };

    return (
        <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={[styles.title, { color: colors.foreground }]}>{t("orders:title")}</Text>
                    <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                        {t("orders:subtitle")}
                    </Text>
                </View>
                <NotificationBell />
            </View>

            {isAuthenticated && !authLoading && (
                <OrdersFilterTabs value={filter} onChange={setFilter} />
            )}

            {renderContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.tight,
    },
    headerText: {
        flex: 1,
        gap: 2,
        alignItems: "flex-start",
    },
    title: {
        fontSize: 24,
        fontFamily: FontFamily.bold,
    },
    subtitle: {
        fontSize: 14,
    },
    listContent: {
        paddingHorizontal: Spacing.gutter,
        paddingBottom: Spacing.xl,
        gap: Spacing.tight,
        flexGrow: 1,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: Spacing.xl,
        gap: Spacing.tight,
    },
    guestIcon: {
        width: 72,
        height: 72,
        borderRadius: BorderRadius.full,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: Spacing.xs,
    },
    emptyTitle: {
        fontSize: 17,
        fontFamily: FontFamily.semiBold,
        textAlign: "center",
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
        marginBottom: Spacing.sm,
    },
    muted: {
        fontSize: 15,
        textAlign: "center",
    },
    primaryButton: {
        marginTop: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.full,
    },
    primaryButtonText: {
        fontSize: 15,
        fontFamily: FontFamily.semiBold,
    },
    footer: {
        paddingVertical: Spacing.md,
    },
});
