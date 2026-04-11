import { Colors, type ColorName } from '@/constants/theme';

export function useThemeColor(
  _props: { light?: string; dark?: string },
  colorName: ColorName
) {
  return Colors[colorName];
}

export function useThemeColors() {
  return Colors;
}
