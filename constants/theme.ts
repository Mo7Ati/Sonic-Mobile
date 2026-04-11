import { Platform } from 'react-native';

export const Colors = {
  background: '#ffffff',
  foreground: '#262626',
  text: '#262626',

  card: '#ffffff',
  cardForeground: '#262626',

  popover: '#ffffff',
  popoverForeground: '#262626',

  primary: '#f59e0b',
  primaryForeground: '#000000',

  secondary: '#f3f4f6',
  secondaryForeground: '#4b5563',

  muted: '#f9fafb',
  mutedForeground: '#6b7280',

  accent: '#fffbeb',
  accentForeground: '#92400e',

  destructive: '#ef4444',
  destructiveForeground: '#ffffff',

  border: '#e5e7eb',
  input: '#e5e7eb',
  ring: '#f59e0b',

  chart1: '#f59e0b',
  chart2: '#d97706',
  chart3: '#b45309',
  chart4: '#92400e',
  chart5: '#78350f',

  sidebar: '#f9fafb',
  sidebarForeground: '#262626',
  sidebarPrimary: '#f59e0b',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#fffbeb',
  sidebarAccentForeground: '#92400e',
  sidebarBorder: '#e5e7eb',
  sidebarRing: '#f59e0b',

  // derived (not explicitly provided but aligned)
  tint: '#f59e0b',
  icon: '#262626',
  tabIconDefault: '#6b7280',
  tabIconSelected: '#f59e0b',
} as const;

export type ThemeColors = typeof Colors;
export type ColorName = keyof ThemeColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const BorderRadius = {
  sm: 4,   // radius - 4px
  md: 6,   // radius - 2px
  lg: 8,   // radius (0.5rem)
  xl: 12,  // radius + 4px
  full: 9999,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Outfit, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
