import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    I18nManager,
    StyleSheet,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

const SKELETON_COUNT = 4;
const WIN_W = Dimensions.get('window').width;

type ShimmerBoneProps = {
    height: number;
    width?: number | `${number}%`;
    borderRadius?: number;
    baseColor: string;
    highlight: string;
    translateX: Animated.AnimatedInterpolation<number>;
    style?: StyleProp<ViewStyle>;
};

function ShimmerBone({
    height,
    width = '100%',
    borderRadius = BorderRadius.xl,
    baseColor,
    highlight,
    translateX,
    style,
}: ShimmerBoneProps) {
    return (
        <View
            style={[
                { height, width, borderRadius, backgroundColor: baseColor, overflow: 'hidden' },
                style,
            ]}
        >
            <Animated.View
                pointerEvents="none"
                style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }] }]}
            >
                <LinearGradient
                    colors={['transparent', highlight, 'transparent']}
                    locations={[0.25, 0.5, 0.75]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ width: WIN_W * 0.42, height: '100%' }}
                />
            </Animated.View>
        </View>
    );
}

type BranchCardSkeletonProps = {
    bone: string;
    boneMuted: string;
    borderColor: string;
    cardBg: string;
    highlight: string;
    translateX: Animated.AnimatedInterpolation<number>;
};

const BranchCardSkeleton = ({
    bone,
    boneMuted,
    borderColor,
    cardBg,
    highlight,
    translateX,
}: BranchCardSkeletonProps) => (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
        <View style={styles.cardRow}>
            <ShimmerBone
                height={48}
                width={48}
                borderRadius={BorderRadius.xl}
                baseColor={boneMuted}
                highlight={highlight}
                translateX={translateX}
            />
            <View style={styles.textCol}>
                <ShimmerBone
                    height={14}
                    width="62%"
                    borderRadius={BorderRadius.md}
                    baseColor={bone}
                    highlight={highlight}
                    translateX={translateX}
                />
                <ShimmerBone
                    height={10}
                    width="42%"
                    borderRadius={BorderRadius.md}
                    baseColor={boneMuted}
                    highlight={highlight}
                    translateX={translateX}
                />
            </View>
        </View>
        <View style={[styles.metaRow, { borderTopColor: borderColor }]}>
            {[44, 72, 52].map((w) => (
                <View key={w} style={styles.metaItem}>
                    <ShimmerBone
                        height={12}
                        width={12}
                        borderRadius={BorderRadius.sm}
                        baseColor={boneMuted}
                        highlight={highlight}
                        translateX={translateX}
                    />
                    <ShimmerBone
                        height={10}
                        width={w}
                        borderRadius={BorderRadius.md}
                        baseColor={bone}
                        highlight={highlight}
                        translateX={translateX}
                    />
                </View>
            ))}
        </View>
    </View>
);

const BranchesListSkeleton = () => {
    const { colors } = useAppTheme();
    const shine = useRef(new Animated.Value(0)).current;

    const bone = colors.border;
    const boneMuted = colors.muted;
    const highlight = 'rgba(255,255,255,0.55)';

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(shine, {
                toValue: 1,
                duration: 1350,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
            }),
        );
        loop.start();
        return () => loop.stop();
    }, [shine]);

    const sweep = WIN_W * 1.15;
    const translateX = useMemo(
        () =>
            shine.interpolate({
                inputRange: [0, 1],
                outputRange: I18nManager.isRTL ? [sweep * 0.35, -sweep] : [-sweep, sweep * 0.35],
            }),
        [shine, sweep],
    );

    return (
        <View
            style={styles.container}
            accessibilityRole="progressbar"
            accessibilityLabel="Loading branches"
        >
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <BranchCardSkeleton
                    key={i}
                    bone={bone}
                    boneMuted={boneMuted}
                    borderColor={colors.border}
                    cardBg={colors.card}
                    highlight={highlight}
                    translateX={translateX}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: Spacing.tight,
    },
    card: {
        width: '100%',
        borderRadius: BorderRadius['2xl'],
        borderWidth: StyleSheet.hairlineWidth,
        padding: Spacing.tight,
        overflow: 'hidden',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm + Spacing.xs,
    },
    textCol: {
        flex: 1,
        minWidth: 0,
        gap: Spacing.xs,
        justifyContent: 'center',
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: Spacing.sm + Spacing.xs,
        marginTop: Spacing.sm + Spacing.xs,
        paddingTop: Spacing.sm + Spacing.xs,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
});

export default BranchesListSkeleton;
