import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { BorderRadius, Spacing } from "@/constants/theme";
import { FontFamily } from "@/constants/fonts";
import { useAppTheme } from "@/hooks/use-app-theme";
import {
    formatOrderItemDescription,
    resolveOrderItemName,
} from "@/lib/order-utils";
import { formatAmount } from "@/lib/utils.";
import type { OrderItem } from "@/services/orders/types";

interface OrderDetailItemProps {
    item: OrderItem;
}

export function OrderDetailItem({ item }: OrderDetailItemProps) {
    const { colors } = useAppTheme();

    const description = formatOrderItemDescription(item);

    return (
        <View style={styles.row}>
            <View style={[styles.imageWrap, { backgroundColor: colors.muted }]}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
                ) : (
                    <Text style={[styles.imageFallback, { color: colors.mutedForeground }]}>
                        {resolveOrderItemName(item).charAt(0)}
                    </Text>
                )}
            </View>

            <View style={styles.body}>
                <View style={styles.nameRow}>
                    <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
                        {resolveOrderItemName(item)}
                    </Text>
                    <Text style={[styles.qty, { color: colors.mutedForeground }]}>
                        ×{item.quantity}
                    </Text>
                </View>

                {!!description && (
                    <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
                        {description}
                    </Text>
                )}

                <Text style={[styles.price, { color: colors.foreground }]}>
                    {formatAmount(item.total_price)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        gap: Spacing.tight,
        paddingVertical: Spacing.tight,
    },
    imageWrap: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.lg,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    imageFallback: {
        fontSize: 20,
        fontFamily: FontFamily.semiBold,
    },
    body: {
        flex: 1,
        gap: 2,
        alignItems: "flex-start",
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: Spacing.xs,
    },
    name: {
        flex: 1,
        fontSize: 15,
        fontFamily: FontFamily.semiBold,
    },
    qty: {
        fontSize: 13,
        fontFamily: FontFamily.medium,
    },
    description: {
        fontSize: 12,
        lineHeight: 17,
    },
    price: {
        fontSize: 14,
        fontFamily: FontFamily.semiBold,
        marginTop: 2,
    },
});
