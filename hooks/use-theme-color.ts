import { Colors, type ColorName } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

/**
 * Returns the full color palette for the current theme.
 * Usage: const colors = useThemeColors();
 *        <View style={{ backgroundColor: colors.primary }} />
 */
export function useThemeColors() {
  const theme = useColorScheme() ?? 'light';
  return Colors[theme];
}
