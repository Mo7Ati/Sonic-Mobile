import { Platform } from 'react-native';

export const Colors = {
  background: '#ffffff',
  foreground: '#262626',
  text: '#262626',

  card: '#ffffff',
  cardForeground: '#262626',

  popover: '#ffffff',
  popoverForeground: '#262626',

  primary: '#1B998B',
  primaryForeground: '#ffffff',

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
  icon: "#F59E0B",
  tabIconDefault: '#6b7280',
  tabIconSelected: '#f59e0b',

  /** Links and tappable text accents (distinct from brand primary). */
  link: '#0a7ea4',

  /** Positive / add-to-cart actions. */
  success: '#00875a',
  successForeground: '#ffffff',

  /** Light text on vivid or dark fills (e.g. pills on chart tones). */
  inverseForeground: '#ffffff',

  /** Elevation / modal shadows. */
  shadow: '#000000',

  /** Modal / bottom-sheet scrim */
  modalOverlay: 'rgba(0,0,0,0.4)',

  /** Auth and info callout surfaces */
  surfaceInfo: '#e0f2fe',
  surfaceSuccess: '#f0fdf4',
  surfaceError: '#fef2f2',

  /** Input placeholder (lighter than mutedForeground) */
  placeholder: '#9ca3af',

  /** Success state icons (e.g. checkmarks) */
  successBright: '#16a34a',

  /** Promotional / loyalty accents */
  promotional: '#7C3AED',
  promotionalForeground: '#ffffff',
  /** Soft purple surfaces (e.g. loyalty banners) */
  promotionalSurface: '#F3F0FF',
  /** Text on promotionalSurface */
  promotionalStrong: '#6B21A8',
} as const;

export type ThemeColors = typeof Colors;
export type ColorName = keyof ThemeColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  /** Tight inline meta gaps */
  narrow: 6,
  /** Common list row / chip gap between sm and md */
  tight: 12,
  /** Horizontal padding for screen content (matches prior 20px gutters). */
  gutter: 20,
  md: 16,
  lg: 24,
  xl: 32,
  /** Large vertical rhythm (e.g. auth header block) */
  hero: 36,
  '2xl': 48,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  pill: 20,
  full: 9999,
} as const;

/** System stacks for screens that do not use loaded Outfit (e.g. third-party demos). */
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
});
