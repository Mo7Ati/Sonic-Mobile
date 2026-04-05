import React from 'react';
import { View } from 'react-native';

import { ActiveOrders } from './ActiveOrders';
import BranchList from './BranchList';
import { MainBanner } from './MainBanner';
import { RectangleBanners } from './RectangleBanners';
import { SearchSection } from './SearchSection';
import { SquareBanners } from './SquareBanners';
import { StoreCategories } from './StoreCategories';
import { UnPaidOrders } from './UnPaidOrders';
import { WrittenBanner } from './WrittenBanner';
import type { Section, SectionCallbacks } from './types';

interface SectionRendererProps {
  section: Section;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  const seeAll = () => console.log('See all pressed for:', section.title);

  switch (section.type) {
    case 'search':
      return <SearchSection />;

    case 'main_banners':
      return (
        <MainBanner
          section={section}
        />
      );

    case 'square_banners':
      return (
        <SquareBanners
          section={section}
        />
      );

    case 'rectangle_banners':
      return (
        <RectangleBanners
          section={section}
        />
      );

    case 'store_categories':
      return (
        <StoreCategories
          section={section}
          onSeeAll={seeAll}
        />
      );

    case 'written_banner':
      return <WrittenBanner section={section} />;

    // LIST_ITEMS sections come through as "{type}_list_items" from the API
    case 'store_category_list_items':
    case 'group_list_items':
      return (
        <BranchList
          section={section}
          onSeeAll={seeAll}
        />
      );

    case 'active_orders':
      return (
        <ActiveOrders
          section={section}
          onSeeAll={seeAll}
        />
      );

    case 'un_paid_orders':
      return <UnPaidOrders section={section} />;

    default:
      return <View />;
  }
};
