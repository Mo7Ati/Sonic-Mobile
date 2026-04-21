import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  I18nManager,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const WIN_W = Dimensions.get('window').width;

const CATEGORY_GRID_GAP = Spacing.sm;
const CATEGORY_GRID_COLS = 3;

function getCategoryGridMetrics(screenWidth: number) {
  const inner = screenWidth - Spacing.gutter * 2;
  const tileW = (inner - CATEGORY_GRID_GAP * (CATEGORY_GRID_COLS - 1)) / CATEGORY_GRID_COLS;
  const icon = Math.min(100, Math.floor(tileW) - 4);
  return { tileW, icon };
}

type ShimmerBoneProps = {
  height: number;
  width?: number | `${number}%`;
  borderRadius?: number;
  baseColor: string;
  highlight: string;
  translateX: Animated.AnimatedInterpolation<number>;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

function ShimmerBone({
  height,
  width = '100%',
  borderRadius = BorderRadius.xl,
  baseColor,
  highlight,
  translateX,
  style,
  children,
}: ShimmerBoneProps) {
  return (
    <View
      style={[{ height, width, borderRadius, backgroundColor: baseColor, overflow: 'hidden' }, style]}
    >
      {children}
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

function SectionHeaderSkeleton({
  baseColor,
  mutedColor,
  highlight,
  translateX,
}: {
  baseColor: string;
  mutedColor: string;
  highlight: string;
  translateX: Animated.AnimatedInterpolation<number>;
}) {
  return (
    <View style={styles.sectionHeaderRow}>
      <View style={styles.titleBlock}>
        <ShimmerBone
          height={16}
          width={148}
          borderRadius={BorderRadius.md}
          baseColor={baseColor}
          highlight={highlight}
          translateX={translateX}
        />
        <View style={{ height: Spacing.xs / 2 }} />
        <ShimmerBone
          height={11}
          width={104}
          borderRadius={BorderRadius.md}
          baseColor={mutedColor}
          highlight={highlight}
          translateX={translateX}
        />
      </View>
      <View style={styles.seeAllBone}>
        <ShimmerBone
          height={12}
          width={52}
          borderRadius={BorderRadius.sm}
          baseColor={baseColor}
          highlight={highlight}
          translateX={translateX}
        />
        <ShimmerBone
          height={14}
          width={14}
          borderRadius={BorderRadius.sm}
          baseColor={baseColor}
          highlight={highlight}
          translateX={translateX}
          style={{ marginStart: Spacing.xs / 2 }}
        />
      </View>
    </View>
  );
}

export const HomePageSkeleton: React.FC = () => {
  const insets = useSafeAreaInsets();
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

  const { tileW: categoryTileW, icon: categoryIconSize } = getCategoryGridMetrics(WIN_W);

  return (
    <View
      style={[styles.screen, { paddingTop: insets.top, backgroundColor: colors.background }]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    >
      {/* Deliver-to header */}
      <View style={styles.deliverRow}>
        <ShimmerBone
          height={22}
          width={22}
          borderRadius={BorderRadius.full}
          baseColor={boneMuted}
          highlight={highlight}
          translateX={translateX}
        />
        <View style={styles.deliverTextCol}>
          <ShimmerBone
            height={10}
            width={72}
            borderRadius={BorderRadius.md}
            baseColor={bone}
            highlight={highlight}
            translateX={translateX}
          />
          <View style={{ height: 6 }} />
          <View style={styles.addressRow}>
            <ShimmerBone
              height={15}
              width={168}
              borderRadius={BorderRadius.md}
              baseColor={bone}
              highlight={highlight}
              translateX={translateX}
            />
            <ShimmerBone
              height={12}
              width={12}
              borderRadius={BorderRadius.sm}
              baseColor={boneMuted}
              highlight={highlight}
              translateX={translateX}
              style={{ marginStart: Spacing.xs }}
            />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search (matches SearchSection) */}
        {/* <View style={styles.searchWrap}>
          <View style={[styles.searchBar, { borderColor: colors.border }]}>
            <ShimmerBone
              height={18}
              width={18}
              borderRadius={BorderRadius.full}
              baseColor={boneMuted}
              highlight={highlight}
              translateX={translateX}
            />
            <View style={styles.searchInputSlot}>
              <ShimmerBone
                height={14}
                width="100%"
                borderRadius={BorderRadius.md}
                baseColor={boneMuted}
                highlight={highlight}
                translateX={translateX}
              />
            </View>
            <View style={[styles.searchDivider, { backgroundColor: colors.border }]} />
            <ShimmerBone
              height={18}
              width={18}
              borderRadius={BorderRadius.full}
              baseColor={boneMuted}
              highlight={highlight}
              translateX={translateX}
            />
          </View>
        </View> */}

        {/* Hero banner (matches MainBanner carousel item) */}
        <View style={styles.bannerSection}>
          <ShimmerBone
            height={160}
            width="100%"
            borderRadius={BorderRadius['2xl']}
            baseColor={boneMuted}
            highlight={highlight}
            translateX={translateX}
            style={styles.bannerInner}
          />
        </View>

        {/* Categories row */}
        <View style={styles.sectionBlock}>
          <SectionHeaderSkeleton
            baseColor={bone}
            mutedColor={boneMuted}
            highlight={highlight}
            translateX={translateX}
          />
          <View style={[styles.categoryGridWrap, { paddingHorizontal: Spacing.gutter }]}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={[styles.categoryItem, { width: categoryTileW }]}>
                <ShimmerBone
                  height={categoryIconSize}
                  width={categoryIconSize}
                  borderRadius={BorderRadius['2xl']}
                  baseColor={boneMuted}
                  highlight={highlight}
                  translateX={translateX}
                />
                <ShimmerBone
                  height={11}
                  width="78%"
                  borderRadius={BorderRadius.md}
                  baseColor={bone}
                  highlight={highlight}
                  translateX={translateX}
                  style={{ marginTop: Spacing.sm }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Promo tiles */}
        <View style={styles.sectionBlock}>
          <SectionHeaderSkeleton
            baseColor={bone}
            mutedColor={boneMuted}
            highlight={highlight}
            translateX={translateX}
          />
          <View style={styles.gridRow}>
            {[0, 1, 2].map((i) => (
              <ShimmerBone
                key={i}
                height={96}
                width="100%"
                borderRadius={BorderRadius.xl}
                baseColor={boneMuted}
                highlight={highlight}
                translateX={translateX}
                style={styles.gridCell}
              />
            ))}
          </View>
        </View>

        {/* Branch cards (horizontal, matches BranchCard width) */}
        <View style={styles.sectionBlock}>
          <SectionHeaderSkeleton
            baseColor={bone}
            mutedColor={boneMuted}
            highlight={highlight}
            translateX={translateX}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.branchListContent}
          >
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.branchCard, { borderColor: colors.border }]}>
                <View style={styles.branchTop}>
                  <ShimmerBone
                    height={48}
                    width={48}
                    borderRadius={BorderRadius.xl}
                    baseColor={boneMuted}
                    highlight={highlight}
                    translateX={translateX}
                  />
                  <View style={styles.branchTextCol}>
                    <ShimmerBone
                      height={14}
                      width="100%"
                      borderRadius={BorderRadius.md}
                      baseColor={bone}
                      highlight={highlight}
                      translateX={translateX}
                    />
                    <ShimmerBone
                      height={10}
                      width="78%"
                      borderRadius={BorderRadius.md}
                      baseColor={boneMuted}
                      highlight={highlight}
                      translateX={translateX}
                    />
                  </View>
                </View>
                <View style={[styles.branchMeta, { borderTopColor: colors.border }]}>
                  <ShimmerBone
                    height={10}
                    width={44}
                    borderRadius={BorderRadius.md}
                    baseColor={bone}
                    highlight={highlight}
                    translateX={translateX}
                  />
                  <ShimmerBone
                    height={10}
                    width={56}
                    borderRadius={BorderRadius.md}
                    baseColor={boneMuted}
                    highlight={highlight}
                    translateX={translateX}
                  />
                  <ShimmerBone
                    height={10}
                    width={40}
                    borderRadius={BorderRadius.md}
                    baseColor={bone}
                    highlight={highlight}
                    translateX={translateX}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Extra list-style rows */}
        <View style={styles.sectionBlock}>
          <SectionHeaderSkeleton
            baseColor={bone}
            mutedColor={boneMuted}
            highlight={highlight}
            translateX={translateX}
          />
          <View style={styles.listRows}>
            {[0, 1, 2].map((i) => (
              <ShimmerBone
                key={i}
                height={72}
                width="100%"
                borderRadius={BorderRadius.xl}
                baseColor={boneMuted}
                highlight={highlight}
                translateX={translateX}
                style={{ marginTop: i === 0 ? 0 : Spacing.sm + Spacing.xs }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const CARD_W = 272;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  deliverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.gutter,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: 10,
  },
  deliverTextCol: {
    flex: 1,
    minWidth: 0,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchWrap: {
    marginBottom: Spacing.tight,
    paddingHorizontal: Spacing.gutter,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.tight,
  },
  searchInputSlot: {
    flex: 1,
    minWidth: 0,
    marginStart: Spacing.sm,
    justifyContent: 'center',
  },
  searchDivider: {
    height: 28,
    width: 1,
    marginHorizontal: Spacing.sm + Spacing.xs,
  },
  listRows: {
    paddingHorizontal: Spacing.gutter,
  },
  bannerSection: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  bannerInner: {
    width: '100%',
  },
  sectionBlock: {
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: {
    marginBottom: Spacing.tight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.gutter,
  },
  titleBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexShrink: 1,
    marginEnd: Spacing.sm,
  },
  seeAllBone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryGridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CATEGORY_GRID_GAP,
  },
  categoryItem: {
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.sm + Spacing.xs,
    paddingHorizontal: Spacing.gutter,
  },
  gridCell: {
    flex: 1,
  },
  branchListContent: {
    paddingHorizontal: Spacing.gutter,
    flexDirection: 'row',
  },
  branchCard: {
    width: CARD_W,
    marginEnd: Spacing.tight,
    borderRadius: BorderRadius['2xl'],
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.tight,
    overflow: 'hidden',
  },
  branchTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + Spacing.xs,
  },
  branchTextCol: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.xs,
    justifyContent: 'center',
  },
  branchMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm + Spacing.xs,
    marginTop: Spacing.sm + Spacing.xs,
    paddingTop: Spacing.sm + Spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
