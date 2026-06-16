import React from 'react';
import { Pressable, StyleSheet, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { SectionHeader } from './SectionHeader';
import type { Section, SectionItem } from '@/services/home/home-types';
import { IMAGE_BLURHASH } from '@/constants/placeholders';
import { useBanner } from '@/hooks/use-banner';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 140;

interface RectangleBannersProps {
  section: Section;
}

export const RectangleBanners: React.FC<RectangleBannersProps> = ({ section }) => {
  const items = section.data as SectionItem[];
  const { openBanner } = useBanner();
  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title={section.title} description={section.description} />
      {items.map((item) => (
        <Pressable
          key={item.id.toString()}
          onPress={() => openBanner(item)}
          style={styles.card}
        >
          <Image
            source={item.data.image}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={150}
            recyclingKey={String(item.id)}
            // placeholder={{ blurhash: IMAGE_BLURHASH }}
            // placeholderContentFit="cover"
          />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  card: {
    width: width,     // full width
    height: ITEM_HEIGHT,
    padding: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    padding: 6,
  },
});