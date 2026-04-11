
import { StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useLanguage } from '@/contexts/language-context';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const { language, changeLanguage } = useLanguage();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isArabic = language === 'ar';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedText type="title" style={styles.header}>Profile</ThemedText>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <ThemedText type="defaultSemiBold">Arabic</ThemedText>
            <ThemedText style={{ color: colors.mutedForeground, fontSize: 13 }}>
              {isArabic ? 'العربية' : 'Switch to Arabic'}
            </ThemedText>
          </View>
          <Switch
            value={isArabic}
            onValueChange={(value) => changeLanguage(value ? 'ar' : 'en')}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#ffffff"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 4,
  },
  labelContainer: {
    gap: 2,
  },
});
