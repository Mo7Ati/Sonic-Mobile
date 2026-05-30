import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { I18nManager, Pressable, StyleSheet, type ViewStyle } from 'react-native';

interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
}

export function BackButton({ onPress, style }: BackButtonProps) {
  const router = useRouter();
  const handlePress = onPress ?? (() => router.back());

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      accessibilityRole="button"
    >
      <Ionicons
        name={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
        size={22}
        color={Colors.foreground}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.7,
  },
});
