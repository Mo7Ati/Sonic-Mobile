import { BorderRadius, Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

interface ShimmerBoneProps {
    height: number;
    width?: number | `${number}%`;
    borderRadius?: number;
}

function ShimmerBone({ height, width = "100%", borderRadius = BorderRadius.md }: ShimmerBoneProps) {
    const { colors } = useAppTheme();
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 1100, easing: Easing.linear }),
            -1,
            false,
        );
    }, [shimmer]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmer.value * 200 - 100 }],
    }));

    return (
        <View
            style={{
                height,
                width,
                borderRadius,
                backgroundColor: colors.border,
                overflow: "hidden",
            }}
        >
            <Animated.View
                style={[
                    {
                        width: "50%",
                        height: "100%",
                        backgroundColor: colors.muted,
                        opacity: 0.5,
                    },
                    animatedStyle,
                ]}
            />
        </View>
    );
}

function OrderCardSkeleton() {
    const { colors } = useAppTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.row}>
                <ShimmerBone height={16} width="35%" />
                <ShimmerBone height={24} width={72} borderRadius={BorderRadius.full} />
            </View>
            <ShimmerBone height={14} width="55%" />
            <View style={styles.row}>
                <ShimmerBone height={12} width="30%" />
                <ShimmerBone height={16} width="25%" />
            </View>
        </View>
    );
}

export function OrdersSkeleton() {
    return (
        <View style={styles.list}>
            {Array.from({ length: 4 }).map((_, index) => (
                <OrderCardSkeleton key={index} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        padding: Spacing.gutter,
        gap: Spacing.tight,
    },
    card: {
        borderRadius: BorderRadius.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: Spacing.md,
        gap: Spacing.tight,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
