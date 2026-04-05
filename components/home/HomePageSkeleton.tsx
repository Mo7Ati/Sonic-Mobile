import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-color';

export const HomePageSkeleton: React.FC = () => {
  const colors = useThemeColors();
  const opacity = useRef(new Animated.Value(0.55)).current;

  const bone = colors.border;
  const boneLight = colors.muted;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.wrap, { backgroundColor: colors.background, opacity }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.pill, styles.pillShort, { backgroundColor: bone }]} />
          <View style={[styles.pill, styles.pillLong, { backgroundColor: bone }]} />
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.circle, { backgroundColor: boneLight }]} />
          <View style={[styles.circle, { backgroundColor: boneLight }]} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.block, styles.searchBar, { backgroundColor: boneLight }]} />

        <View style={styles.sectionGap}>
          <View style={[styles.pill, styles.titleLine, { backgroundColor: bone }]} />
          <View style={[styles.hero, styles.block, { backgroundColor: boneLight }]} />
        </View>

        <View style={styles.sectionGap}>
          <View style={[styles.pill, styles.titleLine, { backgroundColor: bone }]} />
          <View style={styles.chipsRow}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.chip, { backgroundColor: boneLight }]} />
            ))}
          </View>
        </View>

        <View style={styles.sectionGap}>
          <View style={[styles.pill, styles.titleLine, { backgroundColor: bone }]} />
          <View style={styles.gridRow}>
            <View style={[styles.gridCell, styles.block, { backgroundColor: boneLight }]} />
            <View style={[styles.gridCell, styles.block, { backgroundColor: boneLight }]} />
            <View style={[styles.gridCell, styles.block, { backgroundColor: boneLight }]} />
          </View>
        </View>

        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.listSection}>
            <View style={[styles.pill, styles.titleLine, { backgroundColor: bone }]} />
            <View style={[styles.block, styles.listRow, { backgroundColor: boneLight }]} />
            <View style={[styles.block, styles.listRow, { backgroundColor: boneLight }]} />
            <View style={[styles.block, styles.listRow, { backgroundColor: boneLight }]} />
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    paddingTop: 8,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerLeft: {
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pill: {
    borderRadius: 6,
  },
  pillShort: {
    width: 56,
    height: 10,
  },
  pillLong: {
    width: 140,
    height: 14,
  },
  titleLine: {
    width: 120,
    height: 14,
    marginBottom: 12,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 9999,
  },
  block: {
    borderRadius: 12,
  },
  searchBar: {
    height: 48,
    width: '100%',
  },
  sectionGap: {
    marginTop: 20,
  },
  hero: {
    height: 168,
    width: '100%',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  gridCell: {
    flex: 1,
    height: 96,
  },
  listSection: {
    marginTop: 22,
  },
  listRow: {
    height: 72,
    width: '100%',
    marginTop: 10,
  },
});
