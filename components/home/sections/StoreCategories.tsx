import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { BorderRadius, Spacing } from '@/constants/theme';
import { SectionHeader } from './SectionHeader';
import type { Section } from '@/services/home/home-types';
import { StoreCategory } from '@/services/store-categories/types';
import { IMAGE_BLURHASH } from '@/constants/placeholders';
import { Colors } from '@/constants/theme';

const ICON_SIZE = 80;
const TILE_WIDTH = 88;

interface StoreCategoriesProps {
  section: Section;
  onSeeAll?: () => void;
}

export const StoreCategories: React.FC<StoreCategoriesProps> = ({
  section,
  onSeeAll,
}) => {
  const categories = (section.data as StoreCategory[]) || [];
  const router = useRouter();

  if (categories.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title={section.title} description={section.description} />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              router.push({ pathname: '/store-category/[id]', params: { id: item.id.toString() } });
            }}
            style={({ pressed }) => [
              styles.categoryPress,
              pressed && styles.categoryPressed,
            ]}>
            <View style={styles.iconWrap}>
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
              style={[styles.label, { color: Colors.foreground }]}
              numberOfLines={2}>
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.gutter,
    gap: Spacing.sm,
  },
  categoryPress: {
    alignItems: 'center',
    width: TILE_WIDTH,
  },
  categoryPressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
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
    maxWidth: TILE_WIDTH,
  },
});
