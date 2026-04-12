import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export default function TabTwoScreen() {
  const { t } = useTranslation('orders');

  return (
    <ParallaxScrollView
      headerBackgroundColor={Colors.secondary}
      headerImage={
        <IconSymbol
          size={310}
          color={Colors.mutedForeground}
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t('header.title')}</ThemedText>
      </ThemedView>
      <ThemedText>{t('intro.body')}</ThemedText>
      <Collapsible title={t('collapsible.routing_title')}>
        <ThemedText>
          {t('collapsible.routing_intro')}{' '}
          <ThemedText type="defaultSemiBold">{t('paths.index_tab')}</ThemedText>{' '}
          {t('collapsible.routing_conjunction')}{' '}
          <ThemedText type="defaultSemiBold">{t('paths.explore_tab')}</ThemedText>
        </ThemedText>
        <ThemedText>
          {t('collapsible.routing_tabs_prefix')}{' '}
          <ThemedText type="defaultSemiBold">{t('paths.tabs_layout')}</ThemedText>{' '}
          {t('collapsible.routing_tabs_suffix')}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">{t('collapsible.routing_learn_more')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('collapsible.platforms_title')}>
        <ThemedText>{t('collapsible.platforms_body')}</ThemedText>
      </Collapsible>
      <Collapsible title={t('collapsible.images_title')}>
        <ThemedText>
          {t('collapsible.images_body')}
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">{t('collapsible.routing_learn_more')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('collapsible.animations_title')}>
        <ThemedText>
          {t('collapsible.animations_body')}
        </ThemedText>
        {Platform.select({
          ios: <ThemedText>{t('collapsible.parallax_ios')}</ThemedText>,
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: Colors.mutedForeground,
    bottom: -90,
    start: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
