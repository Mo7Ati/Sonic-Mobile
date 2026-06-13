import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import type { SectionItem } from '@/services/home/home-types';

/**
 * Resolves a banner/section item to its destination and navigates there.
 *
 * Banner items (main / square / rectangle banners) all share the same shape:
 * a `type` describing the destination and a `data` payload carrying the id or
 * url for that destination.
 */
export const useBanner = () => {
    const router = useRouter();

    const openBanner = useCallback(
        (item: SectionItem) => {
            const { type, data } = item;

            switch (type) {
                case 'store':
                    if (data.store_id != null) {
                        router.push({
                            pathname: '/branch/[id]',
                            params: { id: data.store_id },
                        });
                    }
                    return;

                case 'store_category':
                    if (data.store_category_id != null) {
                        router.push({
                            pathname: '/store-category/[id]',
                            params: { id: data.store_category_id },
                        });
                    }
                    return;

                case 'external_link':
                    if (data.external_link) {
                        WebBrowser.openBrowserAsync(data.external_link);
                    }
                    return;

                case 'group':
                    // No dedicated group screen yet — wire this up once the route exists.
                    if (__DEV__) {
                        console.warn('Banner "group" navigation not implemented yet', data.group_id);
                    }
                    return;

                default:
                    if (__DEV__) {
                        console.warn('Unhandled banner type:', type);
                    }
            }
        },
        [router]
    );

    return { openBanner };
};

export default useBanner;
