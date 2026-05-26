import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { SectionHeader } from './SectionHeader';
import type { Section } from '@/services/home/home-types';
import { StoreCategory } from '@/services/store-categories/types';
import { IMAGE_BLURHASH } from '@/constants/placeholders';

const CATEGORY_GAP = Spacing.sm;
const CATEGORY_COLUMNS = 3;

interface StoreCategoriesProps {
  section: Section;
  onSeeAll?: () => void;
}

export const StoreCategories: React.FC<StoreCategoriesProps> = ({
  section,
  onSeeAll,
}) => {
  const categories = (section.data as StoreCategory[]) || [];
  const { colors } = useAppTheme();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();

  const { tileWidth, iconSize } = useMemo(() => {
    const inner = windowWidth - Spacing.gutter * 2;
    const tile = (inner - CATEGORY_GAP * (CATEGORY_COLUMNS - 1)) / CATEGORY_COLUMNS;
    const icon = Math.min(100, Math.floor(tile) - 4);
    return { tileWidth: tile, iconSize: icon };
  }, [windowWidth]);

  if (categories.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title={section.title} description={section.description} onSeeAll={onSeeAll} />
      <View style={[styles.wrap, { paddingHorizontal: Spacing.gutter }]}>
        {categories.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              console.log('Category pressed:', item.id);
              router.push({ pathname: '/store-category/[id]', params: { id: item.id.toString() } });
            }}
            style={({ pressed }) => [
              styles.categoryPress,
              { width: tileWidth },
              pressed && styles.categoryPressed,
            ]}>
            <View style={[styles.iconWrap, { width: iconSize, height: iconSize }]}>
              <Image
                source={item.image}
                style={styles.fill}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={150}
                recyclingKey={String(item.id)}
                placeholder={{ blurhash: IMAGE_BLURHASH }}
                placeholderContentFit="cover"
              />
            </View>
            <Text
              style={[styles.label, { color: colors.foreground, maxWidth: tileWidth }]}
              numberOfLines={2}>
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.md,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CATEGORY_GAP,
  },
  categoryPress: {
    alignItems: 'center',
  },
  categoryPressed: {
    opacity: 0.7,
  },
  iconWrap: {
    marginBottom: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: BorderRadius['2xl'],
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  label: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
});
