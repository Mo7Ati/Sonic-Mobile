import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import type { Section, SectionItem } from '@/services/home/home-types';
import { SectionHeader } from './SectionHeader';
import { IMAGE_BLURHASH } from '@/constants/placeholders';
import { useBanner } from '@/hooks/use-banner';

interface SquareBannersProps {
  section: Section;
  onSeeAll?: () => void;
}

const ITEM_SIZE = 130;


export const SquareBanners: React.FC<SquareBannersProps> = ({
  section,
}) => {
  const items = section.data as SectionItem[];
  const { openBanner } = useBanner();
  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title={section.title} description={section.description} />
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openBanner(item)}
            style={({ pressed }) => [
              styles.card,
              { width: ITEM_SIZE, height: ITEM_SIZE },
              pressed && styles.cardPressed,
            ]}>
            <Image
              source={item.data.image}
              style={styles.fill}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={150}
              recyclingKey={String(item.id)}
              placeholder={{ blurhash: IMAGE_BLURHASH }}
              placeholderContentFit="cover"
            />
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
    marginEnd: 12,
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
    paddingStart: 20,
    paddingEnd: 20,
  },
});
