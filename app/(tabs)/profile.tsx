import LanguageSwitch from '@/components/profile/language-switch';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Spacing } from '@/constants/theme';

export default function TabThreeScreen() {
  const { colors, font } = useAppTheme();
  const { t } = useTranslation(['profile', 'addresses']);
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* My Addresses */}
      <Pressable
        style={[styles.menuItem, { borderColor: colors.border }]}
        onPress={() => router.push('/addresses')}
      >
        <View style={styles.menuItemLeft}>
          <Ionicons name="location-outline" size={22} color={colors.primary} />
          <Text style={[styles.menuItemText, { color: colors.foreground, fontFamily: font.medium }]}>
            {t('addresses:title')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
      </Pressable>

      {/* Language Switch */}
      <LanguageSwitch />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.gutter,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.tight,
  },
  menuItemText: { fontSize: 16 },
});
