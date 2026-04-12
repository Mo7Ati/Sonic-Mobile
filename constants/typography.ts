import type { TextStyle } from 'react-native';

/** Size and rhythm only; pair with `FontFamily` in components. */
export const TextVariants = {
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodySemiBold: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 28,
  },
  link: {
    fontSize: 16,
    lineHeight: 30,
  },
} as const satisfies Record<string, Pick<TextStyle, 'fontSize' | 'lineHeight'>>;

export type TextVariantName = keyof typeof TextVariants;
