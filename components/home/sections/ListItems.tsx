import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { Branch } from '@/services/branch/types';
import { Section } from '@/services/home/home-types';
import BranchesList from '@/app/branch/components/branches-list';
import { SectionHeader } from './SectionHeader';


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
