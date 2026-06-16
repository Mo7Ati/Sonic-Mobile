import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Carousel from 'react-native-reanimated-carousel';
import type { Section, SectionItem } from '@/services/home/home-types';
import { IMAGE_BLURHASH } from '@/constants/placeholders';
import { useBanner } from '@/hooks/use-banner';

const { width } = Dimensions.get('window');

interface MainBannerProps {
  section: Section;
}

export const MainBanner: React.FC<MainBannerProps> = ({ section }) => {
  const items = section.data as SectionItem[];
  const { openBanner } = useBanner();
  if (!items.length) return null;

  const multipleSlides = items.length > 1;

  return (
    <View style={styles.section}>
      <Carousel
        width={width}
        height={160}
        data={items}
        loop={multipleSlides}
        autoPlay={multipleSlides}
        autoPlayInterval={2000}
        pagingEnabled
        scrollAnimationDuration={800}
        {...(multipleSlides
          ? {
            mode: 'parallax',
            modeConfig: {
              parallaxScrollingOffset: 48,
              parallaxScrollingScale: 0.94,
              parallaxAdjacentItemScale: 0.9,
            },
          }
          : {})}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => openBanner(item)}
          >
            <Image
              source={item.data.image}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
              // priority="high"
              recyclingKey={String(item.id)}
              // placeholder={{ blurhash: IMAGE_BLURHASH }}
              // placeholderContentFit="cover"
            />
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  item: {
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
});