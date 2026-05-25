import React, { useEffect } from 'react';
import { View, Image, Dimensions, StyleSheet, Pressable } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import type { Section, SectionItem } from '@/services/home/home-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface MainBannerProps {
  section: Section;
}

export const MainBanner: React.FC<MainBannerProps> = ({ section }) => {
  const items = section.data as SectionItem[];
  if (!items.length) return null;

  // useEffect(() => {
  //   (async () => {
  //     await AsyncStorage.removeItem('@platform_splash');

  //   })();
  // }, []);

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
            onPress={() => console.log('Banner pressed:', item.id)}
          >
            <Image
              source={{ uri: item.data.image ?? '' }}
              style={styles.image}
              resizeMode="cover"
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