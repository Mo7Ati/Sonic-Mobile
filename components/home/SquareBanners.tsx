import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';

import type { Section, SectionItem } from '@/services/home/home-types';
import { SectionHeader } from './SectionHeader';

interface SquareBannersProps {
  section: Section;
  onSeeAll?: () => void;
}

const ITEM_SIZE = 130;


export const SquareBanners: React.FC<SquareBannersProps> = ({
  section,
}) => {
  const items = section.data as SectionItem[];
  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title={section.title} description={section.description} />
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              { width: ITEM_SIZE, height: ITEM_SIZE },
              pressed && styles.cardPressed,
            ]}>
            <Image source={{ uri: item.data.image ?? '' }} style={styles.fill} resizeMode="cover" />
          </Pressable>
        )}
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
    marginBottom: 16,
  },
  card: {
    marginRight: 12,
    overflow: 'hidden',
    borderRadius: 16,
  },
  cardPressed: {
    transform: [{ scale: 0.95 }],
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  listContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
