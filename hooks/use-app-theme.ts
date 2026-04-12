import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { FontFamily } from '@/constants/fonts';
import { TextVariants } from '@/constants/typography';

/**
 * Single entry for design tokens (light theme only for now).
 * Prefer `Spacing` / `BorderRadius` imports in static `StyleSheet.create` when possible.
 */
export function useAppTheme() {
  return {
    colors: Colors,
    spacing: Spacing,
    radius: BorderRadius,
    text: TextVariants,
    font: FontFamily,
  };
}
