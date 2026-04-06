import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-color';

interface SearchSectionProps {
  onPress?: () => void;
  placeholder?: string;
  editable?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  onPress,
  placeholder = 'Search stores, products...',
  editable = false,
  value,
  onChangeText,
}) => {
  const colors = useThemeColors();

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={editable ? undefined : onPress}
        style={({ pressed }) => [
          styles.bar,
          { backgroundColor: colors.input },
          !editable && pressed && { opacity: 0.8 },
        ]}>
        <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
        {editable ? (
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedForeground}
            value={value}
            onChangeText={onChangeText}
            autoCapitalize="none"
            autoCorrect={false}
          />
        ) : (
          <Text style={[styles.placeholder, { color: colors.mutedForeground }]}>{placeholder}</Text>
        )}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Pressable style={styles.filterHit} hitSlop={8}>
          <Ionicons name="options-outline" size={18} color={colors.foreground} />
        </Pressable>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  placeholder: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  divider: {
    height: 28,
    width: 1,
  },
  filterHit: {
    marginLeft: 10,
  },
});
