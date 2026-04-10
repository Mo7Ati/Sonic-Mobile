import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, View, Dimensions } from 'react-native';
import { SectionHeader } from './SectionHeader';
import type { Section, SectionItem } from '@/services/home/home-types';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 140;

interface RectangleBannersProps {
  section: Section;
}

export const RectangleBanners: React.FC<RectangleBannersProps> = ({ section }) => {
  const items = section.data as SectionItem[];
  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title={section.title} description={section.description} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => console.log('Banner pressed:', item.id)}
            style={styles.card}
          >
            <Image
              source={{ uri: item.data.image ?? '' }}
              style={styles.image}
              resizeMode="cover"
            />
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />
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