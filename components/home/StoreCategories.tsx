import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { SectionHeader } from './SectionHeader';
import type { Section } from '@/services/home/home-types';
import { StoreCategory } from '@/services/store-categories/types';

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

  if (categories.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title={section.title} description={section.description} onSeeAll={onSeeAll} />
      <FlatList
        data={categories}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => {
                console.log('Category pressed:', item.id);
                router.push({ pathname: '/store-category/[id]', params: { id: item.id.toString() } })
              }}
              style={({ pressed }) => [styles.categoryPress, pressed && styles.categoryPressed]}>
              <View style={[styles.iconWrap]}>
                <Image source={{ uri: item.image ?? '' }} style={styles.fill} resizeMode="cover" />
              </View>
              <Text style={[styles.label, { color: colors.foreground }]} numberOfLines={1}>
                {item.name}
              </Text>
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.md,
  },
  categoryPress: {
    marginEnd: Spacing.gutter,
    alignItems: 'center',
  },
  categoryPressed: {
    opacity: 0.7,
  },
  iconWrap: {
    marginBottom: Spacing.sm,
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: BorderRadius.xl,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  label: {
    maxWidth: 64,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
  },
  listContent: {
    paddingStart: Spacing.gutter,
    paddingEnd: Spacing.gutter,
  },
});
