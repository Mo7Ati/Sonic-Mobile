import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-color';
import { SectionHeader } from './SectionHeader';
import { Branch, Section } from './types';
import BranchesList from '../branches/branches-list';


export function ListItems({
  section,
  onSeeAll,
}: {
  section: Section;
  onSeeAll: () => void;
}) {
  const items = section.data as Branch[];

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title={section.title} description={section.description} onSeeAll={onSeeAll} />
      <BranchesList branches={items} />
    </View>
  );
}

export default ListItems;

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
});
