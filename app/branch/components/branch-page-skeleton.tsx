import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    I18nManager,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const HERO_HEIGHT = 200;
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

function HeroSkeleton({
    boneMuted,
    highlight,
    translateX,
}: {
    boneMuted: string;
    highlight: string;
    translateX: Animated.AnimatedInterpolation<number>;
}) {
    const { colors } = useAppTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.heroContainer}>
            <ShimmerBone
                height={HERO_HEIGHT}
                width="100%"
                borderRadius={0}
                baseColor={boneMuted}
                highlight={highlight}
                translateX={translateX}
            />
            <View style={[styles.heroOverlay, { paddingTop: insets.top + Spacing.sm }]}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [
                        styles.heroIconButton,
                        { backgroundColor: colors.card, shadowColor: colors.shadow },
                        pressed && styles.pressed,
                    ]}
                >
                    <Ionicons
                        name={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
                        size={22}
                        color={colors.foreground}
                    />
                </Pressable>
                <View style={styles.heroRightActions}>
                    {[0, 1, 2].map((i) => (
                        <View
                            key={i}
                            style={[styles.heroIconButton, { backgroundColor: colors.card }]}
                        >
                            <ShimmerBone
                                height={18}
                                width={18}
                                borderRadius={9}
                                baseColor={colors.muted}
                                highlight={highlight}
                                translateX={translateX}
                            />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

function StoreInfoSkeleton({
    bone,
    boneMuted,
    borderColor,
    cardBg,
    highlight,
    translateX,
}: {
    bone: string;
    boneMuted: string;
    borderColor: string;
    cardBg: string;
    highlight: string;
    translateX: Animated.AnimatedInterpolation<number>;
}) {
    return (
        <View
            style={[
                styles.storeCard,
                { backgroundColor: cardBg, borderColor },
            ]}
        >
            <View style={styles.storeRow}>
                <ShimmerBone
                    height={52}
                    width={52}
                    borderRadius={14}
                    baseColor={boneMuted}
                    highlight={highlight}
                    translateX={translateX}
                />
                <View style={styles.storeTextCol}>
                    <ShimmerBone
                        height={18}
                        width="55%"
                        borderRadius={BorderRadius.md}
                        baseColor={bone}
                        highlight={highlight}
                        translateX={translateX}
                    />
                    <ShimmerBone
                        height={13}
                        width="78%"
                        borderRadius={BorderRadius.md}
                        baseColor={boneMuted}
                        highlight={highlight}
                        translateX={translateX}
                    />
                </View>
                <ShimmerBone
                    height={20}
                    width={20}
                    borderRadius={BorderRadius.sm}
                    baseColor={boneMuted}
                    highlight={highlight}
                    translateX={translateX}
                />
            </View>
            <View style={[styles.storeMetaRow, { borderTopColor: borderColor }]}>
                {[56, 72, 88].map((w) => (
                    <View key={w} style={styles.storeMetaItem}>
                        <ShimmerBone
                            height={14}
                            width={14}
                            borderRadius={7}
                            baseColor={boneMuted}
                            highlight={highlight}
                            translateX={translateX}
                        />
                        <ShimmerBone
                            height={12}
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
}

function CategoryTabsSkeleton({
    bone,
    boneMuted,
    borderColor,
    highlight,
    translateX,
}: {
    bone: string;
    boneMuted: string;
    borderColor: string;
    highlight: string;
    translateX: Animated.AnimatedInterpolation<number>;
}) {
    const { colors } = useAppTheme();
    return (
        <View
            style={[
                styles.tabsRow,
                { backgroundColor: colors.card, borderBottomColor: borderColor },
            ]}
        >
            <View style={styles.menuSlot}>
                <ShimmerBone
                    height={22}
                    width={22}
                    borderRadius={BorderRadius.sm}
                    baseColor={boneMuted}
                    highlight={highlight}
                    translateX={translateX}
                />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                {[72, 88, 64, 96, 80].map((w, i) => (
                    <View key={i} style={styles.tabSlot}>
                        <ShimmerBone
                            height={14}
                            width={w}
                            borderRadius={BorderRadius.md}
                            baseColor={bone}
                            highlight={highlight}
                            translateX={translateX}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

function ProductGridCellSkeleton({
    size,
    bone,
    boneMuted,
    highlight,
    translateX,
}: {
    size: number;
    bone: string;
    boneMuted: string;
    highlight: string;
    translateX: Animated.AnimatedInterpolation<number>;
}) {
    return (
        <View style={styles.gridCell}>
            <ShimmerBone
                height={size}
                width={size}
                borderRadius={BorderRadius.xl}
                baseColor={boneMuted}
                highlight={highlight}
                translateX={translateX}
            />
            <View style={styles.gridCellInfo}>
                <ShimmerBone
                    height={14}
                    width="92%"
                    borderRadius={BorderRadius.md}
                    baseColor={bone}
                    highlight={highlight}
                    translateX={translateX}
                />
                <ShimmerBone
                    height={12}
                    width="48%"
                    borderRadius={BorderRadius.md}
                    baseColor={boneMuted}
                    highlight={highlight}
                    translateX={translateX}
                />
            </View>
        </View>
    );
}

function ProductListRowSkeleton({
    bone,
    boneMuted,
    highlight,
    translateX,
    showDivider,
    dividerColor,
}: {
    bone: string;
    boneMuted: string;
    highlight: string;
    translateX: Animated.AnimatedInterpolation<number>;
    showDivider: boolean;
    dividerColor: string;
}) {
    return (
        <View>
            <View style={styles.listRow}>
                <View style={styles.listTextCol}>
                    <ShimmerBone
                        height={16}
                        width="88%"
                        borderRadius={BorderRadius.md}
                        baseColor={bone}
                        highlight={highlight}
                        translateX={translateX}
                    />
                    <ShimmerBone
                        height={13}
                        width="100%"
                        borderRadius={BorderRadius.md}
                        baseColor={boneMuted}
                        highlight={highlight}
                        translateX={translateX}
                    />
                    <ShimmerBone
                        height={13}
                        width="70%"
                        borderRadius={BorderRadius.md}
                        baseColor={boneMuted}
                        highlight={highlight}
                        translateX={translateX}
                    />
                    <View style={styles.listPriceRow}>
                        <ShimmerBone
                            height={14}
                            width={72}
                            borderRadius={BorderRadius.md}
                            baseColor={bone}
                            highlight={highlight}
                            translateX={translateX}
                        />
                    </View>
                    <ShimmerBone
                        height={12}
                        width={100}
                        borderRadius={BorderRadius.md}
                        baseColor={boneMuted}
                        highlight={highlight}
                        translateX={translateX}
                    />
                </View>
                <ShimmerBone
                    height={100}
                    width={100}
                    borderRadius={BorderRadius.xl}
                    baseColor={boneMuted}
                    highlight={highlight}
                    translateX={translateX}
                />
            </View>
            {showDivider ? (
                <View style={[styles.listDivider, { backgroundColor: dividerColor }]} />
            ) : null}
        </View>
    );
}

export default function BranchPageSkeleton() {
    const { colors } = useAppTheme();
    const shine = useRef(new Animated.Value(0)).current;

    const bone = colors.border;
    const boneMuted = colors.muted;
    const highlight = 'rgba(255,255,255,0.55)';

    const gridCellSize = useMemo(
        () => (WIN_W - Spacing.gutter * 2 - 12) / 2,
        [],
    );

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
        <ScrollView
            showsVerticalScrollIndicator={false}
            accessibilityRole="progressbar"
            accessibilityLabel="Loading store"
        >
            <HeroSkeleton boneMuted={boneMuted} highlight={highlight} translateX={translateX} />

            <View style={{ backgroundColor: colors.card }}>
                <StoreInfoSkeleton
                    bone={bone}
                    boneMuted={boneMuted}
                    borderColor={colors.border}
                    cardBg={colors.card}
                    highlight={highlight}
                    translateX={translateX}
                />
            </View>

            <CategoryTabsSkeleton
                bone={bone}
                boneMuted={boneMuted}
                borderColor={colors.border}
                highlight={highlight}
                translateX={translateX}
            />

            <View style={styles.sections}>
                <View style={styles.section}>
                    <ShimmerBone
                        height={24}
                        width="52%"
                        borderRadius={BorderRadius.md}
                        baseColor={bone}
                        highlight={highlight}
                        translateX={translateX}
                    />
                    <ShimmerBone
                        height={13}
                        width="90%"
                        borderRadius={BorderRadius.md}
                        baseColor={boneMuted}
                        highlight={highlight}
                        translateX={translateX}
                        style={{ marginTop: 6 }}
                    />
                    <View style={styles.grid}>
                        {[0, 1].map((row) => (
                            <View key={row} style={styles.gridRow}>
                                <ProductGridCellSkeleton
                                    size={gridCellSize}
                                    bone={bone}
                                    boneMuted={boneMuted}
                                    highlight={highlight}
                                    translateX={translateX}
                                />
                                <ProductGridCellSkeleton
                                    size={gridCellSize}
                                    bone={bone}
                                    boneMuted={boneMuted}
                                    highlight={highlight}
                                    translateX={translateX}
                                />
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <ShimmerBone
                        height={24}
                        width="40%"
                        borderRadius={BorderRadius.md}
                        baseColor={bone}
                        highlight={highlight}
                        translateX={translateX}
                    />
                    <View style={{ marginTop: 16 }}>
                        {[0, 1, 2].map((i) => (
                            <ProductListRowSkeleton
                                key={i}
                                bone={bone}
                                boneMuted={boneMuted}
                                highlight={highlight}
                                translateX={translateX}
                                showDivider={i < 2}
                                dividerColor={colors.border}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    heroContainer: {
        height: HERO_HEIGHT,
        overflow: 'hidden',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: Spacing.md,
    },
    heroIconButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    heroRightActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    pressed: {
        opacity: 0.7,
    },
    storeCard: {
        marginTop: -90,
        marginBottom: 5,
        marginHorizontal: Spacing.md,
        borderRadius: BorderRadius['2xl'],
        padding: Spacing.md,
        borderWidth: StyleSheet.hairlineWidth,
    },
    storeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.tight,
    },
    storeTextCol: {
        flex: 1,
        gap: 6,
    },
    storeMetaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: Spacing.narrow,
        marginTop: 14,
        paddingTop: 14,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    storeMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    tabsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    menuSlot: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabsScroll: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 4,
        paddingEnd: Spacing.md,
    },
    tabSlot: {
        paddingHorizontal: 14,
        paddingVertical: 4,
    },
    sections: {
        paddingHorizontal: Spacing.gutter,
        paddingBottom: Spacing.xl,
    },
    section: {
        paddingTop: 24,
    },
    grid: {
        marginTop: 16,
        gap: 16,
    },
    gridRow: {
        flexDirection: 'row',
        gap: 12,
    },
    gridCell: {
        flex: 1,
    },
    gridCellInfo: {
        paddingVertical: Spacing.sm,
        gap: Spacing.xs,
        paddingHorizontal: 5,
    },
    listRow: {
        flexDirection: 'row',
        paddingVertical: Spacing.md,
        gap: Spacing.tight,
    },
    listTextCol: {
        flex: 1,
        gap: Spacing.xs,
        justifyContent: 'center',
        minWidth: 0,
    },
    listPriceRow: {
        marginTop: Spacing.xs,
    },
    listDivider: {
        height: StyleSheet.hairlineWidth,
    },
});
