import { Text, type TextProps } from 'react-native';

import { FontFamily } from '@/constants/fonts';
import { Colors } from '@/constants/theme';
import { TextVariants } from '@/constants/typography';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

const TYPE_VARIANT: Record<NonNullable<ThemedTextProps['type']>, keyof typeof TextVariants> = {
  default: 'body',
  defaultSemiBold: 'bodySemiBold',
  title: 'title',
  subtitle: 'subtitle',
  link: 'link',
};

const TYPE_FONT: Record<NonNullable<ThemedTextProps['type']>, string> = {
  default: FontFamily.regular,
  defaultSemiBold: FontFamily.semiBold,
  title: FontFamily.bold,
  subtitle: FontFamily.bold,
  link: FontFamily.regular,
};

export function ThemedText({
  style,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const variant = TextVariants[TYPE_VARIANT[type]];
  const color = type === 'link' ? Colors.link : Colors.text;

  return (
    <Text
      style={[
        { color, fontFamily: TYPE_FONT[type] },
        variant,
        style,
      ]}
      {...rest}
    />
  );
}
