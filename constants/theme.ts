import { Platform } from 'react-native';

export const Colors = {
  background: '#f5f5f5',
  foreground: '#1a1a2e',
  text: '#1a1a2e',

  card: '#ffffff',
  cardForeground: '#1a1a2e',

  popover: '#ffffff',
  popoverForeground: '#64748b',

  primary: '#00875a',
  primaryForeground: '#ffffff',

  secondary: '#f0fdf4',
  secondaryForeground: '#14532d',

  muted: '#f1f5f9',
  mutedForeground: '#64748b',

  accent: '#f0fdf4',
  accentForeground: '#14532d',

  destructive: '#dc2626',
  destructiveForeground: '#ffffff',

  border: '#e2e8f0',
  input: '#f8fafc',
  ring: '#00875a',

  chart1: '#00875a',
  chart2: '#3b82f6',
  chart3: '#8b5cf6',
  chart4: '#f59e0b',
  chart5: '#10b981',

  sidebar: '#ffffff',
  sidebarForeground: '#64748b',
  sidebarPrimary: '#00875a',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#f0fdf4',
  sidebarAccentForeground: '#14532d',
  sidebarBorder: '#e2e8f0',
  sidebarRing: '#00875a',

  tint: '#00875a',
  icon: '#94a3b8',
  tabIconDefault: '#94a3b8',
  tabIconSelected: '#00875a',
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
