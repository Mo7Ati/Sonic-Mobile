import React from 'react';
import { View } from 'react-native';

import type { Section } from '@/services/home/home-types';
import { ListItems } from '@/components/home/sections/ListItems';
import { MainBanner } from '@/components/home/sections/MainBanner';
import { RectangleBanners } from '@/components/home/sections/RectangleBanners';
import { SearchSection } from '@/components/home/sections/SearchSection';
import { SquareBanners } from '@/components/home/sections/SquareBanners';
import { StoreCategories } from '@/components/home/sections/StoreCategories';
import { UnPaidOrders } from '@/components/home/sections/UnPaidOrders';
import { WrittenBanner } from '@/components/home/sections/WrittenBanner';

interface SectionRendererProps {
  section: Section;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  const seeAll = () => console.log('See all pressed for:', section.title);

  switch (section.type) {
    case 'search':
      return <SearchSection />;

    case 'main_banners':
      return <MainBanner section={section} />;

    case 'square_banners':
      return <SquareBanners section={section} />;

    case 'rectangle_banners':
      return <RectangleBanners section={section} />;

    case 'store_categories':
      return <StoreCategories section={section} onSeeAll={seeAll} />;

    case 'written_banner':
      return <WrittenBanner section={section} />;

    case 'store_category_list_items':
    case 'group_list_items':
      return <ListItems section={section} onSeeAll={seeAll} />;

    // case 'active_orders':
    //   return (
    //     <ActiveOrders
    //       section={section}
    //       onSeeAll={seeAll}
    //     />
    //   );

    case 'un_paid_orders':
      return <UnPaidOrders section={section} />;

    default:
      return <View />;
  }
};
