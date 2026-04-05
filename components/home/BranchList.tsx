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

const CARD_WIDTH = 272;

const BranchCard = ({
  item,
  onPress,
}: {
  item: Branch;
  onPress?: () => void;
}) => {
  const colors = useThemeColors();

  const cardShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  };

  const feeLabel = 15;
  // item.delivery_fee === undefined || item.delivery_fee === null
  //   ? null
  //   : item.delivery_fee === 0
  //     ? 'Free'
  //     : `$${item.delivery_fee.toFixed(2)}`;

  const ratingText =
    item.rating != null
      ? item.ratings_count != null
        ? `${item.rating.toFixed(1)} (${item.ratings_count})`
        : item.rating.toFixed(1)
      : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        cardShadow,
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.cardRow}>
        <View style={[styles.logoWrap, { backgroundColor: colors.muted }]}>
          {item.store.logo ? (
            <Image source={{ uri: item.store.logo }} style={styles.logo} resizeMode="cover" />
          ) : (
            <Ionicons name="storefront-outline" size={22} color={colors.mutedForeground} />
          )}
        </View>
        <View style={styles.cardTextCol}>
          <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.branchName, { color: colors.muted }]} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </View>

      <View style={[styles.metaRow, { borderTopColor: colors.border }]}>
        {ratingText ? (
          <View style={styles.metaItem}>
            <Ionicons name="star" size={12} color={colors.primary} />
            <Text style={[styles.metaText, { color: colors.foreground }]}>{ratingText}</Text>
          </View>
        ) : null}
        {item.delivery_time ? (
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color={colors.primary} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]} numberOfLines={1}>
              {item.delivery_time}
            </Text>
          </View>
        ) : null}
        {feeLabel ? (
          <View style={styles.metaItem}>
            <Ionicons name="bicycle-outline" size={12} color={colors.primary} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{feeLabel}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

export function BranchList({
  section,
  onSeeAll,
}: {
  section: Section;
  onSeeAll: () => void;
}) {
  const branches = (section.data as Branch[]) || [];

  if (branches.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title={section.title} description={section.description} onSeeAll={onSeeAll} />
      <FlatList
        data={branches}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BranchCard item={item} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

export default BranchList;

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  listContent: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  logoWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  cardTextCol: {
    flex: 1,
    minWidth: 0,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  branchName: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
