import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-color';
import type { Section, WrittenBannerData } from '@/services/home/home-types';

interface WrittenBannerProps {
  section: Section;
  onPress?: () => void;
}

export const WrittenBanner: React.FC<WrittenBannerProps> = ({ section, onPress }) => {
  const data = section.data as WrittenBannerData;
  const colors = useThemeColors();

  if (!data) return null;

  const textColor = data.text_color || colors.primaryForeground;
  const bgColor = data.background_color || colors.primary;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: bgColor },
          pressed && styles.cardPressed,
        ]}>
        <View style={[styles.deco1, { backgroundColor: textColor }]} />
        <View style={[styles.deco2, { backgroundColor: textColor }]} />
        <View style={[styles.deco3, { backgroundColor: textColor }]} />

        <View style={styles.row}>
          <View style={styles.textBlock}>
            <Text style={[styles.name, { color: textColor }]}>{data.name}</Text>
            {section.description ? (
              <Text style={[styles.desc, { color: textColor }]}>{section.description}</Text>
            ) : null}
          </View>
          <View style={[styles.arrowBtn, { backgroundColor: `${textColor}15` }]}>
            <Ionicons name="arrow-forward" size={18} color={textColor} />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  cardPressed: {
    opacity: 0.9,
  },
  deco1: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 96,
    height: 96,
    borderRadius: 9999,
    opacity: 0.06,
  },
  deco2: {
    position: 'absolute',
    bottom: -12,
    left: -12,
    width: 64,
    height: 64,
    borderRadius: 9999,
    opacity: 0.06,
  },
  deco3: {
    position: 'absolute',
    right: 32,
    top: 32,
    width: 32,
    height: 32,
    borderRadius: 9999,
    opacity: 0.04,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  textBlock: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  desc: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.7,
  },
  arrowBtn: {
    marginLeft: 12,
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
});
