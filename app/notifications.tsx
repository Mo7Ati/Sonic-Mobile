import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
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

import { FontFamily } from "@/constants/fonts";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import {
    useMarkAllNotificationsRead,
    useMarkNotificationRead,
    useNotifications,
} from "@/hooks/react-query-hooks/use-notifications";
import { parseApiError } from "@/lib/api";
import type { AppNotification } from "@/services/notifications/types";

export default function NotificationsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const {
        data,
        isLoading,
        isRefetching,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useNotifications();

    const markRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();

    const notifications = data?.pages.flatMap((page) => page.data) ?? [];
    const hasUnread = notifications.some((item) => !item.is_read);

    const onPressItem = useCallback(
        (item: AppNotification) => {
            if (!item.is_read) {
                markRead.mutate(item.id);
            }

            if (item.data?.type === "order_status") {
                router.push("/orders");
            }
        },
        [markRead, router],
    );

    const renderItem = useCallback(
        ({ item }: { item: AppNotification }) => (
            <Pressable
                onPress={() => onPressItem(item)}
                style={[styles.card, !item.is_read && styles.cardUnread]}
            >
                <View style={styles.cardRow}>
                    <View style={styles.iconWrap}>
                        <Ionicons
                            name={item.data?.type === "order_status" ? "receipt-outline" : "notifications-outline"}
                            size={20}
                            color={Colors.primary}
                        />
                    </View>

                    <View style={styles.cardBody}>
                        {!!item.title && <Text style={styles.title}>{item.title}</Text>}
                        {!!item.body && <Text style={styles.body}>{item.body}</Text>}
                        <Text style={styles.time}>{formatRelativeTime(item.created_at)}</Text>
                    </View>

                    {!item.is_read && <View style={styles.unreadDot} />}
                </View>
            </Pressable>
        ),
        [onPressItem],
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator color={Colors.primary} />
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.center}>
                    <Text style={styles.muted}>{parseApiError(error).message}</Text>
                    <Pressable style={styles.retryButton} onPress={() => void refetch()}>
                        <Text style={styles.retryLabel}>Retry</Text>
                    </Pressable>
                </View>
            );
        }

        return (
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={() => void refetch()}
                        tintColor={Colors.primary}
                    />
                }
                onEndReachedThreshold={0.4}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
                }}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator style={styles.footer} color={Colors.primary} />
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Ionicons name="notifications-off-outline" size={40} color={Colors.mutedForeground} />
                        <Text style={styles.muted}>No notifications yet</Text>
                    </View>
                }
            />
        );
    };

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={8} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.foreground} />
                </Pressable>

                <Text style={styles.headerTitle}>Notifications</Text>

                <Pressable
                    onPress={() => markAllRead.mutate()}
                    hitSlop={8}
                    disabled={!hasUnread || markAllRead.isPending}
                    style={styles.headerButton}
                >
                    <Text style={[styles.markAll, (!hasUnread || markAllRead.isPending) && styles.markAllDisabled]}>
                        Mark all read
                    </Text>
                </Pressable>
            </View>

            {renderContent()}
        </View>
    );
}

/** Compact "2h ago" style relative time, falling back to a locale date. */
function formatRelativeTime(iso: string): string {
    const then = new Date(iso).getTime();
    const seconds = Math.floor((Date.now() - then) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return new Date(iso).toLocaleDateString();
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.sm,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.border,
    },
    headerButton: {
        minWidth: 90,
    },
    headerTitle: {
        fontSize: 17,
        fontFamily: FontFamily.semiBold,
        color: Colors.foreground,
        textAlign: "center",
    },
    markAll: {
        fontSize: 13,
        color: Colors.primary,
        fontFamily: FontFamily.semiBold,
        textAlign: "right",
    },
    markAllDisabled: {
        color: Colors.mutedForeground,
    },
    listContent: {
        padding: Spacing.gutter,
        gap: Spacing.tight,
        flexGrow: 1,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.xl,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.border,
        padding: Spacing.md,
    },
    cardUnread: {
        backgroundColor: Colors.accent,
        borderColor: Colors.primary,
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: Spacing.tight,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.muted,
        alignItems: "center",
        justifyContent: "center",
    },
    cardBody: {
        flex: 1,
        gap: 2,
    },
    title: {
        fontSize: 15,
        fontFamily: FontFamily.semiBold,
        color: Colors.foreground,
    },
    body: {
        fontSize: 14,
        color: Colors.secondaryForeground,
        lineHeight: 20,
    },
    time: {
        fontSize: 12,
        color: Colors.mutedForeground,
        marginTop: 2,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.primary,
        marginTop: 6,
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
        color: Colors.mutedForeground,
        textAlign: "center",
    },
    retryButton: {
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.tight,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.primary,
    },
    retryLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: Colors.primaryForeground,
    },
    footer: {
        paddingVertical: Spacing.md,
    },
});
