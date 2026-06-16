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
import { LinearGradient } from 'expo-linear-gradient';

import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const WIN_W = Dimensions.get('window').width;
// Width of the moving highlight strip; shared between the gradient and the
// translate range so the sweep lines up with the bone edges.
const STRIP_WIDTH = WIN_W * 0.42;

// Dimensions mirrored from the real home sections so the skeleton settles into
// place without a layout jump once content arrives.
const BANNER_HEIGHT = 160;
const CATEGORY_ICON = 80;
const CATEGORY_TILE = 88;
const SQUARE_SIZE = 130;
const RECTANGLE_HEIGHT = 140;

type Shimmer = {
  bone: string;
  boneMuted: string;
  highlight: string;
  translateX: Animated.AnimatedInterpolation<number>;
};

/** Drives a single looping shine that every bone shares. */
function useShimmer(): Shimmer {
  const { colors } = useAppTheme();
  const shine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shine, {
        toValue: 1,
        duration: 1200,
        // Linear keeps the highlight moving at a steady pace the whole cycle.
        // ease-in/out parked it off-screen for ~half the cycle, which read as
        // "frozen" on fast loads (e.g. a warm refetch after an address change).
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [shine]);

  const translateX = useMemo(
    () =>
      shine.interpolate({
        inputRange: [0, 1],
        // Start just off the leading edge (strip's trailing edge at 0) and
        // sweep fully past the widest bone, so motion is visible from frame 1.
        outputRange: I18nManager.isRTL ? [WIN_W, -STRIP_WIDTH] : [-STRIP_WIDTH, WIN_W],
      }),
    [shine],
  );

  return {
    bone: colors.border,
    boneMuted: colors.muted,
    highlight: 'rgba(255,255,255,0.55)',
    translateX,
  };
}

type ShimmerBoneProps = {
  shimmer: Shimmer;
  height: number;
  width?: number | `${number}%`;
  borderRadius?: number;
  /** Use the lighter `boneMuted` tone (for image-like blocks). */
  muted?: boolean;
  style?: StyleProp<ViewStyle>;
};

function ShimmerBone({
  shimmer,
  height,
  width = '100%',
  borderRadius = BorderRadius.xl,
  muted,
  style,
}: ShimmerBoneProps) {
  return (
    <View
      style={[
        {
          height,
          width,
          borderRadius,
          backgroundColor: muted ? shimmer.boneMuted : shimmer.bone,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { transform: [{ translateX: shimmer.translateX }] }]}
      >
        <LinearGradient
          colors={['transparent', shimmer.highlight, 'transparent']}
          locations={[0.25, 0.5, 0.75]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

/** Title + optional description bones, matching SectionHeader spacing. */
function SectionHeaderSkeleton({
  shimmer,
  withDescription,
}: {
  shimmer: Shimmer;
  withDescription?: boolean;
}) {
  return (
    <View style={styles.headerRow}>
      <ShimmerBone shimmer={shimmer} height={16} width="42%" borderRadius={BorderRadius.md} />
      {withDescription ? (
        <ShimmerBone
          shimmer={shimmer}
          height={11}
          width="64%"
          borderRadius={BorderRadius.md}
          muted
          style={styles.headerDescription}
        />
      ) : null}
    </View>
  );
}

function MainBannerSkeleton({ shimmer }: { shimmer: Shimmer }) {
  return (
    <View style={styles.bannerSection}>
      <ShimmerBone
        shimmer={shimmer}
        height={BANNER_HEIGHT}
        borderRadius={BorderRadius['2xl']}
        muted
      />
    </View>
  );
}

function StoreCategoriesSkeleton({ shimmer }: { shimmer: Shimmer }) {
  return (
    <View style={styles.section}>
      <SectionHeaderSkeleton shimmer={shimmer} />
      <View style={styles.categoryRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={styles.categoryTile}>
            <ShimmerBone
              shimmer={shimmer}
              height={CATEGORY_ICON}
              width={CATEGORY_ICON}
              borderRadius={BorderRadius['2xl']}
              muted
            />
            <ShimmerBone
              shimmer={shimmer}
              height={10}
              width={56}
              borderRadius={BorderRadius.md}
              style={styles.categoryLabel}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

function SquareBannersSkeleton({ shimmer }: { shimmer: Shimmer }) {
  return (
    <View style={styles.section}>
      <SectionHeaderSkeleton shimmer={shimmer} withDescription />
      <View style={styles.squareRow}>
        {Array.from({ length: 3 }).map((_, i) => (
          <ShimmerBone
            key={i}
            shimmer={shimmer}
            height={SQUARE_SIZE}
            width={SQUARE_SIZE}
            borderRadius={BorderRadius['2xl']}
            muted
          />
        ))}
      </View>
    </View>
  );
}

function RectangleBannerSkeleton({ shimmer }: { shimmer: Shimmer }) {
  return (
    <View style={styles.section}>
      <SectionHeaderSkeleton shimmer={shimmer} />
      <View style={styles.rectangleWrap}>
        <ShimmerBone
          shimmer={shimmer}
          height={RECTANGLE_HEIGHT}
          borderRadius={BorderRadius['2xl']}
          muted
        />
      </View>
    </View>
  );
}

export const HomePageSkeleton: React.FC = () => {
  const shimmer = useShimmer();

  return (
    <>
      {/* <SearchSkeleton shimmer={shimmer} /> */}
      <MainBannerSkeleton shimmer={shimmer} />
      <StoreCategoriesSkeleton shimmer={shimmer} />
      <SquareBannersSkeleton shimmer={shimmer} />
      <RectangleBannerSkeleton shimmer={shimmer} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    width: STRIP_WIDTH,
    height: '100%',
  },
  headerRow: {
    marginBottom: Spacing.tight,
    paddingHorizontal: Spacing.gutter,
    alignItems: 'flex-start',
  },
  headerDescription: {
    marginTop: Spacing.narrow,
  },
  searchWrap: {
    marginBottom: Spacing.tight,
    paddingHorizontal: Spacing.gutter,
  },
  bannerSection: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  section: {
    marginBottom: Spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.gutter,
    gap: Spacing.sm,
    overflow: 'hidden',
  },
  categoryTile: {
    width: CATEGORY_TILE,
    alignItems: 'center',
  },
  categoryLabel: {
    marginTop: Spacing.sm,
  },
  squareRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.gutter,
    gap: Spacing.tight,
    overflow: 'hidden',
  },
  rectangleWrap: {
    paddingHorizontal: Spacing.md,
  },
});
