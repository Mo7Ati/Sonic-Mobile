import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Core
    background: '#f5f5f5',
    foreground: '#1a1a2e',
    text: '#1a1a2e',

    // Card
    card: '#ffffff',
    cardForeground: '#1a1a2e',

    // Popover
    popover: '#ffffff',
    popoverForeground: '#64748b',

    // Primary
    primary: '#00875a',
    primaryForeground: '#ffffff',

    // Secondary
    secondary: '#f0fdf4',
    secondaryForeground: '#14532d',

    // Muted
    muted: '#f1f5f9',
    mutedForeground: '#64748b',

    // Accent
    accent: '#f0fdf4',
    accentForeground: '#14532d',

    // Destructive
    destructive: '#dc2626',
    destructiveForeground: '#ffffff',

    // Border & Input
    border: '#e2e8f0',
    input: '#f8fafc',
    ring: '#00875a',

    // Charts
    chart1: '#00875a',
    chart2: '#3b82f6',
    chart3: '#8b5cf6',
    chart4: '#f59e0b',
    chart5: '#10b981',

    // Sidebar
    sidebar: '#ffffff',
    sidebarForeground: '#64748b',
    sidebarPrimary: '#00875a',
    sidebarPrimaryForeground: '#ffffff',
    sidebarAccent: '#f0fdf4',
    sidebarAccentForeground: '#14532d',
    sidebarBorder: '#e2e8f0',
    sidebarRing: '#00875a',

    // Tab bar (mapped from theme)
    tint: '#00875a',
    icon: '#94a3b8',
    tabIconDefault: '#94a3b8',
    tabIconSelected: '#00875a',
  },
  dark: {
    // Core
    background: '#0f172a',
    foreground: '#f1f5f9',
    text: '#f1f5f9',

    // Card
    card: '#1e293b',
    cardForeground: '#f1f5f9',

    // Popover
    popover: '#1e293b',
    popoverForeground: '#94a3b8',

    // Primary
    primary: '#22c55e',
    primaryForeground: '#052e16',

    // Secondary
    secondary: '#1e293b',
    secondaryForeground: '#f1f5f9',

    // Muted
    muted: '#334155',
    mutedForeground: '#94a3b8',

    // Accent
    accent: '#1a3a2a',
    accentForeground: '#bbf7d0',

    // Destructive
    destructive: '#991b1b',
    destructiveForeground: '#fef2f2',

    // Border & Input
    border: '#334155',
    input: '#1e293b',
    ring: '#22c55e',

    // Charts
    chart1: '#22c55e',
    chart2: '#60a5fa',
    chart3: '#a78bfa',
    chart4: '#fbbf24',
    chart5: '#2dd4bf',

    // Sidebar
    sidebar: '#0f172a',
    sidebarForeground: '#94a3b8',
    sidebarPrimary: '#22c55e',
    sidebarPrimaryForeground: '#052e16',
    sidebarAccent: '#1a3a2a',
    sidebarAccentForeground: '#bbf7d0',
    sidebarBorder: '#334155',
    sidebarRing: '#22c55e',

    // Tab bar (mapped from theme)
    tint: '#22c55e',
    icon: '#64748b',
    tabIconDefault: '#64748b',
    tabIconSelected: '#22c55e',
  },
} as const;

export type ThemeColors = typeof Colors.light;
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
